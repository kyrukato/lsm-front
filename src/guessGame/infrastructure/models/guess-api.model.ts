import { Grades } from "../../../shared/interfaces/grades.interface";

export interface GuessApiGame {
  userID: string;
  points: number;
  quantity: number;
}


export interface GuessLevel {
  name: string;
  grade: Grades;
  points: number;
  level: number;
  unlocked: boolean;
}