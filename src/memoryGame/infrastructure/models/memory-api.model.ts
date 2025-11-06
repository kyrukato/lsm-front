import { Grades } from "../../../shared/interfaces/grades.interface";

export interface MemoryApiGame {
  userID: string;
  points: number;
}

export interface MemoryLevel {
  name: string;
  grade: Grades;
  points: number;
  level: number;
  unlocked: boolean;
}