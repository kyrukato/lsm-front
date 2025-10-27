import { Component, inject, OnInit, signal } from '@angular/core';
import { SequenceUseCaseService } from '../../../application/sequence-use-case.service';
import { Router } from '@angular/router';
import { GuessLevel } from '../../../../guessGame/infrastructure/models/guess-api.model';
import { Grades } from '../../../../shared/interfaces/grades.interface';
import { DecodeJwtService } from '../../../../shared/LocalManager/decode.jwt';
import { LocalManagerService, LocalKeys } from '../../../../shared/LocalManager/storage.servicee';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent implements OnInit {
  _sequenceUseCase = inject(SequenceUseCaseService);
  _decodeJWTService = inject(DecodeJwtService);
  _router = inject(Router);

  categories = [
    { name: 'Abecedario', grade: Grades.a1, level: 1 },
    { name: 'Números', grade: Grades.a1, level: 2 },
    { name: 'Colores', grade: Grades.a1, level: 3 },
    { name: 'Frutas y Verduras', grade: Grades.a2, level: 4 },
    { name: 'Fechas', grade: Grades.a2, level: 5 },
  ];

  // Signals
  userData = signal<GuessLevel[] | null>(null);

  ngOnInit(): void {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if(token){
      const userID = this._decodeJWTService.decodeId(token);
      this._sequenceUseCase.getLevels(userID).subscribe((data) => {
        const levels = data.sort((a,b) => a.level - b.level).slice(0,5);
        console.log('PRE: ',levels)
        const merged = this.categories.map(cat => {
          const userLevel = levels.find(l => l.level === cat.level);
          return {
            ...cat,
            points: userLevel?.points ?? 0,
            unlocked: userLevel?.unlocked ?? false,
          };
        });
        this.userData.set(merged);
        console.log(this.userData())
      });
    }
  }

  play(level:number){
    this._router.navigate(['/dashboard/sequence/local/game',level]);
  }
}
