import React from "react";
import { Link } from "react-router-dom";

const SinglePlayer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="flex flex-col items-center justify-center space-y-4 text-2xl font-bold text-white">
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/slagalica"
        >
          Slagalica
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/mojbroj"
        >
          MojBroj
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/spojnice"
        >
          Spojnice
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/quiz"
        >
          Tko Zna Zna
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/skocko"
        >
          Skocko
        </Link>
        <Link
          className="w-[15rem] flex justify-center items-center py-1 bg-blue-500 rounded-full hover:bg-blue-400"
          to="/asocijacije"
        >
          Asocijacije
        </Link>
      </div>
    </div>
  );
};

export default SinglePlayer;
