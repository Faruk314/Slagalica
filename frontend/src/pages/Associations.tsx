import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import AssociationsModal from "../modals/AssociationsModal";
import TypeAnswer from "../modals/TypeAnswer";

interface Association {
  id: number;
  first: string;
  second: string;
  third: string;
  fourth: string;
  answer: string;
  finalAnswer: string;
}

const Associations = () => {
  const [openTypeAnswer, setOpenTypeAnswer] = useState(false);
  const [currentAssociationIndex, setCurrentAssociationIndex] = useState<
    number | null
  >(null);
  const [answer, setAnswer] = useState("");
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number[]>([]);
  const [guessFinal, setGuessFinal] = useState(false);
  const [seconds, setSeconds] = useState(100);
  const [ass, setAss] = useState<Association[]>([]);
  const isEffectExecutedRef = useRef(false);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [fieldsOpenCount, setFieldsOpenCount] = useState<any>({
    0: [],
    1: [],
    2: [],
    3: [],
  });
  const {
    updateScore,
    updateGameState,
    gameStates,
    updateGame,
    playerScore,
    gameId,
  } = useContext(GameContext);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameStateFetched, setGameStateFetched] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    let unsubscribed = false;
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/associations"
        );

        updateGameState("associations", response.data.gameState);
        setAnsweredCorrectly(response.data.answeredCorrectly);
        setFieldsOpenCount(response.data.fieldsOpenCount);
        setScore(response.data.score);
        setFinalAnswer(response.data.finalAnswer);
        setAss(response.data.ass);
        setGameStartTime(response.data.seconds);
        setGameStateFetched(true);
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

    if (gameStates.associations !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.associations === "playing") {
      updateGameState("associations", "lose");
      updateScore("associations", score);
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "associations",
          score,
        });
      }
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [seconds]);

  useEffect(() => {
    const gameState = {
      fieldsOpenCount,
      score: playerScore.associations,
      finalAnswer,
      ass,
      seconds: gameStartTime,
      answeredCorrectly,
      gameState: gameStates.associations,
    };

    if (gameStateFetched) {
      updateGame(gameState, "associations");
    }
  }, [
    fieldsOpenCount,
    ass,
    playerScore.associations,
    finalAnswer,
    answeredCorrectly,
    gameStates.associations,
    gameStateFetched,
    gameStartTime,
  ]);

  const checkCorrectHandler = () => {
    if (guessFinal && answer.toLowerCase() === finalAnswer.toLowerCase()) {
      setAnsweredCorrectly([0, 1, 2, 3]);

      updateGameState("associations", "win");
      setOpenTypeAnswer(false);
      let numberOfClosedFields =
        16 -
        (fieldsOpenCount[0].length +
          fieldsOpenCount[1].length +
          fieldsOpenCount[2].length +
          fieldsOpenCount[3].length) +
        4 * 3;
      updateScore("associations", numberOfClosedFields + 8);
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "associations",
          score: numberOfClosedFields + 8,
        });
      }
      return;
    }

    if (currentAssociationIndex === null) return;

    let correctAnswer = ass[currentAssociationIndex].answer;

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      setAnsweredCorrectly((prev) => [...prev, currentAssociationIndex]);
      setOpenTypeAnswer(false);
      setScore(
        (prev) =>
          prev + 3 + (4 - fieldsOpenCount[currentAssociationIndex].length)
      );
    }
  };

  const handleClick = (e: any, row: number, associationIndex: number) => {
    const fieldsCountCopy: any = { ...fieldsOpenCount };

    if (!fieldsCountCopy[row].includes(associationIndex)) {
      fieldsCountCopy[row].push(associationIndex);
    }

    setFieldsOpenCount(fieldsCountCopy);
  };

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] text-white text-center font-bold">
      {gameStateFetched && (
        <span className="absolute text-black top-2">{seconds}</span>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-20">
        {ass.map((association, row) => (
          <div key={association.id} className="flex flex-col space-y-1">
            <button
              style={
                answeredCorrectly.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 0)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(0) ||
                answeredCorrectly.includes(row)
                  ? association.first
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrectly.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 1)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(1) ||
                answeredCorrectly.includes(row)
                  ? association.second
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrectly.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 2)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(2) ||
                answeredCorrectly.includes(row)
                  ? association.third
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrectly.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 3)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span className="">
                {fieldsOpenCount[row].includes(3) ||
                answeredCorrectly.includes(row)
                  ? association.fourth
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrectly.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={() => {
                if (
                  answeredCorrectly.includes(row) ||
                  fieldsOpenCount[row].length === 0
                )
                  return;
                setOpenTypeAnswer(true);
                setCurrentAssociationIndex(row);
              }}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span className="">
                {answeredCorrectly.includes(row) ? association.answer : "?"}
              </span>
            </button>
          </div>
        ))}
      </div>

      <button
        style={
          gameStates.associations === "win"
            ? { backgroundColor: "green" }
            : gameStates.associations === "lose"
            ? { backgroundColor: "red" }
            : {}
        }
        onClick={() => {
          if (
            gameStates.associations !== "playing" ||
            answeredCorrectly.length === 0
          )
            return;
          setGuessFinal(true);
          setOpenTypeAnswer(true);
        }}
        className="absolute top-[50% + 10rem] right-[50% - 10rem] bg-blue-600 h-[2.5rem] w-[10rem] md:w-[12rem] rounded-md flex justify-center items-center"
      >
        <span className="">
          {gameStates.associations === "win" ? finalAnswer : "?"}
        </span>
      </button>

      {openTypeAnswer && (
        <TypeAnswer
          guessFinal={guessFinal}
          setOpenTypeAnswer={setOpenTypeAnswer}
          setAnswer={setAnswer}
          checkCorrectHandler={checkCorrectHandler}
        />
      )}

      {gameStates.associations !== "playing" && gameStateFetched && (
        <AssociationsModal
          gameState={gameStates.associations}
          finalAnswer={finalAnswer}
        />
      )}
    </section>
  );
};

export default Associations;
