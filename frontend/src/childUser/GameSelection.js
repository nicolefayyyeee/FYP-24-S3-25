import React from "react";
import { Link } from "react-router-dom";
import "./GameSelection.css"; // Make sure this points to the correct CSS

const GameSelection = () => {
  return (
    <div className="game-selection-container">
      <h1 className="game-selection-header">Choose a Game</h1>
      <div className="game-options">
        <div className="game-option pink-purple">
          <Link to="/match-picture">
            <h1>🧩</h1>
            <h2>Match the Picture</h2>
            <p>Test your memory by matching the pictures!</p>
          </Link>
        </div>
        <div className="game-option dark-blue">
          <Link to="/storytelling-game">
            <h1>📖</h1>
            <h2>Storytelling</h2>
            <p>Dive into amazing stories!</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
