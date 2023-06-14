import React from "react";
import { Link } from "react-router-dom";

const SinglePlayer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="flex flex-col items-center justify-center space-y-4 text-2xl font-bold text-white">
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/longestWord"
        >
          Longest Word
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/targetNumber"
        >
          Target Number
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/matchingPairs"
        >
          Matching pairs
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/quiz"
        >
          Quiz
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/mastermind"
        >
          Mastermind
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-600 rounded-full hover:bg-blue-500"
          to="/associations"
        >
          Associations
        </Link>
      </div>
    </div>
  );
};

export default SinglePlayer;
