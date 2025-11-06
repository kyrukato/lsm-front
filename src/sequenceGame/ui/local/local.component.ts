import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

// Model imports
import { ApiDictionaryContent } from '../../../dictionary/infrastructure/models/dictionary-api.model';

// Service imports
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import {
  LocalKeys,
  LocalManagerService,
} from '../../../shared/LocalManager/storage.servicee';
import { SequenceUseCaseService } from '../../application/sequence-use-case.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-local',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css'],
})
export class LocalComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  // Dependency Injection
  private _sequenceUseCase = inject(SequenceUseCaseService);
  private _decodeJwtService = inject(DecodeJwtService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router)

  // Form Control
  searchControl = new FormControl('');

  // Signals for game state
  public _sequence = signal<ApiDictionaryContent[]>([]);
  public _userSequence = signal<string[]>([]);

  // Computed and readable signals
  currentSign = computed(() =>
    this._sequence().length > 0
      ? this._sequence()[this._sequence().length - 1]
      : null
  );

  isGameOver = signal(false);
  allSigns: ApiDictionaryContent[] = [];
  level = 0;

  filteredItems: ApiDictionaryContent[] = [];

  elapsedTime = signal(0);
  private timer: any;

  ngOnInit() {
    this.level = Number(this._route.snapshot.paramMap.get('level'));
    // Load content and initialize game
    this._sequenceUseCase.getAllContent(this.level).subscribe((data) => {
      this.allSigns = data;
      this.isLoading.set(false);
      this.startSequence();
    });

    // Get user high points
    this.getUserHighPoints();

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.filteredItems = this._filter(value || '');
      });
  }

  isLoading = signal(true);
  points = signal(0);
  sequenceRemembered = signal(0);

  // Filtra las opciones sin eliminar ninguna
  private _filter(value: string): ApiDictionaryContent[] {
    const filterValue = value.toLowerCase();
    return this.allSigns.filter((sign) =>
      sign.name.toLowerCase().includes(filterValue)
    );
  }

  userHighPoints = signal<{
    id: string;
    points: number;
    sequenceRemembered: number;
  } | null>(null);

  // Signal for modal image
  modalImage = signal<string | null>(null);

  startTimer() {
    this.elapsedTime.set(0);
    this.timer = setInterval(() => {
      if (!this.isGameOver()) {
        this.elapsedTime.update((time) => time + 1);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  nextSign() {
    const randomSign =
      this.allSigns[Math.floor(Math.random() * this.allSigns.length)];
    this._sequence.update((sequence) => [...sequence, randomSign]);
  }

  startSequence() {
    this._sequence.set([]);
    this._userSequence.set([]);
    this.isGameOver.set(false);
    this.points.set(0);
    this.sequenceRemembered.set(0);
    this.startTimer();
    this.nextSign();
  }

  checkSequence() {
    const currentSequence = this._sequence();
    const userSequence = this._userSequence();

    for (let i = 0; i < userSequence.length; i++) {
      if (userSequence[i] !== currentSequence[i].name) {
        this.isGameOver.set(true);
        this.stopTimer();
        this.sendDataPoints();
        return;
      }
    }

    this.points.update((points) => points + 10);
    this.sequenceRemembered.update((count) => count + 1);
    this._userSequence.set([]);
    this.nextSign();
  }

  addUserInput(name: string) {
    this.searchControl.setValue(name);
    this.filteredItems = [];

    this._userSequence.update((sequence) => [...sequence, name]);

    if (this._userSequence().length === this._sequence().length) {
      this.checkSequence();
    }
    this.searchControl.setValue('');
    this.searchInput.nativeElement.focus(); // Focus on
  }

  resetGame() {
    this._sequence.set([]);
    this._userSequence.set([]);
    this.isGameOver.set(false);
    this.searchControl.setValue('');
    this.points.set(0);
    this.sequenceRemembered.set(0);
    this.elapsedTime.set(0);
    this.startTimer();
    this.nextSign();
  }

  sendDataPoints() {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      const userID = this._decodeJwtService.decodeId(token);
      const data = {
        userID,
        points: this.points(),
        sequenceRemembered: this.sequenceRemembered(),
      };

      this._sequenceUseCase.saveUserPoints(data).subscribe({
        next: (response) => console.log('Data sent', response),
        error: (error) => console.error('Error sending points', error),
      });
    } else {
      console.error('Token is null');
    }
  }

  getUserHighPoints() {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      const userID = this._decodeJwtService.decodeId(token);
      this._sequenceUseCase.getUserPoints(userID).subscribe({
        next: (data) => {
          this.userHighPoints.set({
            id: userID,
            points: data.points,
            sequenceRemembered: data.sequenceRemembered,
          });
          console.log('User high points', data);
        },
        error: (error) => console.error('Error fetching high points', error),
      });
    } else {
      console.error('Token is null');
    }
  }

  showModal(imageURL: string) {
    this.modalImage.set(imageURL);
    (document.getElementById('imageModal') as HTMLDialogElement).showModal();
  }

  backLevels(){
    this._router.navigate(['/dashboard/sequence/local'])
  }
}
