export interface RankingGuess{
    id: number;
    victorys: number;
    points: number;
    quantity: number;
    user: string;
}

export interface RankingMemory{
    id: number;
    victorys:  number;
    user: string;
}

export interface RankingSequence{
    id: number;
    victorys: number;
    sequenceRemembered: number;
    points: number;
    user: string;
}