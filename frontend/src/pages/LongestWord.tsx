import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import axios from "axios";
import { GameContext } from "../context/GameContext";
import LongestWordModal from "../modals/LongestWordModal";
import { SocketContext } from "../context/SocketContext";

const LongestWord = () => {
  const [seconds, setSeconds] = useState(5);
  const [longestWord, setLongestWord] = useState("");
  const [letters, setLetters] = useState<string[]>([]);
  const [chosenLetters, setChossenLetters] = useState<string[]>([]);
  const isEffectExecutedRef = useRef(false);
  const [chosenLettersIndexes, setChosenLettersIndexes] = useState<number[]>(
    []
  );
  const { updateGameState } = useContext(GameContext);
  const { updateScore, gameStates, updateGame, playerScore, gameId } =
    useContext(GameContext);
  const [gameStateFetched, setGameStateFetched] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const { socket } = useContext(SocketContext);

  const updatedGameState = useMemo(
    () => ({
      longestWord,
      chosenLetters,
      chosenLettersIndexes,
      letters,
      seconds: gameStartTime,
      gameState: gameStates.longestWord,
      score: playerScore.longestWord,
    }),
    [
      longestWord,
      chosenLetters,
      chosenLettersIndexes,
      letters,
      gameStartTime,
      gameStates.longestWord,
      playerScore.longestWord,
    ]
  );

  useEffect(() => {
    let unsubscribed = false;
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/longestWord"
        );

        updateGameState("longestWord", response.data.gameState);
        setChossenLetters(response.data.chosenLetters);
        setChosenLettersIndexes(response.data.chosenLettersIndexes);
        setLetters(response.data.letters);
        setLongestWord(response.data.longestWord);
        setGameStateFetched(true);
        setGameStartTime(response.data.seconds);
        const currentTime = Math.floor(Date.now() / 1000);
        const gameStartTime = response.data.seconds;
        const timeLeft = 60 - (currentTime - gameStartTime);
        setSeconds(timeLeft);
      } catch (error) {
        console.log(error);
      }
    };

    if (!unsubscribed) {
      initGame();
    }

    return () => {
      unsubscribed = true;
    };
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (gameStates.longestWord !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.longestWord === "playing") {
      updateGameState("longestWord", "timeLose");
      updateScore("longestWord", 0);
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "longestWord",
          score: 0,
        });
      }
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [
    seconds,
    gameStates.longestWord,
    gameId,
    socket,
    updateGameState,
    updateScore,
  ]);

  const submitHandler = async () => {
    const word: string = chosenLetters.join("");
    let score = 0;

    try {
      const validity = await axios.post(
        "http://localhost:4000/api/wordgame/checkWordValidity",
        { word }
      );

      if (validity.data && word.length === longestWord.length) {
        score = 20;
        updateScore("longestWord", score);
        updateGameState("longestWord", "win");
      }

      if (validity.data && word.length !== longestWord.length) {
        score = word.length;
        updateScore("longestWord", word.length);
        updateGameState("longestWord", "win");
      }

      if (validity.data === false) {
        updateGameState("longestWord", "lose");
      }

      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "longestWord",
          score,
        });
      }
    } catch (error) {
      console.log(error);
      updateGameState("longestWord", "lose");
    }
  };

  const handleClick = (letter: string, index: number) => {
    setChossenLetters((prev) => [...prev, letter]);
    setChosenLettersIndexes((prev) => [...prev, index]);
  };

  const deleteHandler = () => {
    let chosenLettersCopy = [...chosenLetters];
    let chosenlettersIndexesCopy = [...chosenLettersIndexes];

    chosenLettersCopy.splice(chosenLettersCopy.length - 1, 1);
    chosenlettersIndexesCopy.splice(chosenlettersIndexesCopy.length - 1, 1);

    setChossenLetters(chosenLettersCopy);
    setChosenLettersIndexes(chosenlettersIndexesCopy);
  };

  useEffect(() => {
    if (gameStateFetched) {
      updateGame(updatedGameState, "longestWord");
    }
  }, [
    chosenLetters,
    chosenLettersIndexes,
    letters,
    longestWord,
    gameStates.longestWord,
    playerScore.longestWord,
    updateGame,
    gameStateFetched,
    updatedGameState,
  ]);

  if (!gameStateFetched) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center h-[100vh] mx-2 mt-2 space-y-5  max-w-5xl md:mx-auto">
      <span className="absolute top-0">{seconds}</span>
      {gameStateFetched && (
        <div className="grid grid-cols-6 gap-2 text-xl font-bold text-white rounded-md">
          {letters.map((letter, index) => (
            <button
              disabled={chosenLettersIndexes.includes(index) ? true : false}
              onClick={() => handleClick(letter, index)}
              className="h-[3rem] bg-blue-600 rounded-md disabled:text-gray-400"
              key={index}
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      <div className="flex space-x-2">
        <div className="flex items-center justify-center w-full h-10 text-black border border-black rounded-md">
          <span> {chosenLetters}</span>
        </div>
        <button
          onClick={deleteHandler}
          className="px-3 text-white bg-red-600 rounded-md"
        >
          X
        </button>
      </div>

      <button
        disabled={chosenLetters.length > 1 ? false : true}
        onClick={submitHandler}
        className="p-2 mx-auto font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
      >
        SUBMIT
      </button>

      {gameStateFetched && gameStates.longestWord !== "playing" && (
        <LongestWordModal
          gameState={gameStates.longestWord}
          word={chosenLetters.join("")}
          computerWord={longestWord}
        />
      )}
    </section>
  );
};

export default LongestWord;
