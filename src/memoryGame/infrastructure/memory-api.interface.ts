import { Observable } from 'rxjs';
import { ApiDictionaryContent } from '../../dictionary/infrastructure/models/dictionary-api.model';
import { MemoryApiGame, MemoryPVP } from './models/memory-api.model';

export interface MemoryLocalGame {
  getAllContent(level:number): Observable<ApiDictionaryContent[]>;

  getUserPoints(id: string): Observable<MemoryApiGame>;

  updateUserPoints(data: MemoryApiGame): Observable<MemoryApiGame>;

  compareWords(word: string, wordToCompare: string): boolean;

  updateVictorys(data: MemoryPVP): Observable<MemoryPVP>;
}



