import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";

const SinglePlayer = () => {
  const { playerScore, totalScore } = useContext(GameContext);

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
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/longestWord"
          >
            Longest Word
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.longestWord}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/targetNumber"
          >
            Target Number
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.targetNumber}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/matchingPairs"
          >
            Matching pairs
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.matchingPairs}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/quiz"
          >
            Quiz
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.quiz}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/mastermind"
          >
            Mastermind
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.mastermind}
          </span>
        </div>

        <div className="flex space-x-2">
          <Link
            className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
            to="/associations"
          >
            Associations
          </Link>

          <span className="flex items-center justify-center w-10 text-center bg-blue-600 rounded-full">
            {playerScore.associations}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayer;
