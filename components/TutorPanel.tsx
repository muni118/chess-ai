import React, { useState, useEffect } from 'react';
import { GameMode, LearningLevel, Piece, Square } from '../types';
import { getMoveAnalysis, getPieceExplanation, getGeneralHint } from '../services/geminiService';
import { Move } from 'chess.js';

interface TutorPanelProps {
  learningLevel: LearningLevel;
  selectedSquare: Square | null;
  getPieceAtSquare: (square: Square) => Piece | null;
  lastMove: Move | null;
  fen: string;
  isGameOver: boolean;
  gameMode: GameMode;
}

const TutorPanel: React.FC<TutorPanelProps> = ({
  learningLevel,
  selectedSquare,
  getPieceAtSquare,
  lastMove,
  fen,
  isGameOver,
  gameMode
}) => {
  const [hint, setHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isGameOver) {
        setHint("Game over! Review the board or start a new game.");
        return;
    }

    setIsLoading(true);
    let message = '';
    
    // Level-based hints
    if (learningLevel === LearningLevel.BEGINNER || learningLevel === LearningLevel.GUIDED) {
      if (selectedSquare) {
        const piece = getPieceAtSquare(selectedSquare);
        if (piece) {
          message = getPieceExplanation(piece);
        }
      }
    }
    
    if (!message && lastMove) {
        // In Human vs AI mode, only analyze the human player's (white's) moves.
        // In other modes like 2 Player, analyze every move.
        const shouldAnalyze = gameMode !== GameMode.HUMAN_VS_AI || lastMove.color === 'w';

        if(shouldAnalyze) {
            const fenParts = fen.split(" ");
            const fenWithoutMoveCount = `${fenParts[0]} ${fenParts[1]} ${fenParts[2]} ${fenParts[3]} 0 1`;
            
            getMoveAnalysis(fen, fenWithoutMoveCount, lastMove.san).then(analysis => {
                setHint(analysis);
                setIsLoading(false);
            });
            return; // async operation, exit early
        }
    }

    if (!message) {
        getGeneralHint(fen).then(generalHint => {
            setHint(generalHint);
            setIsLoading(false);
        });
        return; // async operation, exit early
    }

    setHint(message);
    setIsLoading(false);

  }, [selectedSquare, getPieceAtSquare, lastMove, learningLevel, fen, isGameOver, gameMode]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-48 flex flex-col justify-between">
        <div>
            <h3 className="font-bold text-lg text-board-light mb-2 flex items-center">
                <span className="mr-2">💡</span> AI Tutor ({learningLevel})
            </h3>
            <div className="text-gray-300 text-sm overflow-y-auto h-24 pr-2">
                {isLoading ? (
                    <div className="animate-pulse">Thinking...</div>
                ) : (
                    <p>{hint}</p>
                )}
            </div>
        </div>
        <div className="text-xs text-gray-500 text-right mt-2">
            Guidance adapts to your skill level.
        </div>
    </div>
  );
};

export default TutorPanel;