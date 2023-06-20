import React from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center h-[100vh] font-bold text-white">
      <div className="flex flex-col space-y-4">
        <button
          className="w-[15rem] text-2xl flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
          onClick={() => navigate("/singlePlayer")}
        >
          Singleplayer
        </button>

        <button
          className="w-[15rem] text-2xl flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
          onClick={() => navigate("/multiplayer")}
        >
          Multiplayer
        </button>

        <button
          className="w-[15rem] text-2xl flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </button>

        <button className="w-[15rem] text-2xl flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none">
          Logout
        </button>
      </div>
    </section>
  );
};

export default MainMenu;
