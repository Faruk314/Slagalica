import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { GameContext } from "../context/GameContext";
import QuizModal from "../modals/QuizModal";
import TargetNumber from "./TargetNumber";

interface Question {
  id: number;
  question: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  correctAnswer: string;
}

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Question | {}>({});
  const isEffectExecutedRef = useRef(false);
  const [correct, setCorrect] = useState<number | null>(null);
  const [incorrect, setIncorrect] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [points, setPoints] = useState(0);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const { updateScore, gameStates, updateGameState, updateGame, playerScore } =
    useContext(GameContext);
  const [seconds, setSeconds] = useState(120);
  const [gameStateFetched, setGameStateFetched] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (gameStates.quiz !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.quiz === "playing") {
      updateGameState("quiz", "lose");
      updateScore("quiz", points);
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [seconds, gameStates.quiz]);

  const dontKnowAnswerHandler = () => {
    let correctAnswerIndex = Object.entries(currentAnswers).findIndex(
      ([key, value]) => value === questions[currentQuestionIndex].correctAnswer
    );

    setCorrect(correctAnswerIndex);
  };

  const checkCorrectHandler = (answer: string) => {
    console.log(answer);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      let correctAnswerIndex = Object.entries(currentAnswers).findIndex(
        ([key, value]) => value === answer
      );
      setPoints((prev) => prev + 4);
      setCorrect(correctAnswerIndex);
    }

    if (answer !== questions[currentQuestionIndex].correctAnswer) {
      let incorrectAnswerIndex = Object.entries(currentAnswers).findIndex(
        ([key, value]) => value === answer
      );
      let correctAnswerIndex = Object.entries(currentAnswers).findIndex(
        ([key, value]) =>
          value === questions[currentQuestionIndex].correctAnswer
      );

      setPoints((prev) => prev - 2);
      setCorrect(correctAnswerIndex);
      setIncorrect(incorrectAnswerIndex);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex && currentQuestionIndex < 10) {
      setCurrentAnswers({
        answerOne: questions[currentQuestionIndex].answerOne,
        answersTwo: questions[currentQuestionIndex].answerTwo,
        answerThree: questions[currentQuestionIndex].answerThree,
        answerFour: questions[currentQuestionIndex].correctAnswer,
      });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    let timeout;

    if (correct) {
      setIsTimeOut(true);
      timeout = setTimeout(() => {
        setCorrect(null);
        setIncorrect(null);
        if (currentQuestionIndex < 9) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          updateGameState("quiz", "win");
          updateScore("quiz", points);
        }

        setIsTimeOut(false);
      }, 2000);
    }
  }, [correct, currentQuestionIndex, points]);

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/quiz"
        );

        console.log(response.data);

        updateGameState("quiz", response.data.gameState);
        setCurrentQuestionIndex(response.data.currentQuestionIndex);
        setPoints(response.data.score);
        setQuestions(response.data.questions);
        setSeconds(response.data.seconds);
        setCurrentAnswers(response.data.currentAnswers);
        setGameStateFetched(true);
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
      currentQuestionIndex,
      score: playerScore.quiz,
      gameState: gameStates.quiz,
      questions,
      seconds,
      currentAnswers,
    };

    if (gameStateFetched) {
      updateGame(gameState, "quiz");
    }
  }, [
    currentAnswers,
    questions,
    currentQuestionIndex,
    points,
    gameStates.quiz,
    playerScore.quiz,
  ]);

  return (
    <section className="flex items-center h-[100vh] text-white font-bold">
      <div className="absolute top-0 left-0">
        <span className="text-black">{seconds}</span>
      </div>
      {questions.length > 0 && (
        <div className="w-full max-w-4xl mx-2 md:mx-auto">
          <div className="relative h-[5rem] flex justify-center items-center text-center bg-blue-600 rounded-md">
            <p>
              {`${currentQuestionIndex + 1} )`}{" "}
              {questions[currentQuestionIndex].question}
            </p>
            <button
              onClick={() => !isTimeOut && dontKnowAnswerHandler()}
              className="absolute right-0 top-[-2.2rem] px-2 rounded-md py-1 bg-blue-600 hover:bg-blue-500"
            >
              Ne znam
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 my-5 text-center">
            {Object.entries(currentAnswers).map(([key, value], index) => (
              <button
                style={
                  correct === index
                    ? { backgroundColor: "green" }
                    : incorrect === index
                    ? { backgroundColor: "red" }
                    : {}
                }
                onClick={() => !isTimeOut && checkCorrectHandler(value)}
                key={key}
                className="py-2 bg-blue-600 rounded-md hover:bg-blue-500"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameStates.quiz !== "playing" && gameStateFetched && <QuizModal />}
    </section>
  );
};

export default Quiz;
