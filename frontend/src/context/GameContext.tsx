import axios from "axios";
import React, { createContext, useState } from "react";

interface PlayerScore {
  associations: number;
  longestWord: number;
  mastermind: number;
  matchingPairs: number;
  quiz: number;
  targetNumber: number;
}

interface GameStates {
  associations: string;
  longestWord: string;
  mastermind: string;
  matchingPairs: string;
  quiz: string;
  targetNumber: string;
}

interface GameContextProps {
  playerScore: PlayerScore;
  updateScore: (name: string, score: number) => void;
  totalScore: number;
  updateGameState: (name: string, state: string) => void;
  gameStates: GameStates;
  updateGame: (updatedGameState: any, gameName: string) => void;
}

export const GameContext = createContext<GameContextProps>({
  playerScore: {
    associations: 0,
    longestWord: 0,
    mastermind: 0,
    matchingPairs: 0,
    quiz: 0,
    targetNumber: 0,
  },
  gameStates: {
    associations: "playing",
    longestWord: "playing",
    mastermind: "playing",
    matchingPairs: "playing",
    quiz: "playing",
    targetNumber: "playing",
  },
  updateScore: () => {},
  totalScore: 0,
  updateGameState: () => {},
  updateGame: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [totalScore, setTotalScore] = useState(0);
  const [gameStates, setGameStates] = useState<GameStates>({
    associations: "playing",
    longestWord: "playing",
    mastermind: "playing",
    matchingPairs: "playing",
    quiz: "playing",
    targetNumber: "playing",
  });
  const [playerScore, setPlayerScore] = useState<PlayerScore>({
    associations: 0,
    longestWord: 0,
    mastermind: 0,
    matchingPairs: 0,
    quiz: 0,
    targetNumber: 0,
  });

  const updateGameState = (name: string, state: string) => {
    setGameStates((prevState) => ({
      ...prevState,
      [name]: state,
    }));
  };

  const updateScore = (name: string, score: number) => {
    setPlayerScore((prevScore) => ({
      ...prevScore,
      [name]: score,
    }));

    setTotalScore((prev) => prev + score);
  };

  const updateGame = async (updatedGameState: any, gameName: string) => {
    try {
      await axios.put("http://localhost:4000/api/game/updateGameState", {
        updatedGameState,
        gameName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        playerScore,
        updateScore,
        totalScore,
        updateGameState,
        gameStates,
        updateGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
