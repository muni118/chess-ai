
import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import BluetoothScreen from './components/BluetoothScreen';
import { GameMode, LearningLevel } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(LearningLevel.BEGINNER);
  const [showBluetoothScreen, setShowBluetoothScreen] = useState(false);

  const handleLogin = useCallback((name: string, level: LearningLevel) => {
    setPlayerName(name);
    setLearningLevel(level);
    setIsLoggedIn(true);
  }, []);

  const handleStartGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setShowBluetoothScreen(false);
  }, []);

  const handleExitGame = useCallback(() => {
    setGameMode(null);
    setShowBluetoothScreen(false);
  }, []);

  const handleSelectBluetooth = useCallback(() => {
    setShowBluetoothScreen(true);
  }, []);
  
  const renderContent = () => {
    if (!isLoggedIn) {
      // Login Screen UI is embedded here
      return (
        <div className="flex flex-col items-center justify-center animate-pop-in">
          <div className="w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-gray-400 mb-8">Let's set you up for a game of chess.</p>
    
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('playerName') as string;
              const level = formData.get('learningLevel') as LearningLevel;
              handleLogin(name, level);
            }} className="space-y-6">
              <div>
                <label htmlFor="player-name" className="block mb-2 text-sm font-medium text-gray-300 text-left">
                  Player Name (Optional)
                </label>
                <input
                  type="text"
                  id="player-name"
                  name="playerName"
                  placeholder="e.g., Alex"
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                />
              </div>
    
              <div>
                <label htmlFor="learning-level" className="block mb-2 text-sm font-medium text-gray-300 text-left">
                  Select Your Skill Level
                </label>
                <select
                  id="learning-level"
                  name="learningLevel"
                  defaultValue={LearningLevel.BEGINNER}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                >
                  {Object.values(LearningLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <p className="mt-2 text-xs text-gray-400 text-left">The AI Tutor will adapt its guidance based on this level.</p>
              </div>
    
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-3 text-center transition-transform transform hover:scale-105"
              >
                Start Playing
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (showBluetoothScreen) {
      return (
        <BluetoothScreen 
          onBack={handleExitGame}
          onStartLocalGame={() => handleStartGame(GameMode.HUMAN_VS_HUMAN_LOCAL)}
        />
      );
    }
    if (gameMode !== null) {
      return (
        <GameScreen
          gameMode={gameMode}
          learningLevel={learningLevel}
          onExit={handleExitGame}
        />
      );
    }
    return <MainMenu onStartGame={handleStartGame} onSelectBluetooth={handleSelectBluetooth} />;
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
            Chess Tutor <span className="text-board-light">AI</span>
          </h1>
          <p className="text-gray-400 mt-2">
            {isLoggedIn ? `Welcome, ${playerName || 'Player'}!` : 'Your personal offline chess coach.'}
          </p>
        </header>
        
        <main className="bg-gray-900 rounded-lg shadow-2xl p-4 md:p-6">
          {renderContent()}
        </main>

        <footer className="text-center mt-6 text-gray-500 text-sm">
          <p>Built for offline learning and practice. No internet required.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
