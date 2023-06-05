import React, { useState } from "react";

const Skocko = () => {
  const [grid, setGrid] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  return (
    <section className="w-full flex flex-col justify-center h-[100vh]">
      {grid.map((row) => (
        <div className="grid grid-cols-5 space-x-1 mx-1">
          {row.map((col) => (
            <div className="border h-[5rem] mt-1 cursor-pointer"></div>
          ))}
          <div className="h-[5rem] mt-1 flex items-center justify-center">
            <div className="grid grid-cols-2 items-center justify-center">
              <div className="h-5 w-5 rounded-full border bg-red-500 mr-2"></div>
              <div className="h-5 w-5 rounded-full border bg-yellow-200"></div>
              <div className="h-5 w-5 rounded-full border mt-4"></div>
              <div className="h-5 w-5  rounded-full border mt-4"></div>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-6 space-x-1 m-1">
        {grid.map((figure) => (
          <div className="border h-[5rem] cursor-pointer"></div>
        ))}
      </div>
    </section>
  );
};

export default Skocko;
