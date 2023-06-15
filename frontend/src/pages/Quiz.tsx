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
  const [gameOver, setGameOver] = useState(false);
  const { updateScore } = useContext(GameContext);

  console.log(gameOver, "gameOver");

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
      console.log(currentQuestionIndex);

      console.log("proslo", currentQuestionIndex);

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
          setGameOver(true);
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
          "http://localhost:4000/api/quiz/getQuestions"
        );

        let answers = response.data.map((question: Question) => {
          return {
            answerOne: question.answerOne,
            answersTwo: question.answerTwo,
            answerThree: question.answerThree,
            answerFour: question.correctAnswer,
          };
        });

        setCurrentQuestionIndex(0);
        setQuestions(response.data);
        setCurrentAnswers(answers[0]);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  return (
    <section className="flex items-center h-[100vh] text-white font-bold">
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

      {gameOver && <QuizModal />}
    </section>
  );
};

export default Quiz;
