import { Observable } from 'rxjs';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { GuessApiGame, GuessPVP } from './models/guess-api.model';

export interface GuessLocalGame {
  getAllContent(level:Number): Observable<ApiDictionaryContent[]>;

  getUserPoints(id: string): Observable<GuessApiGame>;

  updateUserPoints(data: GuessApiGame): Observable<GuessApiGame>;

  updatePVPVictorys(data: GuessPVP): Observable<GuessPVP>;

}
