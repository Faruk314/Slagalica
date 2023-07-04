import React, { useEffect, useState } from "react";
import axios from "axios";

interface Leaderboard {
  userId: number;
  userName: string;
  score: number;
}

interface Props {
  setOpenLeaderboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeaderBoard = ({ setOpenLeaderboard }: Props) => {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

  useEffect(() => {
    const getleaderBoard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getLeaderboard"
        );

        setLeaderboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getleaderBoard();
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="relative flex flex-col items-center space-y-2 p-6 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md bg-white">
        <button
          onClick={() => setOpenLeaderboard(false)}
          className="absolute top-[-0.5rem] text-white bg-blue-600 rounded-full right-[-0.5rem] text-xl py-1 px-3 hover:bg-blue-500"
        >
          X
        </button>

        <div className="flex flex-col items-center text-white">
          <div className="flex">
            <div className="flex items-center justify-center w-[5rem] h-10 px-3 bg-blue-600  border-black rounded-tl-md">
              <span>RANK</span>
            </div>

            <div className="flex items-center justify-center h-10 px-3 bg-blue-600 w-[7rem]">
              <span>USERNAME</span>
            </div>

            <div className="flex items-center justify-center w-[5rem] h-10 px-3 bg-blue-600 rounded-tr-md ">
              <span>SCORE</span>
            </div>
          </div>

          {leaderboard.map((row, index) => (
            <div key={row.userId} className="flex text-black">
              <div className="flex items-center justify-center h-10 border-b border-x border-black w-[5rem] px-3">
                <span>{index + 1}</span>
              </div>

              <div className="flex items-center justify-center border-b border-r border-black h-10 w-[7rem] px-3">
                <span>{row.userName}</span>
              </div>

              <div className="flex items-center justify-center w-[5rem] h-10 px-3 border-b border-r border-black">
                <span>{row.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
