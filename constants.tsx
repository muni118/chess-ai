
import React from 'react';
import { Piece } from './types';

// Using unicode characters for simplicity, but SVGs would be better for styling.
export const PIECE_MAP: { [key in Piece['type']]: { w: string; b: string } } = {
  p: { w: '♙', b: '♟︎' },
  r: { w: '♖', b: '♜' },
  n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' },
  q: { w: '♕', b: '♛' },
  k: { w: '♔', b: '♚' },
};

export const PIECE_NAMES: { [key in Piece['type']]: string } = {
    p: 'Pawn',
    r: 'Rook',
    n: 'Knight',
    b: 'Bishop',
    q: 'Queen',
    k: 'King',
};
