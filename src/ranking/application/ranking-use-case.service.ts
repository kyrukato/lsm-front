import { inject, Injectable } from "@angular/core";
import { RankingApiService } from "../infrastructure/ranking-api.service";

@Injectable({
    providedIn: 'root',
})
export class RankingUseCaseService {
    private _rankingApiService = inject(RankingApiService);

    getRankingGuess(){
        return this._rankingApiService.getRankingGuess();
    }

    getRankingMemory(){
        return this._rankingApiService.getRankingMemory();
    }

    getRankingSequence(){
        return this._rankingApiService.getRankingSequence();
    }
}