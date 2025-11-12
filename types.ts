export enum GameMode {
  HUMAN_VS_AI = 'Human vs AI',
  HUMAN_VS_HUMAN_LOCAL = '2 Player (Local)',
  AI_VS_AI = 'AI vs AI',
  PRACTICE = 'Practice Challenges',
}

export enum LearningLevel {
  BEGINNER = 'Beginner',
  GUIDED = 'Guided',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export type PlayerColor = 'w' | 'b';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export type Square = string; // e.g., 'e4'