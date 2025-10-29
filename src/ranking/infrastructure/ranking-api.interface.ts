import { Observable } from "rxjs";
import { RankingGuess, RankingMemory, RankingSequence } from "../domain/ranking.model";

export interface RankingInterface{
    getRankingGuess(): Observable<RankingGuess[]>;

    getRankingMemory(): Observable<RankingMemory[]>;

    getRankingSequence(): Observable<RankingSequence[]>;
}