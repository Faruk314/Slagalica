import React from "react";

interface Props {
  setOpenTypeAnswer: React.Dispatch<React.SetStateAction<boolean>>;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  checkCorrectHandler: () => void;
  guessFinal: boolean;
}

const TypeAnswer = ({
  setOpenTypeAnswer,
  setAnswer,
  checkCorrectHandler,
  guessFinal,
}: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center p-2 mx-2 text-black bg-white rounded-md">
        <h2>{!guessFinal ? "Type your answer" : "Type your final answer"}</h2>

        <textarea
          onChange={(e) => setAnswer(e.target.value)}
          className="p-1 my-1 border"
          rows={1}
        />

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOpenTypeAnswer(false)}
            className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            Back
          </button>
          <button
            onClick={checkCorrectHandler}
            className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeAnswer;
