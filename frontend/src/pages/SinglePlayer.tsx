import axios from "axios";
import React, { useContext, useEffect } from "react";
import { FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

const SinglePlayer = () => {
  const {
    playerScore,
    totalScore,
    gameStates,
    statsFetched,
    setTotalScore,
    setGameStates,
    setPlayerScore,
    setGameFinished,
  } = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    const createGameSession = async () => {
      try {
        await axios.post("http://localhost:4000/api/game/createGameSession");
      } catch (error) {
        console.log(error);
      }
    };

    createGameSession();
  }, []);

  useEffect(() => {
    const checkGameOver = (): boolean => {
      let numberOfFinishedGames = 0;

      console.log(Object.values(gameStates));

      Object.values(gameStates).forEach((value) => {
        if (value !== "" && value !== "playing") {
          numberOfFinishedGames++;
        }
      });

      console.log(numberOfFinishedGames);

      if (numberOfFinishedGames === 6) {
        return true;
      } else {
        return false;
      }
    };

    const updateLeaderboard = async () => {
      try {
        await axios.delete("http://localhost:4000/api/game/deleteGameSession");
        setTotalScore(0);
        setGameStates({
          associations: "",
          longestWord: "",
          mastermind: "",
          matchingPairs: "",
          quiz: "",
          targetNumber: "",
        });
        setPlayerScore({
          associations: 0,
          longestWord: 0,
          mastermind: 0,
          matchingPairs: 0,
          quiz: 0,
          targetNumber: 0,
        });
        setGameFinished(true);
        navigate("/menu");
      } catch (error) {
        console.log(error);
      }
    };

    if (checkGameOver()) {
      updateLeaderboard();
    }
  }, [gameStates, navigate]);

  return (
    <div className="flex flex-col space-y-10 items-center justify-center h-[100vh] text-gray-400 font-bold">
      {statsFetched && (
        <div className="absolute top-2">
          <div className="p-1 px-2 text-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            <span className="text-blue-500">Total: </span>
            <span>{totalScore}</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-1 text-4xl">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>

      {statsFetched && (
        <div className="flex flex-col items-center justify-center space-y-4 text-2xl">
          <div className="flex space-x-2">
            <button
              disabled={gameStates.longestWord !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 text-blue-500  shadow-md rounded-full hover:bg-blue-600 hover:text-white disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/longestWord")}
            >
              Longest Word
            </button>

            <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.longestWord}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              disabled={gameStates.targetNumber !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 text-blue-500 hover:text-white  shadow-md rounded-full hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/targetNumber")}
            >
              Target Number
            </button>

            <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.targetNumber}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              disabled={gameStates.matchingPairs !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 shadow-md text-blue-500 hover:text-white rounded-full hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/matchingPairs")}
            >
              Matching Pairs
            </button>

            <span className="flex items-center justify-center w-10 text-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.matchingPairs}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              disabled={gameStates.quiz !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/quiz")}
            >
              Quiz
            </button>

            <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.quiz}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              disabled={gameStates.mastermind !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/mastermind")}
            >
              Mastermind
            </button>

            <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.mastermind}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              disabled={gameStates.associations !== "" ? true : false}
              className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => navigate("/associations")}
            >
              Associations
            </button>

            <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
              {playerScore.associations}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePlayer;
