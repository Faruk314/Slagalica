import React, { useContext, useEffect } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
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

axios.defaults.withCredentials = true;

function App() {
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
    getGameInfo,
    multiplayerGameOver,
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
      }
    };

    getLoginStatus();
  }, [setIsLoggedIn, setLoggedUserInfo]);

  useEffect(() => {
    getGameInfo();
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/singlePlayer" element={<SinglePlayer />} />
        <Route path="/longestWord" element={<LongestWord />} />
        <Route path="/targetNumber" element={<TargetNumber />} />
        <Route path="/matchingPairs" element={<MatchingPairs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/mastermind" element={<Mastermind />} />
        <Route path="/associations" element={<Associations />} />
      </Routes>
      {openGameInvite && <GameInvite />}
      {gameInvitePendingOpen && <GameInvitePending />}
      {gameFinished && <GameFinished />}
      {multiplayerGameOver && <MultiplayerGameOver />}
    </BrowserRouter>
  );
}

export default App;
