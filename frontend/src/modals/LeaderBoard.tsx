import React from "react";

const LeaderBoard = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="relative flex flex-col items-center space-y-2 p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md bg-white">
        <button className="absolute top-[-0.5rem] text-white bg-blue-600 rounded-full right-[-0.5rem] text-xl py-1 px-3 hover:bg-blue-500">
          X
        </button>
      </div>
    </div>
  );
};

export default LeaderBoard;
