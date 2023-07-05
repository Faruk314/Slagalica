import React, { useEffect, useState, useRef, useContext } from "react";
import { Parser } from "expr-eval";
import { GameContext } from "../context/GameContext";
import TargetNumberModal from "../modals/TargetNumberModal";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const TargetNumber = () => {
  const [chars, setChars] = useState<Array<string | number>>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const operands = ["(", ")", "+", "-", "*", "/"];
  const isEffectExecutedRef = useRef(false);
  const [usedNumbersIndexes, setUsedNumbersIndexes] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const {
    updateScore,
    updateGameState,
    gameStates,
    updateGame,
    playerScore,
    gameId,
  } = useContext(GameContext);
  const [seconds, setSeconds] = useState(90);
  const [gameStateFetched, setGameStateFetched] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (gameStates.targetNumber !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.targetNumber === "playing") {
      setResult(0);
      updateGameState("targetNumber", "lose");
      updateScore("targetNumber", 0);

      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "targetNumber",
          score: 0,
        });
      }

      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [
    seconds,
    gameStates.targetNumber,
    gameId,
    socket,
    updateGameState,
    updateScore,
  ]);

  const submitHandler = () => {
    const parser = new Parser();
    const resultString = chars.join(" ");

    try {
      const result = parser.evaluate(resultString);
      console.log("Result:", result);
      let score = 0;
      const difference = targetNumber - result;

      if (difference === 0) {
        score = 30;
        updateScore("targetNumber", score);
      }

      if (difference === 1) {
        score = 20;
        updateScore("targetNumber", score);
      }

      if (difference > 1 && difference <= 5) {
        score = 10;
        updateScore("targetNumber", score);
      }

      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "targetNumber",
          score,
        });
      }

      updateGameState("targetNumber", "win");
      setResult(result);
    } catch (error) {
      console.error("Invalid expression:", error);
      setResult(0);
      updateGameState("targetNumber", "lose");
    }
  };

  const deleteCharHandler = () => {
    let charsCopy = [...chars];
    let usedNumbersCopy = [...usedNumbersIndexes];

    if (typeof charsCopy[charsCopy.length - 1] === "number") {
      usedNumbersCopy.splice(usedNumbersCopy.length - 1, 1);
      setUsedNumbersIndexes(usedNumbersCopy);
    }

    charsCopy.splice(charsCopy.length - 1, 1);

    setChars(charsCopy);
  };

  const handleClick = (char: any, charIndex: number | null) => {
    const operators = ["+", "-", "/", "*"];
    const lastChar: any = chars[chars.length - 1];

    if (chars.length === 0 && (operators.includes(char) || char === ")"))
      return;

    if (typeof lastChar === "number" && typeof char === "number") return;

    if (operators.includes(lastChar) && operators.includes(char)) return;

    if (lastChar === "(" && char === ")") return;

    if (operators.includes(lastChar) && char === ")") return;

    if (typeof lastChar === "number" && char === "(") return;

    if (typeof char === "number" && charIndex !== null) {
      setUsedNumbersIndexes((prev) => [...prev, charIndex]);
    }

    const updatedChars = [...chars, char];
    setChars(updatedChars);
  };

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/targetNumber"
        );

        console.log(response.data);

        setGameStartTime(response.data.seconds);
        setGameStateFetched(true);
        updateGameState("targetNumber", response.data.gameState);
        setTargetNumber(response.data.targetNumber);
        setRandomNumbers(response.data.randomNumbers);
        setChars(response.data.chars);
        setUsedNumbersIndexes(response.data.usedNumbersIndexes);
        setResult(response.data.result);
        const currentTime = Math.floor(Date.now() / 1000);
        const gameStartTime = response.data.seconds;
        const timeLeft = 90 - (currentTime - gameStartTime);
        setSeconds(timeLeft);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, [updateGameState]);

  useEffect(() => {
    const gameState = {
      targetNumber,
      randomNumbers,
      chars,
      seconds: gameStartTime,
      usedNumbersIndexes,
      result,
      gameState: gameStates.targetNumber,
      score: playerScore.targetNumber,
    };

    if (gameStateFetched) {
      updateGame(gameState, "targetNumber");
    }
  }, [
    chars,
    randomNumbers,
    usedNumbersIndexes,
    result,
    targetNumber,
    gameStates.targetNumber,
    playerScore.targetNumber,
    gameStateFetched,
    gameStartTime,
    updateGame,
  ]);

  return (
    <section className="flex items-center h-[100vh] text-white font-bold">
      <span className="absolute top-0 text-black">{seconds}</span>
      {gameStateFetched && (
        <div className="flex flex-col w-full max-w-4xl mx-auto space-y-5">
          <div className="mx-2">
            <div className="h-[3rem] bg-blue-600 w-[10rem] mx-auto flex justify-center items-center rounded-md">
              <span className="text-2xl"> {targetNumber}</span>
            </div>

            <div className="grid grid-cols-6 gap-1 mt-2 rounded-md">
              {randomNumbers.map((number, index) => (
                <button
                  disabled={usedNumbersIndexes.includes(index) ? true : false}
                  onClick={() => {
                    handleClick(number, index);
                  }}
                  key={index}
                  className="flex items-center justify-center h-10 bg-blue-600 rounded-md disabled:text-gray-400"
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-black h-[2rem] rounded-md mx-2 text-black flex justify-center items-center">
            {chars.map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </div>

          <div className="mx-2">
            <div className="grid grid-cols-6 gap-1">
              {operands.map((operand, index) => (
                <button
                  onClick={() => {
                    handleClick(operand, null);
                  }}
                  key={index}
                  className="flex items-center justify-center py-1 text-xl bg-blue-600 border rounded-md"
                >
                  <span>{operand}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center mx-auto mt-5 space-x-2">
              <button
                onClick={deleteCharHandler}
                className="px-2 py-1 text-white bg-red-600 rounded-md hover:bg-red-500"
              >
                DELETE
              </button>

              <button
                onClick={submitHandler}
                className="px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {gameStates.targetNumber !== "playing" && result !== null && (
        <TargetNumberModal
          computerNumber={targetNumber}
          playerNumber={result}
        />
      )}
    </section>
  );
};

export default TargetNumber;
