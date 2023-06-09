import React, { useEffect, useState, useRef } from "react";

type Operation = number | "+" | "-" | "*" | "/";
interface Solution {
  expression: string;
  value: number;
  difference: number;
}

const MojBroj = () => {
  const [chars, setChars] = useState<Array<string | number>>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const operands = ["(", ")", "+", "-", "*", "/"];
  const isEffectExecutedRef = useRef(false);
  const [computerSolution, setComputerSolution] = useState<string>("");
  const [computerNumber, setComputerNumber] = useState(0);
  const [diffrence, setDiffrence] = useState(0);

  const deleteCharHandler = () => {
    let charsCopy = [...chars];

    charsCopy.splice(charsCopy.length - 1, 1);

    console.log(charsCopy);

    setChars(charsCopy);
  };

  const handleClick = (char: number | string) => {
    let updatedChars = [...chars, char];

    setChars(updatedChars);
  };

  function generateOperations(length: number): Operation[][] {
    const operations: Operation[][] = [];

    const backtrack = (current: Operation[], index: number): void => {
      if (index === length) {
        operations.push(current);
        return;
      }

      const num = index + 1;

      backtrack([...current, num], index + 1);
      backtrack([...current, "+"], index + 1);
      backtrack([...current, "-"], index + 1);
      backtrack([...current, "*"], index + 1);
      backtrack([...current, "/"], index + 1);
    };

    backtrack([], 0);

    return operations;
  }

  function buildExpression(numbers: number[], operation: Operation[]): string {
    if (numbers.length !== operation.length + 1) {
      throw new Error("Invalid numbers and operations length");
    }

    let expression = numbers[0].toString();

    for (let i = 0; i < operation.length; i++) {
      if (typeof operation[i] === "number") {
        expression += operation[i] < 0 ? operation[i] : `+${operation[i]}`;
      } else {
        expression += ` ${operation[i]}`;
      }

      expression += numbers[i + 1].toString();
    }

    return expression;
  }

  function evaluateExpression(expression: string): number | null {
    try {
      return eval(expression);
    } catch (error) {
      return null;
    }
  }

  function isInteger(value: number): boolean {
    return Number.isInteger(value);
  }

  useEffect(() => {
    function solveNumberPuzzle(
      numbers: number[],
      target: number
    ): Solution | null {
      const operations: Operation[][] = generateOperations(numbers.length - 1);

      let closestSolution: Solution | null = null;
      let closestDifference = Infinity;

      for (const operation of operations) {
        const expression = buildExpression(numbers, operation);
        const value: any = evaluateExpression(expression);

        if (isInteger(value)) {
          const difference = Math.abs(value - target);
          if (difference < closestDifference) {
            closestSolution = {
              expression,
              value,
              difference,
            };
            closestDifference = difference;
          }
        }
      }

      return closestSolution;
    }

    const initGame = () => {
      let randomNumbers: number[] = [];
      let nums = [10, 25, 50, 75, 100, 20];

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

      let randomTargetNumber = Math.floor(
        Math.random() * (999 - 100 + 1) + 100
      );

      const solution = solveNumberPuzzle(randomNumbers, randomTargetNumber);
      if (solution !== null) {
        setComputerSolution(solution.expression);
        setComputerNumber(solution.value);
        setDiffrence(solution.difference);
        console.log("Solution found:", solution.expression);
        console.log("Value:", solution.value);
        console.log("Difference:", solution.difference);
      } else {
        console.log("No solution found.");
      }

      setTargetNumber(randomTargetNumber);
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
          <div className="h-[3rem] bg-blue-500 w-[10rem] mx-auto flex justify-center items-center rounded-md">
            <span className="text-2xl"> {targetNumber}</span>
          </div>

          <div className="grid grid-cols-6 gap-1 mt-2 rounded-md">
            {randomNumbers.map((number, index) => (
              <button
                onClick={() => handleClick(number)}
                key={index}
                className="flex items-center justify-center h-10 bg-blue-500 rounded-md"
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-black h-[2rem] rounded-md mx-2 text-black flex justify-center items-center">
          {chars.map((char) => (
            <span>{char}</span>
          ))}
        </div>

        <div className="mx-2">
          <div className="grid grid-cols-6 gap-1">
            {operands.map((operand, index) => (
              <button
                onClick={() => handleClick(operand)}
                key={index}
                className="flex items-center justify-center text-xl bg-blue-500 border rounded-md"
              >
                <span>{operand}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center mt-5 space-y-2 text-black">
            <h3>Result</h3>
            <div className="w-[10rem] border border-black rounded-md h-[3rem]"></div>

            <button
              onClick={deleteCharHandler}
              className="px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-400"
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MojBroj;
