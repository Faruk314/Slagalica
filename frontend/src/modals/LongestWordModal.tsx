import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

interface Props {
  gameState: string;
  word: string;
  computerWord: string;
}

const LongestWordModal = ({ gameState, word, computerWord }: Props) => {
  const { playerScore } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center px-3 py-2 mx-2 space-y-2 bg-white rounded-md">
        {gameState === "win" && (
          <div className="text-center">
            <h2>
              We accept the word <span className="font-bold">{word}</span>
            </h2>
            <h2>
              Computer word is{" "}
              <span className="font-bold">{computerWord.toUpperCase()}</span>
            </h2>

            <span>
              Number of points you earned:{" "}
              <span className="font-bold">{playerScore.longestWord}</span>
            </span>
          </div>
        )}

        {gameState === "lose" && (
          <div className="text-center">
            <h2>
              We can not accept the word{" "}
              <span className="font-bold">{word}</span>
            </h2>
            <h2>
              Our word is{" "}
              <span className="font-bold">{computerWord.toUpperCase()}</span>
            </h2>

            <span>
              Number of points you earned:{" "}
              <span className="font-bold">{playerScore.longestWord}</span>
            </span>
          </div>
        )}

        {gameState === "timeLose" && (
          <div className="text-center">
            <h2>You ran out of time!</h2>
            <h2>
              Our word is{" "}
              <span className="font-bold">{computerWord.toUpperCase()}</span>
            </h2>

            <span>
              Number of points you earned:{" "}
              <span className="font-bold">{playerScore.longestWord}</span>
            </span>
          </div>
        )}

        {gameState === "gameLeave" && (
          <div className="text-center">
            <h2>You lost</h2>
            <h2>
              Our word is{" "}
              <span className="font-bold">{computerWord.toUpperCase()}</span>
            </h2>

            <span>
              Number of points you earned:{" "}
              <span className="font-bold">{playerScore.longestWord}</span>
            </span>
          </div>
        )}

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

export default LongestWordModal;
