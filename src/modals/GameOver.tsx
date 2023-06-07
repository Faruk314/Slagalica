import React from "react";

interface Props {
  setOpenGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  winCombination: string[];
  gameState: string;
}

const GameOver = ({ setOpenGameOver, winCombination, gameState }: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center p-2 mx-2 bg-white rounded-md">
        <h2 className="text-xl text-center">
          {gameState === "win"
            ? " Congratulations you found the winning combination!"
            : "Unfortunately, you did not find the required combination"}
        </h2>

        <div className="grid items-center grid-cols-4 py-5 space-x-1">
          {winCombination.map((simbol, index) => (
            <img key={index} alt="" src={simbol} className="h-[3rem]" />
          ))}
        </div>

        <button
          onClick={() => setOpenGameOver(false)}
          className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Continiue
        </button>
      </div>
    </div>
  );
};

export default GameOver;
