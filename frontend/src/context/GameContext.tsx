import React, { createContext, useState } from "react";

interface GameContextProps {
  score: number;
  updateScore: (newScore: number) => void;
}

export const GameContext = createContext<GameContextProps>({
  score: 0,
  updateScore: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [score, setScore] = useState(0);

  const updateScore = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <GameContext.Provider value={{ score, updateScore }}>
      {children}
    </GameContext.Provider>
  );
};
