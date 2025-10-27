import { inject, Injectable } from '@angular/core';
import { SequenceApiService } from '../infrastructure/sequence-api.service';
import { SequenceGame } from '../infrastructure/models/sequence-local-api.modal';

@Injectable({
  providedIn: 'root',
})
export class SequenceUseCaseService {
  _sequenceApiService = inject(SequenceApiService);

  getAllContent(level:number) {
    return this._sequenceApiService.getAllContent(level);
  }

  getLevels(id:string){
    return this._sequenceApiService.getLevels(id);
  }

  getUserPoints(id: string) {
    return this._sequenceApiService.getUserPoints(id);
  }

  saveUserPoints(data: SequenceGame) {
    return this._sequenceApiService.saveUserPoints(data);
  }
}
