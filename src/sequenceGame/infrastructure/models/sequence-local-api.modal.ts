import { Grades } from "../../../shared/interfaces/grades.interface";

export interface SequenceGame {
  points: number;
  sequenceRemembered: number;
  userID: string;
}

export interface SequencePVP {
  userID: string;
}

export interface SequenceLevel {
  name: string;
  grade: Grades;
  points: number;
  level: number;
  unlocked: boolean;
}
