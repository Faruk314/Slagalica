import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import GameOver from "../modals/GameOver";

const Mastermind = () => {
  const [grid, setGrid] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);
  const simbols = [
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
  const [seconds, setSeconds] = useState(90);
  const {
    updateScore,
    gameStates,
    updateGameState,
    updateGame,
    playerScore,
    gameId,
  } = useContext(GameContext);

  const [gameStateFetched, setGameStateFetched] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const { socket } = useContext(SocketContext);
  const isEffectExecutedRef = useRef(false);

  console.log(winCombination);

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getGameState/mastermind"
        );

        console.log(response.data);

        updateGameState("mastermind", response.data.gameState);
        setGrid(response.data.grid);
        setWinCombination(response.data.winCombination);
        setRowsChecked(response.data.rowsChecked);
        setHints(response.data.hints);
        setSeconds(response.data.seconds);
        setGameStateFetched(true);
        setGameStartTime(response.data.seconds);
        const currentTime = Math.floor(Date.now() / 1000);
        const gameStartTime = response.data.seconds;
        const timeLeft = 60 - (currentTime - gameStartTime);
        setSeconds(timeLeft);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, [updateGameState, gameStateFetched]);

  console.log(winCombination);

  useEffect(() => {
    const gameState = {
      grid,
      winCombination,
      rowsChecked,
      hints,
      seconds: gameStartTime,
      gameState: gameStates.mastermind,
      score: playerScore.mastermind,
    };

    if (gameStateFetched) {
      updateGame(gameState, "mastermind");
    }
  }, [
    grid,
    hints,
    rowsChecked,
    winCombination,
    gameStates.mastermind,
    playerScore.mastermind,
    updateGame,
    gameStartTime,
    gameStateFetched,
  ]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (gameStates.mastermind !== "playing") {
      return clearInterval(countdown);
    }

    if (seconds === 0 && gameStates.mastermind === "playing") {
      updateGameState("mastermind", "lose");
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "mastermind",
          score: 0,
        });
      }
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [seconds, gameStates.mastermind, gameId, socket, updateGameState]);

  const checkGameStatus = (currentHints: string[]) => {
    let count = 0;

    for (let i = 0; i < currentHints.length; i++) {
      if (currentHints[i] === "red") {
        count++;
      }
    }

    if (count === 4) {
      updateGameState("mastermind", "win");
      updateScore("mastermind", 30);
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "mastermind",
          score: 30,
        });
      }
      return;
    }

    if ([...hints, currentHints].length === 6) {
      updateGameState("mastermind", "lose");
      if (gameId !== "" && socket) {
        socket.emit("updateGameState", {
          gameId,
          gameName: "mastermind",
          score: 0,
        });
      }
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

  return (
    <section className="w-full flex flex-col justify-center h-[100vh] max-w-3xl mx-auto">
      {gameStateFetched && (
        <span className="absolute text-2xl top-2 left-2">{seconds}</span>
      )}
      {gameStateFetched &&
        grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 mx-1 space-x-1">
            {row.map((col, colIndex) => (
              <div
                onClick={() => {
                  if (col !== "" && !rowsChecked.includes(rowIndex)) {
                    handleSimbolDelete(rowIndex, colIndex);
                  }
                }}
                key={colIndex}
                className="bg-blue-600 rounded-md flex items-center justify-center h-[5rem] md:h-[6rem] mt-1 cursor-pointer"
              >
                {col !== "" && (
                  <img src={col} alt="" className="w-10 h-10 md:h-15 md:w-15" />
                )}
              </div>
            ))}
            {!row.includes("") && !rowsChecked.includes(rowIndex) && (
              <div
                onClick={() => checkCombinationHandler(row, rowIndex)}
                className="flex items-center justify-center mt-1 font-bold text-white bg-blue-600 rounded-md cursor-pointer"
              >
                <span className="text-3xl">?</span>
              </div>
            )}

            {rowsChecked.includes(rowIndex) && (
              <div className="h-[5rem]  mt-1 flex items-center justify-center">
                <div className="grid items-center justify-center grid-cols-2">
                  {grid[0].map((item, index) => (
                    <div
                      style={{ backgroundColor: hints[rowIndex][index] }}
                      key={index}
                      className="w-5 h-5 my-2 mr-2 border border-black rounded-full md:h-7 md:w-7"
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

      <div className="grid grid-cols-6 m-1 space-x-1">
        {simbols.map((simbol, index) => (
          <div
            onClick={() => {
              handlePlayerMove(simbol);
            }}
            key={index}
            className="bg-blue-600 rounded-md flex items-center justify-center h-[5rem] md:h-[6rem] cursor-pointer"
          >
            <img src={simbol} alt="" className="w-10 h-10" />
          </div>
        ))}
      </div>

      {gameStates &&
        gameStateFetched &&
        gameStates.mastermind !== "playing" && (
          <GameOver
            winCombination={winCombination}
            gameState={gameStates.mastermind}
          />
        )}
    </section>
  );
};

export default Mastermind;
