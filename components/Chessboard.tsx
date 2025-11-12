import React, { useMemo, useState, useEffect } from 'react';
import { Move } from 'chess.js';
import { Square, Piece, PlayerColor, PieceType } from '../types';
import { PIECE_MAP } from '../constants';

interface ChessboardProps {
  fen: string;
  onSquareClick: (square: Square) => void;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: Move | null;
  inCheck: boolean;
  turn: PlayerColor;
  getPieceAtSquare: (square: Square) => Piece | null;
  disabled?: boolean;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  onSquareClick,
  selectedSquare,
  validMoves,
  lastMove,
  inCheck,
  turn,
  getPieceAtSquare,
  disabled = false,
}) => {
  const [capturedPieceInfo, setCapturedPieceInfo] = useState<{ square: Square; piece: Piece } | null>(null);
  const [captureSquare, setCaptureSquare] = useState<Square | null>(null);

  const board = useMemo(() => {
    const boardLayout: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const [piecePlacement] = fen.split(' ');
    const fenRanks = piecePlacement.split('/');

    fenRanks.forEach((rankStr, rankIndex) => {
      let fileIndex = 0;
      for (const char of rankStr) {
        if (isNaN(parseInt(char))) {
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase() as Piece['type'];
          boardLayout[rankIndex][fileIndex] = { type, color };
          fileIndex++;
        } else {
          fileIndex += parseInt(char);
        }
      }
    });
    return boardLayout;
  }, [fen]);
  
  useEffect(() => {
    if (lastMove?.captured) {
        const capturedPieceType = lastMove.captured as PieceType;
        const capturedPieceColor = lastMove.color === 'w' ? 'b' : 'w';

        setCapturedPieceInfo({
            square: lastMove.to,
            piece: { type: capturedPieceType, color: capturedPieceColor },
        });
        setCaptureSquare(lastMove.to); // Set the square for the background flash
        
        const timer = setTimeout(() => {
            setCapturedPieceInfo(null)
            setCaptureSquare(null);
        }, 400); // Must match animation duration
        return () => clearTimeout(timer);
    }
  }, [lastMove]);

  const kingSquare = useMemo(() => {
    if (!inCheck) return null;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return files[f] + ranks[r];
        }
      }
    }
    return null;
  }, [inCheck, turn, board]);

  return (
    <div className="aspect-square w-full grid grid-cols-8 grid-rows-8 shadow-2xl rounded-md overflow-hidden border-2 border-gray-700">
      {ranks.map((rank, rankIndex) =>
        files.map((file, fileIndex) => {
          const square: Square = file + rank;
          const isLight = (rankIndex + fileIndex) % 2 === 0;
          const piece = board[rankIndex][fileIndex];
          
          const isSelected = square === selectedSquare;
          const isLastMove = square === lastMove?.from || square === lastMove?.to;
          const isCheck = square === kingSquare;
          const isPossibleMove = validMoves.includes(square);
          const isDestinationOfLastMove = square === lastMove?.to;
          const isCaptureSquare = square === captureSquare;

          const squareBg = isLight ? 'bg-board-light' : 'bg-board-dark';

          return (
            <div
              key={square}
              onClick={disabled ? undefined : () => onSquareClick(square)}
              className={`relative flex items-center justify-center ${squareBg} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* --- Background Overlays (under the piece) --- */}
              {isCaptureSquare && (
                  <div 
                      className="absolute inset-0 animate-flash-capture-bg"
                      style={{ pointerEvents: 'none' }}
                  />
              )}
              <div 
                className="absolute inset-0 bg-yellow-400 bg-opacity-40 transition-opacity duration-200"
                style={{ opacity: isLastMove && !isCaptureSquare ? 1 : 0, pointerEvents: 'none' }}
              />
              <div 
                className="absolute inset-0 bg-highlight-check bg-opacity-50 transition-opacity duration-200"
                style={{ opacity: isCheck ? 1 : 0, pointerEvents: 'none' }}
              />
              
              {/* The Piece */}
              {piece && (
                <span 
                  className={`text-5xl md:text-6xl select-none relative z-10 ${isDestinationOfLastMove ? 'animate-pop-in' : ''}`}
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}
                >
                  {PIECE_MAP[piece.type][piece.color]}
                </span>
              )}
              
              {/* Captured Piece Animation */}
              {capturedPieceInfo && capturedPieceInfo.square === square && (
                <span
                  className="text-5xl md:text-6xl select-none absolute z-10 animate-capture-fade-out"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
                >
                  {PIECE_MAP[capturedPieceInfo.piece.type][capturedPieceInfo.piece.color]}
                </span>
              )}

              {/* --- Foreground Overlays (over the piece) --- */}
              {isSelected &&
                <div 
                  className="absolute inset-0 animate-pulse-yellow z-20"
                  style={{ pointerEvents: 'none' }} 
                />
              }
              {isPossibleMove &&
                <div 
                  className="absolute inset-0 flex items-center justify-center z-20"
                  style={{ pointerEvents: 'none' }}
                >
                    <div className={`w-1/3 h-1/3 rounded-full animate-pop-in-dot ${piece ? 'border-4 border-highlight-move border-opacity-75' : 'bg-highlight-move bg-opacity-50'}`}/>
                </div>
              }
            </div>
          );
        })
      )}
    </div>
  );
};

export default Chessboard;