import React, { useEffect, useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPuzzlePiece } from "react-icons/fa";
import Player from "../cards/Player";
import { AuthContext } from "../context/AuthContext";
import { UserInfo } from "../context/AuthContext";

interface GameInfo extends UserInfo {
  gameId?: string;
}

const Multiplayer = () => {
  const { setGameId, opponentScore, setOpponentScore } =
    useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const { playerScore, gameStates } = useContext(GameContext);
  const navigate = useNavigate();
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    userId: 0,
    gameId: "",
    userName: "",
    image: "",
  });

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
    const getGameInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameInfo"
        );

        setGameId(response.data.gameData.gameId);
        setGameInfo(response.data.gameData);

        if (response.data.scores.playerOne.userId === loggedUserInfo.userId) {
          setOpponentScore(response.data.scores.playerTwo);
        }

        if (response.data.scores.playerTwo.userId === loggedUserInfo.userId) {
          setOpponentScore(response.data.scores.playerOne);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getGameInfo();
  }, [loggedUserInfo.userId]);

  return (
    <div className="flex flex-col space-y-10 items-center justify-center h-[100vh] text-gray-400 font-bold">
      <div className="flex items-center space-x-1 text-4xl">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>
      <div className="flex justify-between w-full px-2">
        <Player userInfo={loggedUserInfo} />

        <Player userInfo={gameInfo} />
      </div>

      {gameInfo && (
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
      )}
    </div>
  );
};

export default Multiplayer;
