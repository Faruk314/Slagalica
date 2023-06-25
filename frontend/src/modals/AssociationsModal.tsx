import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

interface Props {
  gameState: string;
  finalAnswer: string;
}

const AssociationsModal = ({ gameState, finalAnswer }: Props) => {
  const { playerScore, gameId } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)] font-normal">
      <div className="flex flex-col items-center px-3 py-2 mx-2 space-y-2 text-black bg-white rounded-md">
        {gameState === "win" && (
          <div>
            <h2 className="">
              You got the final answer{" "}
              <span className="font-bold">{finalAnswer}</span>
            </h2>
          </div>
        )}

        {gameState === "lose" && <span>You run out of time!</span>}

        <div className="text-center">
          <span>Number of points: </span>
          <span className="font-bold">{playerScore.associations}</span>
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
          Continiue
        </button>
      </div>
    </div>
  );
};

export default AssociationsModal;
