import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";

const GameFinished = () => {
  const { setGameFinished } = useContext(GameContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center justify-center p-4 mx-2 space-y-2 text-black bg-white rounded-md">
        <div className="text-center">
          <h2 className="">Congratulations!</h2>
          <p>You have successfully finished all the games.</p>
          <p>Thank you for playing!</p>
        </div>

        <button
          onClick={() => {
            setGameFinished(false);
          }}
          className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Continiue
        </button>
      </div>
    </div>
  );
};

export default GameFinished;
