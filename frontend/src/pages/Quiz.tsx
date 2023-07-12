import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useState, useContext, useRef } from "react";
import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import QuizModal from "../modals/QuizModal";

interface Question {
  id: number;
  question: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  correctAnswer: string;
}

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(9);
  const [currentAnswers, setCurrentAnswers] = useState<Question | {}>({});
  const [correct, setCorrect] = useState<number | null>(null);
  const [incorrect, setIncorrect] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [points, setPoints] = useState(0);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const {
    updateScore,
    gameStates,
    updateGameState,
    updateGame,
    playerScore,
    gameId,
  } = useContext(GameContext);
  const [seconds, setSeconds] = useState(120);
  const [gameStateFetched, setGameStateFetched] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    let unsubscribed = false;
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

    if (gameStates.quiz !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.quiz === "playing") {
      updateGameState("quiz", "lose");
      updateScore("quiz", 0);

      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "quiz",
          score: 0,
        });
      }
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [seconds]);

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
    if (currentQuestionIndex && currentQuestionIndex < 10 && gameStateFetched) {
      setCurrentAnswers({
        answerOne: questions[currentQuestionIndex].answerOne,
        answersTwo: questions[currentQuestionIndex].answerTwo,
        answerThree: questions[currentQuestionIndex].answerThree,
        answerFour: questions[currentQuestionIndex].correctAnswer,
      });
    }
  }, [currentQuestionIndex, gameStateFetched, questions]);

  useEffect(() => {
    if (correct) {
      setIsTimeOut(true);
      setTimeout(() => {
        setCorrect(null);
        setIncorrect(null);
        if (currentQuestionIndex < 9) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          updateGameState("quiz", "win");
          updateScore("quiz", points);
          if (gameId !== "" && socket) {
            socket.emit("updateGameState", {
              gameId,
              gameName: "quiz",
              score: points,
            });
          }
        }

        setIsTimeOut(false);
      }, 2000);
    }
  }, [
    correct,
    currentQuestionIndex,
    points,
    updateScore,
    gameId,
    socket,
    updateGameState,
  ]);

  useEffect(() => {
    const gameState = {
      currentQuestionIndex,
      score: playerScore.quiz,
      gameState: gameStates.quiz,
      questions,
      seconds: gameStartTime,
      currentAnswers,
    };

    if (gameStateFetched) {
      updateGame(gameState, "quiz");
    }
  }, [
    currentAnswers,
    questions,
    currentQuestionIndex,
    gameStates.quiz,
    playerScore.quiz,
    gameStartTime,
    gameStateFetched,
  ]);

  return (
    <section className="flex items-center h-[100vh] text-white font-bold">
      <div className="absolute top-0 left-0">
        <span className="text-black">{seconds}</span>
      </div>
      {questions.length > 0 && gameStateFetched && (
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
              skip
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 my-5 text-center">
            {Object.entries(currentAnswers).map(([key, value], index) => (
              <button
                onClick={() => !isTimeOut && checkCorrectHandler(value)}
                key={key}
                className={classNames("py-2 bg-blue-600 rounded-md", {
                  "bg-green-600": correct === index,
                  "bg-red-600": incorrect === index,
                  "hover:bg-blue-500": !isTimeOut,
                })}
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
