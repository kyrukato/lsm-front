import { inject, Injectable } from '@angular/core';
import { GuessApiService } from '../infrastructure/guess-api.service';
import { GuessApiGame, GuessPVP } from '../infrastructure/models/guess-api.model';

@Injectable({
  providedIn: 'root',
})
export class GuessUseCaseService {
  private _guessApiService = inject(GuessApiService);

  getAllContent(level:number) {
    return this._guessApiService.getAllContent(level);
  }

  getUserPoints(id: string) {
    return this._guessApiService.getUserPoints(id);
  }

  getLevels(id: string){
    return this._guessApiService.getLevels(id);
  }

  updateUserPoints(data: GuessApiGame) {
    return this._guessApiService.updateUserPoints(data);
  }

  updateVictorys(data: GuessPVP){
    return this._guessApiService.updatePVPVictorys(data);
  }
}
