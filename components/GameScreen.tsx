
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, Square as ChessJSSquare, Move } from 'chess.js';
import { GameMode, LearningLevel, Piece as PieceType, Square } from '../types';
import Chessboard from './Chessboard';
import TutorPanel from './TutorPanel';

// Control Button Component, styled for the new header
const ControlButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
}> = ({ onClick, children, className = '', title, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full transition-colors duration-200 text-2xl ${
        disabled 
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
        : 'bg-gray-700 hover:bg-gray-600 text-white'
      } ${className}`}
      title={title}
    >
      {children}
    </button>
);

interface GameScreenProps {
  gameMode: GameMode;
  learningLevel: LearningLevel;
  onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameMode, learningLevel, onExit }) => {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  const getPieceAtSquare = useCallback((square: Square): PieceType | null => {
    const piece = game.get(square as ChessJSSquare);
    return piece ? { type: piece.type, color: piece.color } : null;
  }, [game]);

  const handleSquareClick = useCallback((square: Square) => {
    if (gameOverMessage) return;

    if (selectedSquare) {
      const move = validMoves.find(m => m.to === square);
      if (move) {
        game.move(move);
        setFen(game.fen());
        setLastMove(move);
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        const piece = getPieceAtSquare(square);
        if (piece && piece.color === game.turn()) {
           setSelectedSquare(square);
           setValidMoves(game.moves({ square: square as ChessJSSquare, verbose: true }));
        } else {
           setSelectedSquare(null);
           setValidMoves([]);
        }
      }
    } else {
      const piece = getPieceAtSquare(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setValidMoves(game.moves({ square: square as ChessJSSquare, verbose: true }));
      }
    }
  }, [gameOverMessage, selectedSquare, game, validMoves, getPieceAtSquare]);

  const resetGame = useCallback(() => {
    game.reset();
    setFen(game.fen());
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setGameOverMessage(null);
  }, [game]);

  const undoMove = useCallback(() => {
    game.undo();
    if (gameMode === GameMode.HUMAN_VS_AI && game.turn() !== 'w') {
        game.undo();
    }
    setFen(game.fen());
    setLastMove(null);
    setGameOverMessage(null);
  }, [game, gameMode]);
  
  // AI Move Logic
  useEffect(() => {
    const isAITurn = (gameMode === GameMode.HUMAN_VS_AI && game.turn() === 'b') || gameMode === GameMode.AI_VS_AI;
    
    if (isAITurn && !game.isGameOver()) {
        const timeout = setTimeout(() => {
            const moves = game.moves();
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                const moveResult = game.move(randomMove);
                setFen(game.fen());
                setLastMove(moveResult);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }
  }, [fen, game, gameMode]);

  // Check for game over
  useEffect(() => {
    if (game.isCheckmate()) {
        setGameOverMessage(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
    } else if (game.isStalemate()) {
        setGameOverMessage("Stalemate! The game is a draw.");
    } else if (game.isThreefoldRepetition()) {
        setGameOverMessage("Draw by threefold repetition.");
    } else if (game.isDraw()) {
        setGameOverMessage("The game is a draw.");
    } else {
        setGameOverMessage(null);
    }
  }, [fen, game]);


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
        <h2 className="text-xl font-bold text-board-light ml-2">{gameMode}</h2>
        <div className="flex items-center gap-3">
            <ControlButton 
                onClick={resetGame} 
                title="New Game"
            >
                🔄
            </ControlButton>
            <ControlButton 
                onClick={undoMove} 
                title="Undo Last Move" 
                disabled={gameMode === GameMode.AI_VS_AI || !lastMove}
            >
                ↩️
            </ControlButton>
            <ControlButton 
                onClick={onExit} 
                title="Exit to Menu"
                className="hover:bg-red-700"
            >
                🚪
            </ControlButton>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-grow">
          <Chessboard
            fen={fen}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            validMoves={validMoves.map(m => m.to)}
            lastMove={lastMove}
            inCheck={game.inCheck()}
            turn={game.turn()}
            getPieceAtSquare={getPieceAtSquare}
            disabled={gameMode === GameMode.AI_VS_AI}
          />
          {gameOverMessage && (
              <div className="mt-4 p-4 bg-yellow-500 text-gray-900 font-bold rounded-lg text-center animate-pop-in">
                  {gameOverMessage}
              </div>
          )}
        </div>
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <TutorPanel
            learningLevel={learningLevel}
            selectedSquare={selectedSquare}
            getPieceAtSquare={getPieceAtSquare}
            lastMove={lastMove}
            fen={fen}
            isGameOver={!!gameOverMessage}
            gameMode={gameMode}
          />
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
