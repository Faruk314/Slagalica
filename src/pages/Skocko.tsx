import React, { useEffect, useState } from "react";

const Skocko = () => {
  const [grid, setGrid] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);
  const simbols: string[] = [
    "/images/skocko.png",
    "/images/club.png",
    "/images/spades.png",
    "/images/heart.png",
    "/images/diamond.png",
    "/images/star.png",
  ];
  const [winCombination, setWinCombination] = useState<string[]>([]);

  const handleSimbolDelete = (row: number, col: number) => {
    console.log(row, col);
    let newGrid = [...grid];
    newGrid[row][col] = "";

    setGrid(newGrid);
  };

  const handlePlayerMove = (simbol: string) => {
    let newGrid = [...grid];

    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        if (
          newGrid[row][col] !== "" &&
          newGrid[row][col + 1] !== "" &&
          newGrid[row][col + 2] !== "" &&
          newGrid[row][col + 3] !== ""
        )
          return;
        if (newGrid[row][col] === "") {
          newGrid[row][col] = simbol;
          setGrid(newGrid);
          return;
        }
      }
    }
  };

  useEffect(() => {
    const initGame = () => {
      //generating win combination by shuffling simbols array and taking first 4 simbols
      const randomCombination: string[] = simbols
        .sort((a, b) => 0.5 - Math.random())
        .slice(0, 4);

      setWinCombination(randomCombination);
    };

    initGame();
  }, []);

  return (
    <section className="w-full flex flex-col justify-center h-[100vh] max-w-5xl mx-auto">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 space-x-1 mx-1">
          {row.map((col, colIndex) => (
            <div
              onClick={() => {
                if (col !== "") {
                  handleSimbolDelete(rowIndex, colIndex);
                }
              }}
              key={colIndex}
              className="border flex items-center justify-center h-[5rem] md:h-[7rem] lg:h-[8rem] mt-1 cursor-pointer"
            >
              {col !== "" && (
                <img src={col} alt="" className="w-10 h-10 md:h-15 md:w-15" />
              )}
            </div>
          ))}
          <div className="h-[5rem] mt-1 flex items-center justify-center">
            <div className="grid grid-cols-2 items-center justify-center">
              <div className="h-5 w-5 md:h-7 md:w-7 rounded-full border mr-2"></div>
              <div className="h-5 w-5 md:h-7 md:w-7 rounded-full border"></div>
              <div className="h-5 w-5 md:h-7 md:w-7 rounded-full border mt-4"></div>
              <div className="h-5 w-5 md:h-7 md:w-7 rounded-full border mt-4"></div>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-6 space-x-1 m-1">
        {simbols.map((simbol, index) => (
          <div
            onClick={() => handlePlayerMove(simbol)}
            key={index}
            className="border flex items-center justify-center h-[5rem] md:h-[8rem] cursor-pointer"
          >
            <img src={simbol} alt="" className="w-10 h-10 md:h-15 md:w-15" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skocko;
