import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

interface Props {
  winCombination: string[];
  gameState: string;
}

const GameOver = ({ winCombination, gameState }: Props) => {
  const { gameId } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center p-2 mx-2 bg-white rounded-md">
        <h2 className="text-xl text-center">
          {gameState === "win"
            ? "You got the right combination!"
            : "You did not get the right combination"}
        </h2>

        <div className="grid items-center grid-cols-4 py-5 space-x-1">
          {winCombination.map((simbol, index) => (
            <img key={index} alt="" src={simbol} className="h-[3rem]" />
          ))}
        </div>

        <button
          onClick={() => {
            if (gameId !== "") {
              navigate("/multiplayer");
              return;
            }
            navigate("/singlePlayer");
          }}
          className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Nastavi
        </button>
      </div>
    </div>
  );
};

export default GameOver;
