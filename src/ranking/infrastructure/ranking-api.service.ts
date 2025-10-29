import { inject, Injectable } from "@angular/core";
import { RankingInterface } from "./ranking-api.interface";
import { Observable } from "rxjs";
import { RankingGuess, RankingMemory, RankingSequence } from "../domain/ranking.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root',
})
export class RankingApiService implements RankingInterface{
    private _httpClient = inject(HttpClient);
    private URL_RANKING_GUESS = environment.URL_GUESS_PVP;
    private URL_RANKING_MEMORY = environment.URL_MEMORY_PVP;
    private URL_RANKING_SEQUENCE = environment.URL_SEQUENCE_PVP;
    
    getRankingGuess(): Observable<RankingGuess[]>{
        return this._httpClient.get<RankingGuess[]>(`${this.URL_RANKING_GUESS}/ranking`);
    }

    getRankingMemory(): Observable<RankingMemory[]>{
        return this._httpClient.get<RankingMemory[]>(`${this.URL_RANKING_MEMORY}/ranking`)
    }

    getRankingSequence(): Observable<RankingSequence[]>{
        return this._httpClient.get<RankingSequence[]>(`${this.URL_RANKING_SEQUENCE}/ranking`);
    }
}