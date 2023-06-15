import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

const SinglePlayer = () => {
  const { playerScore, totalScore, gameStates } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] text-white font-bold  ">
      <div className="absolute top-2">
        <div className="p-1 px-2 text-xl bg-blue-600 rounded-full">
          <span>Total: </span>
          <span>{totalScore}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-2xl">
        <div className="flex space-x-2">
          <button
            disabled={gameStates.longestWord !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/longestWord")}
          >
            Longest Word
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.longestWord}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={gameStates.targetNumber !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/targetNumber")}
          >
            Target Number
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.targetNumber}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={gameStates.matchingPairs !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/matchingPairs")}
          >
            Matching Pairs
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.matchingPairs}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={gameStates.quiz !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/quiz")}
          >
            Quiz
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.quiz}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={gameStates.mastermind !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/mastermind")}
          >
            Mastermind
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.mastermind}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            disabled={gameStates.associations !== "playing" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/associations")}
          >
            Associations
          </button>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.associations}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayer;
