import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { SocketContext } from "../../context/SocketContext";

const GameInvite = () => {
  const { senderUsername, setOpenGameInvite } = useContext(GameContext);
  const { socket } = useContext(SocketContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-10 py-10 space-y-2 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center space-y-2">
          <img
            className="w-[5rem] h-[5rem] border-4 border-blue-600 rounded-full"
            alt=""
            src="/images/skocko.png"
          />

          <div className="px-5 font-bold text-center text-white bg-blue-600 rounded-lg">
            <p>{senderUsername}</p>
          </div>

          <p className="text-gray-600">wants to play against you!</p>
        </div>

        <div
          onClick={() => {
            socket?.emit("cancelInvite");
            setOpenGameInvite(false);
          }}
          className="flex space-x-2"
        >
          <button className="px-2 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500">
            CANCEL
          </button>
          <button
            onClick={() => {
              socket?.emit("acceptInvite");
            }}
            className="px-2 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInvite;
