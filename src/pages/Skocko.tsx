import React, { useEffect, useState } from "react";
import GameOver from "../modals/GameOver";

const Skocko = () => {
  const [gameState, setGameState] = useState("playing");
  const [openGameOver, setOpenGameOver] = useState(false);
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
    "/images/skocko.png",
    "/images/club.png",
    "/images/spades.png",
    "/images/heart.png",
    "/images/diamond.png",
    "/images/star.png",
    "/images/skocko.png",
    "/images/club.png",
    "/images/spades.png",
    "/images/heart.png",
    "/images/diamond.png",
    "/images/star.png",
    "/images/skocko.png",
    "/images/club.png",
    "/images/spades.png",
    "/images/heart.png",
    "/images/diamond.png",
    "/images/star.png",
  ];
  const [winCombination, setWinCombination] = useState<string[]>([]);
  const [rowsChecked, setRowsChecked] = useState<number[]>([]);
  const [hints, setHints] = useState<string[][]>([]);

  console.log(winCombination);

  const checkGameStatus = (currentHints: string[]) => {
    let count = 0;

    console.log(hints);

    for (let i = 0; i < currentHints.length; i++) {
      if (currentHints[i] === "red") {
        count++;
      }
    }

    console.log("count", count);

    if (count === 4) {
      setGameState("win");
      setOpenGameOver(true);
    }

    if (hints.length === 5) {
      setGameState("lose");
      setOpenGameOver(true);
    }
  };

  const checkCombinationHandler = (
    playerCombination: string[],
    rowIndex: number
  ) => {
    let rowsCheckedCopy = [...rowsChecked, rowIndex];

    setRowsChecked(rowsCheckedCopy);

    let hints: string[] = [];
    let winCombinationCopy = [...winCombination];
    let playerCombinationCopy = [...playerCombination];

    //chech for match
    for (let i = 0; i < winCombination.length; i++) {
      if (winCombination[i] === playerCombination[i]) {
        hints.push("red");

        let index = winCombinationCopy.findIndex(
          (simbol) => simbol === playerCombination[i]
        );

        let indexTwo = playerCombinationCopy.findIndex(
          (simbol) => simbol === playerCombination[i]
        );

        winCombinationCopy.splice(index, 1);
        playerCombinationCopy.splice(indexTwo, 1);
      }
    }

    for (let i = 0; i < playerCombinationCopy.length; i++) {
      if (winCombinationCopy.includes(playerCombinationCopy[i])) {
        let index = winCombinationCopy.findIndex(
          (simbol) => simbol === playerCombinationCopy[i]
        );

        hints.push("yellow");

        winCombinationCopy.splice(index, 1);
      }
    }

    setHints((prev) => [...prev, hints]);

    checkGameStatus(hints);
  };

  const handleSimbolDelete = (row: number, col: number) => {
    let newGrid = [...grid];
    newGrid[row][col] = "";

    setGrid(newGrid);
  };

  const handlePlayerMove = (simbol: string) => {
    let newGrid = [...grid];

    for (let row = 0; row < newGrid.length; row++) {
      if (!newGrid[row].includes("") && !rowsChecked.includes(row)) return;

      for (let col = 0; col < newGrid[row].length; col++) {
        if (newGrid[row][col] === "") {
          newGrid[row][col] = simbol;
          setGrid(newGrid);
          return;
        }
      }
    }
  };

  // ["/images/spades.png",
  // "/images/skocko.png",
  // "/images/star.png",
  // "/images/club.png",]

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
        <div key={rowIndex} className="grid grid-cols-5 mx-1 space-x-1">
          {row.map((col, colIndex) => (
            <div
              onClick={() => {
                if (col !== "" && !rowsChecked.includes(rowIndex)) {
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
          {!row.includes("") && !rowsChecked.includes(rowIndex) && (
            <div
              onClick={() => checkCombinationHandler(row, rowIndex)}
              className="flex items-center justify-center mt-1 border cursor-pointer"
            >
              <span className="text-3xl">?</span>
            </div>
          )}

          {rowsChecked.includes(rowIndex) && (
            <div className="h-[5rem] md:h-[7rem] lg:h-[8rem] mt-1 flex items-center justify-center">
              <div className="grid items-center justify-center grid-cols-2">
                {grid[0].map((item, index) => (
                  <div
                    style={{ backgroundColor: hints[rowIndex][index] }}
                    key={index}
                    className="w-5 h-5 my-2 mr-2 border rounded-full md:h-7 md:w-7"
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="grid grid-cols-6 m-1 space-x-1">
        {simbols.slice(0, 6).map((simbol, index) => (
          <div
            onClick={() => gameState === "playing" && handlePlayerMove(simbol)}
            key={index}
            className="border flex items-center justify-center h-[5rem] md:h-[8rem] cursor-pointer"
          >
            <img src={simbol} alt="" className="w-10 h-10 md:h-15 md:w-15" />
          </div>
        ))}
      </div>

      {openGameOver && (
        <GameOver
          winCombination={winCombination}
          setOpenGameOver={setOpenGameOver}
          gameState={gameState}
        />
      )}
    </section>
  );
};

export default Skocko;
