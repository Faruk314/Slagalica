import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

interface Props {
  setOpenLeaveGame: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmLeave = ({ setOpenLeaveGame }: Props) => {
  const { deleteGameSession } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-5 py-5 mx-2 space-y-2 bg-white rounded-md shadow-xl">
        <p className="text-gray-600">
          Are you sure you want to leave the game?
        </p>

        <div className="flex space-x-2">
          <button
            onClick={async () => {
              setOpenLeaveGame(false);
              try {
                await deleteGameSession();
                navigate("/menu");
              } catch (error) {
                console.log(error);
              }
            }}
            className="px-4 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            YES
          </button>
          <button
            onClick={() => {
              setOpenLeaveGame(false);
            }}
            className="px-4 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeave;
