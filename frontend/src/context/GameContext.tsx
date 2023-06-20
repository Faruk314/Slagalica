import axios from "axios";
import React, { createContext, useEffect, useState, useRef } from "react";

interface PlayerScore {
  associations: number;
  longestWord: number;
  mastermind: number;
  matchingPairs: number;
  quiz: number;
  targetNumber: number;
}

interface GameStats {
  gameName: string;
  score: number;
  gameState: string;
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
  statsFetched: boolean;
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
  statsFetched: false,
});

export const GameContextProvider = ({ children }: any) => {
  const isEffectExecutedRef = useRef(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStates, setGameStates] = useState<GameStates>({
    associations: "",
    longestWord: "",
    mastermind: "",
    matchingPairs: "",
    quiz: "",
    targetNumber: "",
  });
  const [playerScore, setPlayerScore] = useState<PlayerScore>({
    associations: 0,
    longestWord: 0,
    mastermind: 0,
    matchingPairs: 0,
    quiz: 0,
    targetNumber: 0,
  });
  const [statsFetched, setStatsFetched] = useState(false);

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
  };

  useEffect(() => {
    const calcTotal = () => {
      const totalScore = Object.values(playerScore).reduce(
        (acc, score) => acc + score,
        0
      );

      setTotalScore(totalScore);
    };

    if (playerScore) {
      calcTotal();
    }
  }, [playerScore]);

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

  useEffect(() => {
    const retrieveGameStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameStats"
        );

        let playerScoreCopy: any = { ...playerScore };
        let gameStatesCopy: any = { ...gameStates };

        response.data.forEach((game: GameStats, index: number) => {
          let playerScoreKey = Object.keys(playerScoreCopy).find(
            (key) => key === game.gameName
          );
          let gameStatesKey = Object.keys(gameStatesCopy).find(
            (key) => key === game.gameName
          );

          if (playerScoreKey) {
            playerScoreCopy[playerScoreKey] = game.score;
          }

          if (gameStatesKey) {
            gameStatesCopy[gameStatesKey] = game.gameState;
          }
        });

        setStatsFetched(true);
        setGameStates(gameStatesCopy);
        setPlayerScore(playerScoreCopy);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      retrieveGameStats();
      isEffectExecutedRef.current = true;
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        statsFetched,
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
