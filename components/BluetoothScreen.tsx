
import React, { useState, useEffect } from 'react';

interface BluetoothScreenProps {
    onBack: () => void;
    onStartLocalGame: () => void;
}

const BluetoothScreen: React.FC<BluetoothScreenProps> = ({ onBack, onStartLocalGame }) => {
    const [status, setStatus] = useState<'scanning' | 'error'>('scanning');

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('error');
        }, 3000); // Simulate scanning for 3 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="text-center p-4 md:p-8 bg-gray-800 rounded-lg animate-pop-in flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-board-light mb-6">Bluetooth Match</h2>
            
            {status === 'scanning' && (
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-300 text-lg">Scanning for nearby devices...</p>
                    <p className="text-gray-500 text-sm mt-2">Please ensure Bluetooth is enabled on both devices.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="animate-pop-in max-w-lg">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl text-red-400 font-semibold">Feature Not Supported in Browser</h3>
                    <p className="text-gray-400 mt-3">
                        Direct device-to-device connection via Bluetooth is a feature for native mobile apps and is not available in web browsers.
                    </p>
                    <p className="text-gray-400 mt-3">
                        For a great offline experience with a friend, try playing on a single device.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full">
                        <button 
                            onClick={onStartLocalGame}
                            className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex-grow bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            Start 2 Player Local Game
                        </button>
                        <button 
                            onClick={onBack}
                            className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex-grow bg-gray-600 hover:bg-gray-500 text-white"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BluetoothScreen;
