import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Associations from "./pages/Associations";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LongestWord from "./pages/LongestWord";
import MainMenu from "./pages/MainMenu";
import Mastermind from "./pages/Mastermind";
import MatchingPairs from "./pages/MatchingPairs";
import Quiz from "./pages/Quiz";
import SinglePlayer from "./pages/SinglePlayer";
import TargetNumber from "./pages/TargetNumber";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./context/SocketContext";
import { GameContext } from "./context/GameContext";
import GameInvite from "./modals/multiplayer/GameInvite";
import GameInvitePending from "./modals/multiplayer/GameInvitePending";
import Multiplayer from "./pages/Multiplayer";
import GameFinished from "./modals/GameFinished";
import MultiplayerGameOver from "./modals/multiplayer/MultiplayerGameOver";
import PlayerLeft from "./modals/multiplayer/PlayerLeft";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProtection from "./components/AuthProtection";

axios.defaults.withCredentials = true;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn, setLoggedUserInfo, loggedUserInfo } =
    useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const {
    setOpenGameInvite,
    openGameInvite,
    setSenderUsername,
    setOpenGameInvitePending,
    gameInvitePendingOpen,
    gameId,
    setOpponentScore,
    gameFinished,
    multiplayerGameOver,
    openPlayerLeftModal,
    setOpenPlayerLeftModal,
    getGameInfo,
    retrieveGameStats,
    setLoadingGameInfo,
  } = useContext(GameContext);

  useEffect(() => {
    socket?.on("connect", () => {
      if (gameId) {
        socket?.emit("reconnectToRoom", gameId);
      }
    });
  }, [socket, gameId, isLoggedIn]);

  useEffect(() => {
    socket?.emit("cancelInvite");
  }, [socket]);

  useEffect(() => {
    socket?.on("gameInvite", (senderUsername) => {
      setSenderUsername(senderUsername);
      setOpenGameInvite(true);
    });

    return () => {
      socket?.off("gameInvite");
    };
  }, [socket, setSenderUsername, setOpenGameInvite]);

  useEffect(() => {
    socket?.on("gameInvitePending", () => {
      setOpenGameInvitePending(true);
    });

    return () => {
      socket?.off("gameInvitePending");
    };
  }, [socket, setOpenGameInvitePending]);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auth/getLoginStatus"
        );
        console.log(response.data);

        setIsLoggedIn(response.data.status);
        setLoggedUserInfo(response.data.userInfo);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getLoginStatus();
  }, []);

  useEffect(() => {
    socket?.on("gameUpdate", (data) => {
      if (data.playerOne.userId === loggedUserInfo.userId) {
        setOpponentScore(data.playerTwo);
      }

      if (data.playerTwo.userId === loggedUserInfo.userId) {
        setOpponentScore(data.playerOne);
      }
    });

    return () => {
      socket?.off("gameUpdate");
    };
  }, [socket, loggedUserInfo?.userId, setOpponentScore]);

  useEffect(() => {
    socket?.on("opponentLeft", () => {
      setOpenPlayerLeftModal(true);
      navigate("/menu");
    });

    return () => {
      socket?.off("opponentLeft");
    };
  }, [socket, navigate]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        await getGameInfo(loggedUserInfo);
        await retrieveGameStats();
        setLoadingGameInfo(false);
      } catch (error) {
        console.log(error);
        setLoadingGameInfo(false); // Set loading to false even if there's an error
      }
    };

    fetchGameData();
  }, [loggedUserInfo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProtection>
              <Login />
            </AuthProtection>
          }
        />
        <Route
          path="/register"
          element={
            <AuthProtection>
              <Register />
            </AuthProtection>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/multiplayer"
          element={
            <ProtectedRoute>
              <Multiplayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/singlePlayer"
          element={
            <ProtectedRoute>
              <SinglePlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/longestWord"
          element={
            <ProtectedRoute>
              <LongestWord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/targetNumber"
          element={
            <ProtectedRoute>
              <TargetNumber />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matchingPairs"
          element={
            <ProtectedRoute>
              <MatchingPairs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mastermind"
          element={
            <ProtectedRoute>
              <Mastermind />
            </ProtectedRoute>
          }
        />
        <Route
          path="/associations"
          element={
            <ProtectedRoute>
              <Associations />
            </ProtectedRoute>
          }
        />
      </Routes>
      {openGameInvite && isLoggedIn && <GameInvite />}
      {gameInvitePendingOpen && isLoggedIn && <GameInvitePending />}
      {gameFinished && isLoggedIn && <GameFinished />}
      {multiplayerGameOver && isLoggedIn && <MultiplayerGameOver />}
      {openPlayerLeftModal && isLoggedIn && (
        <PlayerLeft setOpenPlayerLeftModal={setOpenPlayerLeftModal} />
      )}
    </>
  );
}

export default App;
