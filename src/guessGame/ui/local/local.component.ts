import {
  Component,
  inject,
  OnInit,
  WritableSignal,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ApiDictionaryContent } from '../../../dictionary/infrastructure/models/dictionary-api.model';
import { CommonModule } from '@angular/common';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import {
  LocalKeys,
  LocalManagerService,
} from '../../../shared/LocalManager/storage.servicee';
import { GuessUseCaseService } from '../../application/guess-use-case.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-local',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css',
})
export class LocalComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  _guessUseCase = inject(GuessUseCaseService);
  _decodeJwtService = inject(DecodeJwtService);
  _route = inject(ActivatedRoute);

  searchControl = new FormControl('');
  level = 0;
  usedSigns = signal<Set<string>>(new Set());
  currentSign: WritableSignal<ApiDictionaryContent | null> = signal(null);
  isGameOver = signal(false);
  allSigns: ApiDictionaryContent[] = [];
  filteredItems: ApiDictionaryContent[] = [];
  isLoading = signal(true);
  points = signal(0);
  correctGuesses = signal(0);
  startTime: number = 0;
  elapsedTime = signal(0);
  currentSignStartTime: number = 0;
  userHighPoints = signal<{
    id: string;
    points: number;
    quantity: number;
  } | null>(null);
  lastGameData = signal<{ points: number; quantity: number } | null>(null);

  ngOnInit() {
    this.level = Number(this._route.snapshot.paramMap.get('level'));
    // Simula la carga de datos desde un servicio
    this._guessUseCase.getAllContent(this.level).subscribe((data) => {
      this.allSigns = data;
      this.isLoading.set(false);
      this.startTime = Date.now();
      this.updateElapsedTime();
      this.nextSign();
    });

    this.getUserHighPoints();

    // Optimiza la búsqueda con debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.filteredItems = this._filter(value || '');
      });
  }

  // Filtra las opciones sin eliminar ninguna
  private _filter(value: string): ApiDictionaryContent[] {
    const filterValue = value.toLowerCase();
    return this.allSigns.filter((sign) =>
      sign.name.toLowerCase().includes(filterValue)
    );
  }

  nextSign() {
    const availableSigns = this.allSigns.filter(
      (s) => !this.usedSigns().has(s.id)
    );
    if (availableSigns.length === 0) {
      this.isGameOver.set(true);
      this.sendDataPoints();
      return;
    }
    const randomSign =
      availableSigns[Math.floor(Math.random() * availableSigns.length)];
    this.currentSign.set(randomSign);
    this.currentSignStartTime = Date.now(); // Reinicia el temporizador de la carta actual
  }

  selectItem(item: ApiDictionaryContent) {
    this.searchControl.setValue(item.name);
    this.filteredItems = [];
    this.guess(item.name);
    this.searchControl.setValue('');
    this.searchInput.nativeElement.focus(); // Focus on the input after selecting an item
  }

  guess(signName: string) {
    if (signName === this.currentSign()?.name) {
      this.usedSigns().add(this.currentSign()?.id!);
      const currentSignTime = Math.floor(
        (Date.now() - this.currentSignStartTime) / 1000
      );
      let pointsToAdd = 10;
      if (currentSignTime <= 5) {
        pointsToAdd += 5; // Puntos extra por adivinar en menos de 5 segundos
      }
      this.points.update((points) => points + pointsToAdd);
      this.correctGuesses.update((guesses) => guesses + 1);
      this.nextSign();
    } else {
      this.isGameOver.set(true);
      this.sendDataPoints();
    }
  }

  resetGame() {
    this.usedSigns.set(new Set());
    this.isGameOver.set(false);
    this.searchControl.setValue('');
    this.points.set(0);
    this.correctGuesses.set(0);
    this.startTime = Date.now();
    this.nextSign();
  }

  updateElapsedTime() {
    setInterval(() => {
      if (!this.isGameOver()) {
        this.elapsedTime.set(Math.floor((Date.now() - this.startTime) / 1000));
      }
    }, 1000);
  }

  sendDataPoints() {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      const userID = this._decodeJwtService.decodeId(token);
      //conver userID to number

      const data = {
        userID: userID,
        points: this.points(),
        quantity: this.correctGuesses(),
      };

      this._guessUseCase.updateUserPoints(data).subscribe((response) => {
        console.log('Data sent', response);
        this.lastGameData.set({ points: data.points, quantity: data.quantity });
      });
    } else {
      // Handle the case where the token is null
      console.error('Token is null');
    }
  }

  getUserHighPoints() {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      const userID = this._decodeJwtService.decodeId(token);
      //conver userID to number

      this._guessUseCase.getUserPoints(userID).subscribe((data) => {
        this.userHighPoints.set({
          id: userID,
          points: data.points,
          quantity: data.quantity,
        });
      });
    } else {
      // Handle the case where the token is null
      console.error('Token is null');
    }
  }
}
