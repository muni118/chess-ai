
import { GoogleGenAI } from "@google/genai";
import { Piece, Square } from '../types';
import { PIECE_NAMES } from '../constants';

// --- IMPORTANT ---
// This is a SIMULATION of the Gemini API for this offline-first application.
// In a real online app, you would uncomment the API call logic.
// Here, we return mock data to demonstrate the "AI Tutor" feature without internet.

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_ANALYSIS = [
    "Great move! Developing your pieces early is a solid strategy.",
    "A good choice. You've increased your control of the center of the board.",
    "Interesting move. This prepares you for a future attack.",
    "Well played! You've put one of your pieces on a more active square.",
    "Careful! That piece is now vulnerable. Make sure it's defended.",
    "This move opens up your king's position. Be mindful of potential threats.",
    "Nice! You've created a threat to one of your opponent's pieces.",
];

const getMockResponse = <T,>(data: T[]): T => {
    return data[Math.floor(Math.random() * data.length)];
}

export const getMoveAnalysis = async (fenBefore: string, fenAfter: string, move: string): Promise<string> => {
    console.log("Simulating Gemini API call for move analysis:", { fenBefore, fenAfter, move });

    // In a real application, you would make an API call here.
    /*
    const prompt = `You are a friendly chess coach for absolute beginners. Analyze this chess move and provide a single, encouraging, and simple sentence of feedback. The board state before the move was FEN: "${fenBefore}". The move made was "${move}". The new board state is FEN: "${fenAfter}".`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Couldn't analyze the move, but keep playing!";
    }
    */

    // Returning mock data for offline functionality.
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    return getMockResponse(MOCK_ANALYSIS);
};


export const getPieceExplanation = (piece: Piece): string => {
    const pieceName = PIECE_NAMES[piece.type];
    switch(piece.type) {
        case 'p': return "The Pawn moves forward one square, but captures diagonally. On its first move, it can move two squares.";
        case 'n': return "The Knight moves in an 'L' shape: two squares in one direction (horizontal or vertical) and then one square to the side.";
        case 'b': return "The Bishop moves diagonally any number of squares, but must stay on squares of the same color.";
        case 'r': return "The Rook moves horizontally or vertically any number of squares.";
        case 'q': return "The Queen is the most powerful piece! It can move any number of squares horizontally, vertically, or diagonally.";
        case 'k': return "The King moves one square in any direction. Keep it safe, as losing the King means losing the game!";
        default: return "Select a piece to learn about it.";
    }
};

export const getGeneralHint = async (fen: string): Promise<string> => {
     // In a real application, you would make an API call here.
    /*
    const prompt = `You are a chess coach. Look at this FEN string: "${fen}". What is a single, simple sentence of general advice for the current player? For example: "Try to control the center" or "Develop your knights and bishops".`;
     const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
     return response.text;
    */
    const hints = [
        "Try to control the center of the board with your pawns.",
        "Develop your knights and bishops before moving your queen or rooks.",
        "Don't move the same piece multiple times in the opening.",
        "Make sure your king is safe by castling early.",
    ];
    await new Promise(resolve => setTimeout(resolve, 300));
    return getMockResponse(hints);
}
