import axios from "axios";
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AuthContext, UserInfo } from "../context/AuthContext";

interface GameInfo extends UserInfo {
  gameId?: string;
}

interface PlayerScore {
  associations: number;
  longestWord: number;
  mastermind: number;
  matchingPairs: number;
  quiz: number;
  targetNumber: number;
  userId?: number;
  gamesPlayed?: number;
  [key: string]: string | number | undefined;
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
  [key: string]: string; // Index signature
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
  setGameInfo: React.Dispatch<React.SetStateAction<GameInfo>>;
  setWaitMessage: React.Dispatch<React.SetStateAction<string>>;
  waitMessage: string;
  gameInfo: GameInfo;
  getGameInfo: (loggedUserInfo: UserInfo) => Promise<void>;
  createGameSession: () => void;
  setMultiplayerGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  multiplayerGameOver: boolean;
  setWinnerId: React.Dispatch<React.SetStateAction<number | null>>;
  winnerId: number | null;
  deleteGameSession: () => Promise<void>;
  retrieveGameStats: () => Promise<void>;
  setOpenLeaveGame: React.Dispatch<React.SetStateAction<boolean>>;
  openLeaveGame: boolean;
  openPlayerLeftModal: boolean;
  setOpenPlayerLeftModal: React.Dispatch<React.SetStateAction<boolean>>;
  loadingGameInfo: boolean;
  setLoadingGameInfo: React.Dispatch<React.SetStateAction<boolean>>;
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
  setGameInfo: () => {},
  setWaitMessage: () => {},
  waitMessage: "",
  gameInfo: {
    userId: 0,
    gameId: "",
    userName: "",
    image: "",
  },
  getGameInfo: async (loggedUserInfo: UserInfo) => {},
  createGameSession: () => {},
  setMultiplayerGameOver: () => {},
  multiplayerGameOver: false,
  setWinnerId: () => {},
  winnerId: null,
  deleteGameSession: async () => {},
  retrieveGameStats: async () => {},
  setOpenLeaveGame: () => {},
  openLeaveGame: false,
  openPlayerLeftModal: false,
  setOpenPlayerLeftModal: () => {},
  loadingGameInfo: true,
  setLoadingGameInfo: () => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [loadingGameInfo, setLoadingGameInfo] = useState(true);
  const [openPlayerLeftModal, setOpenPlayerLeftModal] = useState(false);
  const [openLeaveGame, setOpenLeaveGame] = useState(false);
  const [winnerId, setWinnerId] = useState<null | number>(null);
  const [multiplayerGameOver, setMultiplayerGameOver] = useState(false);
  const [waitMessage, setWaitMessage] = useState("");
  const [opponentTotal, setOpponentTotal] = useState(0);
  const [gameId, setGameId] = useState("");
  const [gameInvitePendingOpen, setOpenGameInvitePending] = useState(false);
  const [openGameInvite, setOpenGameInvite] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
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
    gamesPlayed: 0,
    userId: 0,
  });
  const [opponentScore, setOpponentScore] = useState<PlayerScore>({
    associations: 0,
    longestWord: 0,
    matchingPairs: 0,
    mastermind: 0,
    targetNumber: 0,
    quiz: 0,
    gamesPlayed: 0,
    userId: 0,
  });
  const [statsFetched, setStatsFetched] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    userId: 0,
    gameId: "",
    userName: "",
    image: "",
  });

  const updateGameState = useCallback(
    (name: string, state: string) => {
      setGameStates((prevState) => ({
        ...prevState,
        [name]: state,
      }));
    },
    [setGameStates]
  );

  const updateScore = useCallback(
    (name: string, score: number) => {
      setPlayerScore((prevScore) => ({
        ...prevScore,
        [name]: score,
      }));
    },
    [setPlayerScore]
  );

  const createGameSession = async () => {
    try {
      await axios.post("http://localhost:4000/api/game/createGameSession");
    } catch (error) {
      console.log(error);
    }
  };

  const getGameInfo = useCallback(async (loggedUserInfo: UserInfo) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/game/getGameInfo"
      );

      setGameId(response.data.gameData.gameId);
      setGameInfo(response.data.gameData);

      const scores = response.data.scores;

      if (scores.playerOne.userId === loggedUserInfo.userId) {
        setOpponentScore(scores.playerTwo);
        setPlayerScore(scores.playerOne);

        if (scores.playerOne.gamesPlayed === 6) {
          setWaitMessage("Waiting for opponent to finish all the games");
        }
      }

      if (scores.playerTwo.userId === loggedUserInfo.userId) {
        console.log(scores.playerOne, "palyerOneScore");
        setOpponentScore(scores.playerOne);
        setPlayerScore(scores.playerTwo);

        if (scores.playerTwo.gamesPlayed === 6) {
          setWaitMessage("Waiting for opponent to finish all the games");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const calcTotal = () => {
      const {
        userId: playerId,
        gamesPlayed: playerGamesPlayed,
        ...playerScores
      } = playerScore;

      const totalScore = Object.values(playerScores).reduce(
        (acc: number, score) => acc + (score as number),
        0
      );

      const {
        userId: opponentId,
        gamesPlayed: opponentGamesPlayed,
        ...opponentScores
      } = opponentScore;

      const opponentTotal = Object.values(opponentScores).reduce(
        (acc: number, score) => acc + (score as number),
        0
      );

      setOpponentTotal(opponentTotal);
      setTotalScore(totalScore);
    };

    if (playerScore) {
      calcTotal();
    }
  }, [playerScore, opponentScore]);

  const updateGame = useCallback(
    async (updatedGameState: any, gameName: string) => {
      try {
        await axios.put("http://localhost:4000/api/game/updateGameState", {
          updatedGameState,
          gameName,
        });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const retrieveGameStats = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/game/getGameStats"
      );

      let playerScoreCopy: PlayerScore = { ...playerScore };
      let gameStatesCopy: GameStates = { ...gameStates };

      console.log(response.data);

      response.data.forEach((game: any, index: number) => {
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
  }, [gameStates, playerScore]);

  const deleteGameSession = useCallback(async () => {
    try {
      await axios.delete("http://localhost:4000/api/game/deleteGameSession");

      setTotalScore(0);
      setGameStates({
        associations: "",
        longestWord: "",
        mastermind: "",
        matchingPairs: "",
        quiz: "",
        targetNumber: "",
      });
      setPlayerScore({
        associations: 0,
        longestWord: 0,
        mastermind: 0,
        matchingPairs: 0,
        quiz: 0,
        targetNumber: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }, [setTotalScore, setGameStates, setPlayerScore]);

  return (
    <GameContext.Provider
      value={{
        loadingGameInfo,
        setLoadingGameInfo,
        setOpenPlayerLeftModal,
        openPlayerLeftModal,
        openLeaveGame,
        setOpenLeaveGame,
        retrieveGameStats,
        deleteGameSession,
        setWinnerId,
        winnerId,
        setMultiplayerGameOver,
        multiplayerGameOver,
        getGameInfo,
        createGameSession,
        waitMessage,
        setWaitMessage,
        setGameInfo,
        gameInfo,
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
