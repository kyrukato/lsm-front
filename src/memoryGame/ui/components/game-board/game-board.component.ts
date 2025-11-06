import { Component, inject, input, OnInit } from '@angular/core';
import { MemoryLocalUseCaseService } from '../../../application/memory-local-use-case.service';
import { CardMemoryGameModel } from '../../../domain/memory-local.model';
import { CardComponent } from '../card/card.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css',
})
export class GameBoardComponent implements OnInit{
  private _router = inject(Router)
  private _memoryLocalUseCaseService = inject(MemoryLocalUseCaseService);
  level = input<number>();

  cards = this._memoryLocalUseCaseService.cards;
  isGameEnded = this._memoryLocalUseCaseService.isGameEnded;
  moves = this._memoryLocalUseCaseService.moves;
  elapsedTime = this._memoryLocalUseCaseService.elapsedTime;
  
  
  ngOnInit(): void {
    console.log('Nivel desde tablero: ', this.level());
    this._memoryLocalUseCaseService.setLevel(this.level()!);
  }
  onCardClick(card: CardMemoryGameModel) {
    this._memoryLocalUseCaseService.flipCard(card);
  }

  restartGame() {
    // relaod page
    window.location.reload();
  }

  backLevels(){
    this._router.navigate(['dashboard/memory/local'])
  }
}
