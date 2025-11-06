import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from '../components/game-board/game-board.component';
import { MemoryLocalUseCaseService } from '../../application/memory-local-use-case.service';
import { ScoreboardComponent } from '../components/scoreboard/scoreboard.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-memory-local',
  standalone: true,
  imports: [CommonModule, GameBoardComponent, ScoreboardComponent],
  templateUrl: './memory-local.component.html',
  styleUrls: ['./memory-local.component.css'],
})
export class MemoryLocalComponent implements OnInit {
  private _memoryUseCase = inject(MemoryLocalUseCaseService);
  private _route = inject(ActivatedRoute);

  level = 0;

  ngOnInit(): void {
    this.level = Number(this._route.snapshot.paramMap.get('level'));
    console.log('Nivel desde componente ',this.level)
  }
}
