
import React from 'react';
import { GameMode } from '../types';

interface MainMenuProps {
  onStartGame: (mode: GameMode) => void;
  onSelectBluetooth: () => void;
}

const MenuButton: React.FC<{
    onClick: () => void;
    title: string;
    description: string;
    icon: string;
    disabled?: boolean;
}> = ({ onClick, title, description, icon, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center space-x-4 ${
      disabled 
        ? 'bg-gray-700 cursor-not-allowed opacity-50' 
        : 'bg-gray-700 hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-1'
    }`}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </button>
);


const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onSelectBluetooth }) => {
    return (
        <div className="flex flex-col space-y-4 animate-pop-in">
            <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p className="font-medium text-gray-300">Choose a Game Mode</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <MenuButton 
                    onClick={() => onStartGame(GameMode.HUMAN_VS_AI)}
                    title="Play vs AI"
                    description="Challenge the offline AI opponent."
                    icon="🤖"
                 />
                 <MenuButton 
                    onClick={() => onStartGame(GameMode.HUMAN_VS_HUMAN_LOCAL)}
                    title="2 Player (Local)"
                    description="Play with a friend on this device."
                    icon="🧑‍🤝‍🧑"
                 />
                 <MenuButton 
                    onClick={onSelectBluetooth}
                    title="Bluetooth Match"
                    description="Connect to a friend's device."
                    icon="📶"
                 />
                 <MenuButton 
                    onClick={() => onStartGame(GameMode.AI_VS_AI)}
                    title="AI vs AI"
                    description="Watch two AIs battle it out."
                    icon="🧠"
                 />
                 <MenuButton 
                    onClick={() => onStartGame(GameMode.PRACTICE)}
                    title="Learning Mode"
                    description="Learn moves and tactics with guidance."
                    icon="🧩"
                 />
            </div>
        </div>
    );
};

export default MainMenu;
