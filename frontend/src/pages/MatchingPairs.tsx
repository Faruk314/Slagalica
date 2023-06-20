import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { GameContext } from "../context/GameContext";
import MatchingPairsModal from "../modals/MatchingPairsModal";

interface Spojnica {
  id: number;
  question?: string;
  answer?: string;
}

const MatchingPairs = () => {
  const [leftSide, setLeftSide] = useState<Spojnica[]>([]);
  const [rightSide, setRightSide] = useState<Spojnica[]>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [corrects, setCorrects] = useState<number[]>([]);
  const [incorrects, setIncorrects] = useState<number[]>([]);
  const [leftClickedIndex, setLeftClickedIndex] = useState<number | null>(null);
  const [rightClickedIndex, setRightClickedIndex] = useState<number | null>(
    null
  );
  const [score, setScore] = useState(0);
  const { updateScore, gameStates, updateGameState, updateGame, playerScore } =
    useContext(GameContext);
  const [seconds, setSeconds] = useState(60);
  const [gameStateFetched, setGameStateFetched] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const isEffectExecutedRef = useRef(false);

  const handleLeftSideClick = (id: number) => {
    setLeftClickedIndex(id);
  };

  const handleRightSideClick = (id: number) => {
    setRightClickedIndex(id);
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (gameStates.matchingPairs !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.matchingPairs === "playing") {
      updateGameState("matchingPairs", "timeLose");
      updateScore("matchingPairs", score);
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [seconds, gameStates.matchingPairs]);

  useEffect(() => {
    const checkGameStatus = () => {
      if (totalAnswered === 8) {
        updateScore("matchingPairs", score);
        setRightSide((prev) => prev.sort((a, b) => a.id - b.id));
        setLeftSide((prev) => prev.sort((a, b) => a.id - b.id));
        updateGameState("matchingPairs", "win");
      }
    };

    checkGameStatus();
  }, [totalAnswered, score]);

  useEffect(() => {
    const checkCorrect = () => {
      if (rightClickedIndex && rightClickedIndex === leftClickedIndex) {
        setCorrects((prev) => [...prev, rightClickedIndex]);
        setScore((prev) => prev + 4);
      }

      if (leftClickedIndex && rightClickedIndex !== leftClickedIndex) {
        setIncorrects((prev) => [...prev, leftClickedIndex]);
      }

      setTotalAnswered((prev) => prev + 1);
      setRightClickedIndex(null);
      setLeftClickedIndex(null);
    };

    if (rightClickedIndex && leftClickedIndex) {
      checkCorrect();
    }
  }, [rightClickedIndex, leftClickedIndex]);

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/matchingPairs"
        );

        updateGameState("matchingPairs", response.data.gameState);
        setGameStartTime(response.data.seconds);
        setRightSide(response.data.rightSide);
        setLeftSide(response.data.leftSide);
        setSeconds(response.data.seconds);
        setCorrects(response.data.corrects);
        setIncorrects(response.data.incorrects);
        setGameStateFetched(true);

        const currentTime = Math.floor(Date.now() / 1000);
        const gameStartTime = response.data.seconds;
        const timeLeft = 60 - (currentTime - gameStartTime);
        setSeconds(timeLeft);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const gameState = {
      rightSide,
      leftSide,
      seconds: gameStartTime,
      corrects,
      incorrects,
      gameState: gameStates.matchingPairs,
      score: playerScore.matchingPairs,
    };

    if (gameStateFetched) {
      updateGame(gameState, "matchingPairs");
    }
  }, [
    rightSide,
    leftSide,
    incorrects,
    corrects,
    gameStates.matchingPairs,
    playerScore.matchingPairs,
  ]);

  return (
    <section className="flex items-center justify-center h-[100vh] font-bold">
      <div className="absolute top-0 left-0">
        <span>{seconds}</span>
      </div>
      <div className="flex space-x-10 text-white">
        <div className="flex flex-col space-y-1">
          {leftSide.map((item) => (
            <button
              style={
                corrects.includes(item.id)
                  ? { backgroundColor: "green" }
                  : incorrects.includes(item.id)
                  ? { backgroundColor: "red" }
                  : {}
              }
              onClick={() => handleLeftSideClick(item.id)}
              key={item.id}
              className="h-[3.2rem] bg-blue-600 rounded-md border w-[10rem] block focus:bg-blue-500"
            >
              <span className="">{item.question}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-1">
          {rightSide.map((item) => (
            <button
              style={
                corrects.includes(item.id)
                  ? { backgroundColor: "green" }
                  : incorrects.includes(item.id) &&
                    gameStates.matchingPairs !== "playing"
                  ? { backgroundColor: "red" }
                  : {}
              }
              onClick={() => {
                if (leftClickedIndex) {
                  handleRightSideClick(item.id);
                }
              }}
              key={item.id}
              className="h-[3.2rem] bg-blue-600 rounded-md border w-[10rem] block"
            >
              <span className="">{item.answer}</span>
            </button>
          ))}
        </div>
      </div>

      {gameStates.matchingPairs !== "playing" && gameStateFetched && (
        <MatchingPairsModal />
      )}
    </section>
  );
};

export default MatchingPairs;
