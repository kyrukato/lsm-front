import { DictionaryContent } from '../../dictionary/domain/dictionary.model';

export interface MemoryLocalModel {
  id: string;
  points: number;
}

export interface CardMemoryGameModel extends DictionaryContent {
  index: number;
  flipped: boolean;
  matched: boolean;
}


