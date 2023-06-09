import React, { useEffect, useState } from "react";

const MojBroj = () => {
  const [chars, setChars] = useState<Array<string | number>>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const operands = ["(", ")", "+", "-", "*", ":"];

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

  useEffect(() => {
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

      setTargetNumber(randomTargetNumber);
      setRandomNumbers(randomNumbers);
    };

    initGame();
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
