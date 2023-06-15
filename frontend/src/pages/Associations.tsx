import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { GameContext } from "../context/GameContext";
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
  const [answeredCorrecty, setAnsweredCorrectly] = useState<number[]>([]);
  const [guessFinal, setGuessFinal] = useState(false);
  const [gameState, setGameState] = useState("playing");
  const [seconds, setSeconds] = useState(120);
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
  const { updateScore } = useContext(GameContext);

  console.log("answeredCorrectly", answeredCorrecty);
  console.log(answer);

  console.log(score, "score");

  // useEffect(() => {
  //   const countdown = setInterval(() => {
  //     setSeconds((prev) => prev - 1);
  //   }, 1000);

  //   if (seconds === 0) {
  //     console.log("You run out of time");
  //     clearInterval(countdown);
  //   }

  //   return () => {
  //     clearInterval(countdown);
  //   };
  // }, [seconds]);

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/associations/getAssociations"
        );

        console.log(response.data);
        setFinalAnswer(response.data[0].finalAnswer);
        setAss(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  const checkCorrectHandler = () => {
    if (guessFinal && answer.toLowerCase() === finalAnswer.toLowerCase()) {
      setAnsweredCorrectly([0, 1, 2, 3]);
      setGameState("win");
      setOpenTypeAnswer(false);
      let numberOfClosedFields =
        16 -
        (fieldsOpenCount[0].length +
          fieldsOpenCount[1].length +
          fieldsOpenCount[2].length +
          fieldsOpenCount[3].length) +
        4 * 3;
      updateScore("associations", numberOfClosedFields + 8);
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
      <span className="absolute text-black top-2">{seconds}</span>

      <div className="grid grid-cols-2 gap-x-5 gap-y-20">
        {ass.map((association, row) => (
          <div key={association.id} className="flex flex-col space-y-1">
            <button
              style={
                answeredCorrecty.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 0)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(0) ||
                answeredCorrecty.includes(row)
                  ? association.first
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrecty.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 1)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(1) ||
                answeredCorrecty.includes(row)
                  ? association.second
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrecty.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 2)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span>
                {fieldsOpenCount[row].includes(2) ||
                answeredCorrecty.includes(row)
                  ? association.third
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrecty.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={(e) => handleClick(e, row, 3)}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span className="">
                {fieldsOpenCount[row].includes(3) ||
                answeredCorrecty.includes(row)
                  ? association.fourth
                  : "?"}
              </span>
            </button>
            <button
              style={
                answeredCorrecty.includes(row)
                  ? { backgroundColor: "green" }
                  : {}
              }
              onClick={() => {
                if (
                  answeredCorrecty.includes(row) ||
                  fieldsOpenCount[row].length === 0
                )
                  return;
                setOpenTypeAnswer(true);
                setCurrentAssociationIndex(row);
              }}
              className="h-[2.5rem] w-[8rem] md:w-[10rem] flex justify-center items-center bg-blue-600 rounded-md"
            >
              <span className="">
                {answeredCorrecty.includes(row) ? association.answer : "?"}
              </span>
            </button>
          </div>
        ))}
      </div>

      <button
        style={
          gameState === "win"
            ? { backgroundColor: "green" }
            : gameState === "lose"
            ? { backgroundColor: "red" }
            : {}
        }
        onClick={() => {
          if (gameState !== "playing" || answeredCorrecty.length === 0) return;
          setGuessFinal(true);
          setOpenTypeAnswer(true);
        }}
        className="absolute top-[50% + 10rem] right-[50% - 10rem] bg-blue-600 h-[2.5rem] w-[10rem] md:w-[12rem] rounded-md flex justify-center items-center"
      >
        <span className="">{gameState === "win" ? finalAnswer : "?"}</span>
      </button>

      {openTypeAnswer && (
        <TypeAnswer
          guessFinal={guessFinal}
          setOpenTypeAnswer={setOpenTypeAnswer}
          setAnswer={setAnswer}
          checkCorrectHandler={checkCorrectHandler}
        />
      )}

      {gameState !== "playing" && (
        <AssociationsModal gameState={gameState} finalAnswer={finalAnswer} />
      )}
    </section>
  );
};

export default Associations;
