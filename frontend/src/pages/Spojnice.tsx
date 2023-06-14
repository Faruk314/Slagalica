import React, { useEffect, useState } from "react";

interface Spojnica {
  id: number;
  question?: string;
  answer?: string;
}

const Spojnice = () => {
  const [gameOver, setGameOver] = useState(false);
  const [leftSide, setLeftSide] = useState<Spojnica[]>([]);
  const [rightSide, setRightSide] = useState<Spojnica[]>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [corrects, setCorrects] = useState<number[]>([]);
  const [incorrects, setIncorrects] = useState<number[]>([]);
  const [leftClickedIndex, setLeftClickedIndex] = useState<number | null>(null);
  const [rightClickedIndex, setRightClickedIndex] = useState<number | null>(
    null
  );

  const handleLeftSideClick = (id: number) => {
    setLeftClickedIndex(id);
  };

  const handleRightSideClick = (id: number) => {
    setRightClickedIndex(id);
  };

  useEffect(() => {
    const checkGameStatus = () => {
      if (totalAnswered === 8) {
        setRightSide((prev) => prev.sort((a, b) => a.id - b.id));
        setLeftSide((prev) => prev.sort((a, b) => a.id - b.id));
        setGameOver(true);
      }
    };

    checkGameStatus();
  }, [totalAnswered]);

  useEffect(() => {
    const checkCorrect = () => {
      if (rightClickedIndex && rightClickedIndex === leftClickedIndex) {
        setCorrects((prev) => [...prev, rightClickedIndex]);
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
    const initGame = () => {
      let data = [
        {
          id: 1,
          question: "JACK DANIELS",
          answer: "VISKI",
        },
        {
          id: 2,
          question: "TUBORG",
          answer: "PIVO",
        },
        {
          id: 3,
          question: "SMIRNOFF",
          answer: "VOTKA",
        },
        {
          id: 4,
          question: "BACARDI",
          answer: "RUM",
        },
        {
          id: 5,
          question: "GORDONS",
          answer: "DZIN",
        },
        {
          id: 6,
          question: "TWO FINGERS",
          answer: "TEKILA",
        },
        {
          id: 7,
          question: "SHERIDIANS",
          answer: "LIKER",
        },
        {
          id: 8,
          question: "MARTELL",
          answer: "KONJAK",
        },
      ];

      const leftSideData = data.map((object) => {
        return {
          id: object.id,
          question: object.question,
        };
      });

      const rightSideData = data.map((object) => {
        return {
          id: object.id,
          answer: object.answer,
        };
      });

      setLeftSide(leftSideData.sort((a, b) => Math.random() - 0.5));
      setRightSide(rightSideData.sort((a, b) => Math.random() - 0.5));
    };

    initGame();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh] font-bold">
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
              className="h-10 bg-blue-600 rounded-md border w-[10rem] block focus:bg-blue-500"
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
                  : incorrects.includes(item.id) && gameOver
                  ? { backgroundColor: "red" }
                  : {}
              }
              onClick={() => {
                if (leftClickedIndex) {
                  handleRightSideClick(item.id);
                }
              }}
              key={item.id}
              className="h-10 bg-blue-600 rounded-md border w-[10rem] block"
            >
              <span className="">{item.answer}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Spojnice;
