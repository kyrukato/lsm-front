import { Observable } from 'rxjs';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { SequenceGame, SequencePVP } from './models/sequence-local-api.modal';

export interface SequenceLocalGame {
  getAllContent(level:number): Observable<ApiDictionaryContent[]>;

  getUserPoints(id: string): Observable<SequenceGame>;

  saveUserPoints(data: SequenceGame): Observable<SequenceGame>;

  updateVictorys(data: SequencePVP): Observable<SequencePVP>;
}
