import React from "react";
import { UserInfo } from "../context/AuthContext";

interface Props {
  userInfo: UserInfo;
  totalScore: number;
}

const Player = ({ userInfo, totalScore }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        className="w-[5rem] h-[5rem] border-4 border-blue-600 rounded-full"
        alt=""
        src="/images/skocko.png"
      />

      <div className="px-5 font-bold text-center text-white bg-blue-600 rounded-lg">
        <p>{userInfo.userName}</p>
      </div>

      <span className="text-3xl">{totalScore}</span>
    </div>
  );
};

export default Player;
