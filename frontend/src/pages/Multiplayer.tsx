import React, { useEffect, useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { FaPuzzlePiece } from "react-icons/fa";
import Player from "../cards/Player";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

const Multiplayer = () => {
  const {
    opponentScore,
    totalScore,
    opponentTotal,
    waitMessage,
    gameInfo,
    getGameInfo,
    createGameSession,
    setWinnerId,
  } = useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const { playerScore, gameStates, setMultiplayerGameOver } =
    useContext(GameContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    getGameInfo();
  }, []);

  useEffect(() => {
    createGameSession();
  }, []);

  useEffect(() => {
    socket?.on("gameOver", (data) => {
      setMultiplayerGameOver(true);
      setWinnerId(data.winnerId);
      navigate("/menu");
    });
  }, [socket, loggedUserInfo.userId, navigate]);

  // if (gameInfo.gameId === "") {
  //   return (
  //     <div className="flex items-center justify-center h-[100vh]">
  //       <div className="loader"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col space-y-10 items-center justify-center h-[100vh] text-gray-400 font-bold">
      <div className="flex items-center space-x-1 text-4xl">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>

      <div className="flex items-center justify-between w-full px-2">
        <Player totalScore={totalScore} userInfo={loggedUserInfo} />

        <Player totalScore={opponentTotal} userInfo={gameInfo} />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-2xl">
        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.longestWord}
          </span>
          <button
            disabled={gameStates.longestWord !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 text-blue-500  shadow-md rounded-full hover:bg-blue-600 hover:text-white disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/longestWord")}
          >
            Longest Word
          </button>

          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.longestWord}
          </span>
        </div>

        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.targetNumber}
          </span>
          <button
            disabled={gameStates.targetNumber !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 text-blue-500 hover:text-white  shadow-md rounded-full hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/targetNumber")}
          >
            Target Number
          </button>

          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.targetNumber}
          </span>
        </div>

        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.matchingPairs}
          </span>
          <button
            disabled={gameStates.matchingPairs !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 shadow-md text-blue-500 hover:text-white rounded-full hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/matchingPairs")}
          >
            Matching Pairs
          </button>

          <span className="flex items-center justify-center w-10 text-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.matchingPairs}
          </span>
        </div>

        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.quiz}
          </span>
          <button
            disabled={gameStates.quiz !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/quiz")}
          >
            Quiz
          </button>

          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.quiz}
          </span>
        </div>

        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.mastermind}
          </span>
          <button
            disabled={gameStates.mastermind !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/mastermind")}
          >
            Mastermind
          </button>

          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.mastermind}
          </span>
        </div>

        <div className="flex space-x-2">
          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {playerScore.associations}
          </span>
          <button
            disabled={gameStates.associations !== "" ? true : false}
            className="w-[15rem] flex justify-center items-center py-1 shadow-md rounded-full text-blue-500 hover:text-white  hover:bg-blue-600 disabled:text-gray-400 disabled:pointer-events-none"
            onClick={() => navigate("/associations")}
          >
            Associations
          </button>

          <span className="flex items-center justify-center w-10 text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full">
            {opponentScore.associations}
          </span>
        </div>
      </div>
      {waitMessage && <p className="text-black">{waitMessage}</p>}
    </div>
  );
};

export default Multiplayer;
