import { interval, takeUntil } from 'rxjs';
import { Component, inject } from '@angular/core';
import { MemoryLocalUseCaseService } from '../../../application/memory-local-use-case.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
})
export class ScoreboardComponent {
  private _MemoryLocalUseCaseService = inject(MemoryLocalUseCaseService);

  moves = this._MemoryLocalUseCaseService.moves;
  matchedPairs = this._MemoryLocalUseCaseService.matchedPairs;
  totalPairs = this._MemoryLocalUseCaseService.totalPairs;
  elapsedTime = this._MemoryLocalUseCaseService.elapsedTime;
  points = this._MemoryLocalUseCaseService.points;

  constructor() {
    this.startTimer();
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this._MemoryLocalUseCaseService.gameOver))
      .subscribe(() => {
        this._MemoryLocalUseCaseService.incrementTime();
      });
  }
}
