import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { SocketContext } from "../../context/SocketContext";

const GameInvitePending = () => {
  const { socket } = useContext(SocketContext);
  const { setOpenGameInvitePending } = useContext(GameContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative flex flex-col items-center justify-center px-5 py-2 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <p className="text-gray-600">Waiting for player to accept invitation</p>

        <div className="loader"></div>

        <button
          onClick={() => {
            socket?.emit("cancelInvite");
            setOpenGameInvitePending(false);
          }}
          className="px-2 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default GameInvitePending;
