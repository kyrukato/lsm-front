import { Component, inject, OnInit, signal } from '@angular/core';
import { MemoryLocalUseCaseService } from '../../../application/memory-local-use-case.service';
import { DecodeJwtService } from '../../../../shared/LocalManager/decode.jwt';
import { Router } from '@angular/router';
import { Grades } from '../../../../shared/interfaces/grades.interface';
import { LocalKeys, LocalManagerService } from '../../../../shared/LocalManager/storage.servicee';
import { MemoryApiService } from '../../../infrastructure/memory-api.service';
import { MemoryLevel } from '../../../infrastructure/models/memory-api.model';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent implements OnInit {
  _memoryService = inject(MemoryApiService);
  _decodeJWTService = inject(DecodeJwtService);
  _router = inject(Router);

  categories = [
    { name: 'Abecedario', grade: Grades.a1, level: 1 },
    { name: 'Números', grade: Grades.a1, level: 2 },
    { name: 'Colores', grade: Grades.a1, level: 3 },
    { name: 'Frutas y Verduras', grade: Grades.a2, level: 4 },
    { name: 'Fechas', grade: Grades.a2, level: 5 },
  ];

  userData = signal<MemoryLevel[] | null>(null);

  ngOnInit(): void {
    const token = LocalManagerService.getElement(LocalKeys.token);
    if (token) {
      const userID = this._decodeJWTService.decodeId(token);
      this._memoryService.getLevels(userID).subscribe((data) => {
        console.log(data);
        const levels = data.sort((a,b) => a.level - b.level).slice(0,5);
        const merged = this.categories.map( cat => {
          const userLevel = levels.find(l => l.level === cat.level);
          return{
            ...cat,
            points: userLevel?.points ?? 0,
            unlocked: userLevel?.unlocked ?? false,
          };
        })
        this.userData.set(merged);
      });
    }
  }

  play(level:number){
    this._router.navigate(['/dashboard/memory/local/game',level]);
  }

}
