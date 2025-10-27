import { Grades } from "../../../shared/interfaces/grades.interface";

export interface MemoryApiGame {
  id: string;
  points: number;
}

export interface MemoryLevel {
  name: string;
  grade: Grades;
  points: number;
  level: number;
  unlocked: boolean;
}