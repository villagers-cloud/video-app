import React, { useState } from 'react';
import Game from './components/Game';
import { levels } from './levels';
import './App.css';

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const handleWin = () => {
    if (levelIndex + 1 >= levels.length) {
      setGameComplete(true);
    } else {
      setShowWinMessage(true);
    }
  };

  const handleNextLevel = () => {
    setShowWinMessage(false);
    setLevelIndex(prev => prev + 1);
  };

  return (
    <>
      <div className="ui-container">
        <h1>Arrow Puzzle 3D</h1>
        <h2>Level {levelIndex + 1}</h2>

        {/* Instruction note for users */}
        <p style={{color: '#ffffff80', marginTop: '10px', fontSize: '0.9rem'}}>
          Click & Drag to rotate • Tap blocks to remove them
        </p>
      </div>

      <Game levelIndex={levelIndex} onWin={handleWin} />

      {showWinMessage && !gameComplete && (
        <div className="win-message">
          <h2>Level Cleared!</h2>
          <button onClick={handleNextLevel}>Next Level</button>
        </div>
      )}

      {gameComplete && (
        <div className="win-message">
          <h2>All Levels Complete!</h2>
          <p>You have mastered the 3D puzzle!</p>
          <button onClick={() => {
            setLevelIndex(0);
            setGameComplete(false);
          }}>Play Again</button>
        </div>
      )}
    </>
  );
}
