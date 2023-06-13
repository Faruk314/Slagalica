import React, { useEffect, useState, useRef } from "react";

interface Question {
  id: number;
  question: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  correctAnswer: string;
}

let questions = [
  {
    id: 1,
    question: "Koji znanstvenik je formulirao teoriju relativnosti?",
    answerOne: "Isaac Newton",
    answerTwo: "Nikola Tesla",
    answerThree: "Marie Curie",
    correctAnswer: "Albert Einstein",
  },
  {
    id: 2,
    question: "Koja država je najveća na svijetu po površini?",
    answerOne: "Kanada",
    answerTwo: "Australija",
    answerThree: "Brazil",
    correctAnswer: "Rusija",
  },
  {
    id: 3,
    question: "Koje godine je bila Francuska revolucija?",
    answerOne: "1804",
    answerTwo: "1776",
    answerThree: "1799",
    correctAnswer: "1789",
  },
  {
    id: 4,
    question: "Koji je najdulji rijeka na svijetu?",
    answerOne: "Amazona",
    answerTwo: "Jangce",
    answerThree: "Misisipi",
    correctAnswer: "Nil",
  },
  {
    id: 5,
    question: "Koja je najveća planina na Zemlji?",
    answerOne: "K2",
    answerTwo: "Mount Kilimandžaro",
    answerThree: "Mount Denali",
    correctAnswer: "Mount Everest",
  },
  {
    id: 6,
    question: "Tko je napisao roman 'Rat i mir'?",
    answerOne: "Fjodor Dostojevski",
    answerTwo: "Charles Dickens",
    answerThree: "Victor Hugo",
    correctAnswer: "Lev Tolstoj",
  },
  {
    id: 7,
    question: "Koja je najveća živa životinja na Zemlji?",
    answerOne: "Kit ubojica",
    answerTwo: "Plavi kit",
    answerThree: "Slon",
    correctAnswer: "Plavi kit",
  },
  {
    id: 8,
    question: "Koji je najveći grad u Sjedinjenim Američkim Državama?",
    answerOne: "Los Angeles",
    answerTwo: "Chicago",
    answerThree: "Houston",
    correctAnswer: "New York City",
  },
  {
    id: 9,
    question: "Koji planet u Sunčevom sustavu ima najviše mjesece?",
    answerOne: "Saturn",
    answerTwo: "Jupiter",
    answerThree: "Mars",
    correctAnswer: "Jupiter",
  },
  {
    id: 10,
    question: "Koje godine je čovjek prvi put zakoračio na Mjesec?",
    answerOne: "1972",
    answerTwo: "1961",
    answerThree: "1975",
    correctAnswer: "1969",
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Question | {}>({});
  const isEffectExecutedRef = useRef(false);
  const [correct, setCorrect] = useState<number | null>(null);
  const [incorrect, setIncorrect] = useState<number | null>(null);

  console.log(currentAnswers);

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

      setCorrect(correctAnswerIndex);
      setIncorrect(incorrectAnswerIndex);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex) {
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
      timeout = setTimeout(() => {
        setCorrect(null);
        setIncorrect(null);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 2000);
    }
  }, [correct]);

  useEffect(() => {
    const initGame = () => {
      let answers = questions.map((question) => {
        return {
          answerOne: question.answerOne,
          answersTwo: question.answerTwo,
          answerThree: question.answerThree,
          answerFour: question.correctAnswer,
        };
      });

      setCurrentAnswers(answers[0]);
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  return (
    <section className="flex items-center h-[100vh] text-white">
      <div className="w-full max-w-4xl mx-2 md:mx-auto">
        <div className="relative flex justify-center py-4 text-center bg-blue-500 rounded-md">
          <p>
            {`${currentQuestionIndex + 1} )`}{" "}
            {questions[currentQuestionIndex].question}
          </p>
          <button
            onClick={() => dontKnowAnswerHandler()}
            className="absolute right-0 top-[-2.2rem] px-2 rounded-md py-1 bg-blue-500"
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
              onClick={() => checkCorrectHandler(value)}
              key={key}
              className="py-2 bg-blue-500 rounded-md"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quiz;
