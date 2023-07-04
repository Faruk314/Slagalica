import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";

const MultiplayerGameOver = () => {
  const { winnerId, setMultiplayerGameOver, opponentTotal, totalScore } =
    useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center p-2 mx-2 bg-white rounded-md w-[20rem]">
        <h2 className="font-bold">GAME OVER</h2>

        {winnerId === loggedUserInfo.userId ? (
          <span>YOU WON</span>
        ) : (
          <span>YOU LOST</span>
        )}

        <div className="flex space-x-2">
          <span>Your Score:</span>
          <span className="font-bold">{totalScore}</span>
        </div>

        <div className="flex space-x-2">
          <span>Opponent Score:</span>
          <span className="font-bold">{opponentTotal}</span>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="p-2 mt-5 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MultiplayerGameOver;
