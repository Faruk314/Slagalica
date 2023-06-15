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

  console.log(playerScore);

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

  return (
    <GameContext.Provider
      value={{
        playerScore,
        updateScore,
        totalScore,
        updateGameState,
        gameStates,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
