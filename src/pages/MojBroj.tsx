import React, { useState } from "react";

const MojBroj = () => {
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const operands = ["(", ")", "+", "-", "*", ":"];

  return (
    <section className="flex items-center h-[100vh]">
      <div className="flex flex-col w-full max-w-4xl mx-auto space-y-5">
        <div className="mx-2">
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((number) => (
              <div key={number} className="h-[5rem] border"></div>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-1 mt-2">
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <button
                key={number}
                className="flex items-center justify-center h-10 border"
              >
                1
              </button>
            ))}
          </div>
        </div>

        <div className="grid justify-center grid-cols-3 mx-2 space-x-2">
          <div className="flex flex-col col-span-2 space-y-1 text-center">
            <div className="h-6 border"></div>
            <div className="h-6 border"></div>
          </div>

          <button className="border"></button>
        </div>

        <div className="mx-2">
          <div className="grid grid-cols-2 gap-1">
            {operands.map((operand, index) => (
              <button
                key={index}
                className="flex items-center justify-center text-xl border"
              >
                <span>{operand}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center mt-5 border">
            <span>200</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MojBroj;
