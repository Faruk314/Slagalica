import React, { createContext, useState } from "react";

interface PlayerScore {
  associations: number;
  longestWord: number;
  mastermind: number;
  matchingPairs: number;
  quiz: number;
  targetNumber: number;
}

interface GameContextProps {
  playerScore: PlayerScore;
  updateScore: (name: string, score: number) => void;
  totalScore: number;
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
  updateScore: () => {},
  totalScore: 0,
});

export const GameContextProvider = ({ children }: any) => {
  const [totalScore, setTotalScore] = useState(0);
  const [playerScore, setPlayerScore] = useState<PlayerScore>({
    associations: 0,
    longestWord: 0,
    mastermind: 0,
    matchingPairs: 0,
    quiz: 0,
    targetNumber: 0,
  });

  console.log(playerScore);

  const updateScore = (name: string, score: number) => {
    setPlayerScore((prevScore) => ({
      ...prevScore,
      [name]: score,
    }));

    setTotalScore((prev) => prev + score);
  };

  return (
    <GameContext.Provider value={{ playerScore, updateScore, totalScore }}>
      {children}
    </GameContext.Provider>
  );
};
