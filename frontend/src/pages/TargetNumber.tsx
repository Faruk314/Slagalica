import React, { useEffect, useState, useRef, useContext } from "react";
import { Parser } from "expr-eval";
import { GameContext } from "../context/GameContext";
import TargetNumberModal from "../modals/TargetNumberModal";

const TargetNumber = () => {
  const [chars, setChars] = useState<Array<string | number>>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const operands = ["(", ")", "+", "-", "*", "/"];
  const isEffectExecutedRef = useRef(false);
  const [usedNumbersIndexes, setUsedNumbersIndexes] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const { updateScore } = useContext(GameContext);

  const submitHandler = () => {
    const parser = new Parser();
    const resultString = chars.join(" ");

    try {
      const result = parser.evaluate(resultString);
      console.log("Result:", result);

      const difference = targetNumber - result;

      if (difference === 0) {
        updateScore("targetNumber", 30);
      }

      if (difference === 1) {
        updateScore("targetNumber", 20);
      }

      if (difference > 1 && difference <= 5) {
        updateScore("targetNumber", 10);
      }

      setResult(result);
    } catch (error) {
      console.error("Invalid expression:", error);
      setResult(0);
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
    function findTargetNumber(
      randomTargetNumber: number,
      randomNumbers: number[]
    ): number {
      const target = randomTargetNumber;
      const numbers = randomNumbers;

      let closestNumber = Infinity;
      let closestDifference = Infinity;

      const generateExpressions = (
        currentNumber: number,
        currentIndex: number
      ) => {
        if (currentIndex === numbers.length) {
          const difference = Math.abs(currentNumber - target);
          if (difference < closestDifference) {
            closestDifference = difference;
            closestNumber = currentNumber;
          }
          return;
        }

        const nextNumber = numbers[currentIndex];

        generateExpressions(currentNumber + nextNumber, currentIndex + 1);
        generateExpressions(currentNumber - nextNumber, currentIndex + 1);
        generateExpressions(currentNumber * nextNumber, currentIndex + 1);
        if (nextNumber !== 0 && currentNumber % nextNumber === 0) {
          generateExpressions(currentNumber / nextNumber, currentIndex + 1);
        }
      };

      generateExpressions(0, 0);

      return closestNumber !== Infinity ? closestNumber : -1;
    }

    const initGame = () => {
      let randomNumbers: number[] = [];
      let nums = [10, 25, 50, 75, 100, 20];

      let randomTargetNumber: number;
      let expression: number;

      while (true) {
        randomNumbers = [];
        nums = [10, 25, 50, 75, 100, 20];

        for (let i = 0; i < 6; i++) {
          let randomNum;

          if (i < 4) {
            randomNum = Math.floor(Math.random() * 9) + 1;
            randomNumbers.push(randomNum);
          } else {
            randomNum = Math.floor(Math.random() * nums.length);
            let randomSplice = nums.splice(randomNum, 1);
            randomNumbers.push(...randomSplice);
          }
        }

        randomTargetNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
        expression = findTargetNumber(randomTargetNumber, randomNumbers);

        if (expression === randomTargetNumber) {
          break;
        }
      }

      setTargetNumber(expression);
      setRandomNumbers(randomNumbers);
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  return (
    <section className="flex items-center h-[100vh] text-white font-bold">
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

      {result && (
        <TargetNumberModal
          computerNumber={targetNumber}
          playerNumber={result}
        />
      )}
    </section>
  );
};

export default TargetNumber;
