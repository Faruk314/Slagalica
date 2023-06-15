import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

const QuizModal = () => {
  const navigate = useNavigate();
  const { playerScore } = useContext(GameContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)] font-normal">
      <div className="flex flex-col items-center px-3 py-2 mx-2 space-y-2 text-black bg-white rounded-md">
        <h2 className="font-bold">Game Over</h2>
        <div className="text-center">
          <span>Number of points: </span>
          <span className="font-bold">{playerScore.quiz}</span>
        </div>

        <button
          onClick={() => navigate("/singlePlayer")}
          className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Continiue
        </button>
      </div>
    </div>
  );
};

export default QuizModal;
