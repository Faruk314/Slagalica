import axios from "axios";
import React, { createContext, useEffect, useState, useRef } from "react";

interface PlayerScore {
  associations: number;
  longestWord: number;
  mastermind: number;
  matchingPairs: number;
  quiz: number;
  targetNumber: number;
  userId?: number;
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
  opponentScore: PlayerScore;
  updateScore: (name: string, score: number) => void;
  totalScore: number;
  updateGameState: (name: string, state: string) => void;
  gameStates: GameStates;
  updateGame: (updatedGameState: any, gameName: string) => void;
  statsFetched: boolean;
  senderUsername: string;
  setSenderUsername: React.Dispatch<React.SetStateAction<string>>;
  openGameInvite: boolean;
  setOpenGameInvite: React.Dispatch<React.SetStateAction<boolean>>;
  gameInvitePendingOpen: boolean;
  setOpenGameInvitePending: React.Dispatch<React.SetStateAction<boolean>>;
  gameId: string;
  setGameId: React.Dispatch<React.SetStateAction<string>>;
  setOpponentScore: React.Dispatch<React.SetStateAction<PlayerScore>>;
  setOpponentTotal: React.Dispatch<React.SetStateAction<number>>;
  opponentTotal: number;
  setTotalScore: React.Dispatch<React.SetStateAction<number>>;
  setPlayerScore: React.Dispatch<React.SetStateAction<PlayerScore>>;
  setGameStates: React.Dispatch<React.SetStateAction<GameStates>>;
  gameFinished: boolean;
  setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
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
  opponentScore: {
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
  setOpponentScore: () => {},
  totalScore: 0,
  updateGameState: () => {},
  updateGame: () => {},
  statsFetched: false,
  senderUsername: "",
  setSenderUsername: () => {},
  openGameInvite: false,
  setOpenGameInvite: () => {},
  gameInvitePendingOpen: false,
  setOpenGameInvitePending: () => {},
  gameId: "",
  setGameId: () => {},
  setOpponentTotal: () => {},
  opponentTotal: 0,
  setTotalScore: () => {},
  setPlayerScore: () => {},
  setGameStates: () => {},
  gameFinished: false,
  setGameFinished: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [opponentTotal, setOpponentTotal] = useState(0);
  const [gameId, setGameId] = useState("");
  const [gameInvitePendingOpen, setOpenGameInvitePending] = useState(false);
  const [openGameInvite, setOpenGameInvite] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
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
  const [opponentScore, setOpponentScore] = useState<PlayerScore>({
    associations: 0,
    longestWord: 0,
    matchingPairs: 0,
    mastermind: 0,
    targetNumber: 0,
    quiz: 0,
  });
  const [statsFetched, setStatsFetched] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

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

      console.log(opponentScore);

      const { userId, ...scores } = opponentScore;

      const opponentTotal = Object.values(scores).reduce(
        (sum, score) => sum + score,
        0
      );

      setOpponentTotal(opponentTotal);
      setTotalScore(totalScore);
    };

    if (playerScore) {
      calcTotal();
    }
  }, [playerScore, opponentScore]);

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
        opponentTotal,
        setOpponentTotal,
        opponentScore,
        setOpponentScore,
        gameId,
        setGameId,
        gameInvitePendingOpen,
        setOpenGameInvitePending,
        openGameInvite,
        setOpenGameInvite,
        setSenderUsername,
        senderUsername,
        statsFetched,
        playerScore,
        updateScore,
        totalScore,
        updateGameState,
        gameStates,
        updateGame,
        setTotalScore,
        setPlayerScore,
        setGameStates,
        gameFinished,
        setGameFinished,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
