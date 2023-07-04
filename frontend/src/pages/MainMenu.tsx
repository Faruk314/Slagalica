import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import LeaderBoard from "../modals/LeaderBoard";
import FindMatch from "../modals/multiplayer/FindMatch";
import Search from "../modals/Search";

const MainMenu = () => {
  const navigate = useNavigate();
  const [openFindMatch, setOpenFindMatch] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const { socket } = useContext(SocketContext);
  const { setOpenGameInvite, setOpenGameInvitePending } =
    useContext(GameContext);

  const logoutHandler = async () => {
    try {
      await axios.get("http://localhost:4000/api/auth/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.on("gameStart", () => {
      navigate("/multiplayer");
      setOpenGameInvite(false);
      setOpenGameInvitePending(false);
      setOpenFindMatch(false);
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  return (
    <section className="flex flex-col space-y-10 items-center justify-center h-[100vh] font-bold text-white">
      <div className="flex items-center space-x-1 text-4xl">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>

      <div className="flex flex-col space-y-4 text-2xl">
        <button
          className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
          onClick={() => navigate("/singlePlayer")}
        >
          Singleplayer
        </button>

        <button
          onClick={() => setOpenFindMatch(true)}
          className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600"
        >
          Find Match
        </button>

        <button
          onClick={() => setOpenSearch(true)}
          className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600"
        >
          Invite
        </button>

        <button
          className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600"
          onClick={() => setOpenLeaderboard(true)}
        >
          Leaderboard
        </button>

        <button
          onClick={logoutHandler}
          className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600"
        >
          Logout
        </button>
      </div>

      {openSearch && <Search setOpenSearch={setOpenSearch} />}
      {openLeaderboard && <LeaderBoard />}
      {openFindMatch && <FindMatch setOpenFindMatch={setOpenFindMatch} />}
    </section>
  );
};

export default MainMenu;
