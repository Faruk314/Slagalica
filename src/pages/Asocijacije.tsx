import React, { useState } from "react";
import TypeAnswer from "../modals/TypeAnswer";

interface Association {
  first: string;
  second: string;
  third: string;
  fourth: string;
  answer: string;
}

const Asocijacije = () => {
  const [openTypeAnswer, setOpenTypeAnswer] = useState(false);
  const [currentAssociation, setCurrentAssociation] =
    useState<Association | null>(null);
  const [answer, setAnswer] = useState("");
  const [answeredCorrecty, setAnsweredCorrectly] = useState<number[]>([]);
  const [guessFinal, setGuessFinal] = useState(false);
  const [finalAnswerGuessed, setFinalAnswerGuessed] = useState(false);

  console.log(currentAssociation);
  console.log(answeredCorrecty);

  const finalAnswer = "test5";

  let ass: Association[] = [
    {
      first: "test1",
      second: "test1",
      third: "test1",
      fourth: "test1",
      answer: "test1",
    },
    {
      first: "test2",
      second: "test2",
      third: "test2",
      fourth: "test2",
      answer: "test2",
    },
    {
      first: "test3",
      second: "test3",
      third: "test3",
      fourth: "test3",
      answer: "test3",
    },
    {
      first: "test4",
      second: "test4",
      third: "test4",
      fourth: "test4",
      answer: "test4",
    },
  ];

  const checkCorrectHandler = () => {
    if (guessFinal && answer === finalAnswer) {
      setAnsweredCorrectly([0, 1, 2, 3]);
      setFinalAnswerGuessed(true);
      setOpenTypeAnswer(false);
      return;
    }

    if (answer === currentAssociation?.answer) {
      const currentAssociationIndex = ass.findIndex(
        (associaton) =>
          JSON.stringify(associaton) === JSON.stringify(currentAssociation)
      );

      setAnsweredCorrectly((prev) => [...prev, currentAssociationIndex]);
      setOpenTypeAnswer(false);
    }
  };

  const handleClick = (e: any) => {
    const firstChild = e.target.firstChild;
    const lastChild = e.target.lastChild;

    if (
      firstChild &&
      firstChild.classList &&
      firstChild.classList.contains("hidden")
    ) {
      firstChild.classList.remove("hidden");
    }

    if (lastChild && lastChild.classList) {
      lastChild.classList.add("hidden");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] text-white text-center">
      <div className="flex space-x-10">
        <div>
          {Object.keys(ass[0])
            .slice(0, 4)
            .map((association) => (
              <div
                style={
                  answeredCorrecty[0] === 0 ? { backgroundColor: "green" } : {}
                }
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={answeredCorrecty[0] === 0 ? { display: "block" } : {}}
                  className="hidden"
                >
                  {association}
                </span>
                <span
                  style={answeredCorrecty[0] === 0 ? { display: "none" } : {}}
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty[0] === 0 ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty[0] === 0) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[0]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty[0] === 0 ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[0].answer}
            </span>
            <span
              style={answeredCorrecty[0] === 0 ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>

        <div>
          {Object.keys(ass[1])
            .slice(0, 4)
            .map((association) => (
              <div
                style={
                  answeredCorrecty[1] === 1 ? { backgroundColor: "green" } : {}
                }
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={answeredCorrecty[1] === 1 ? { display: "block" } : {}}
                  className="hidden"
                >
                  {association}
                </span>
                <span
                  style={answeredCorrecty[1] === 1 ? { display: "none" } : {}}
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty[1] === 1 ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty[1] === 1) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[1]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty[1] === 1 ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[1].answer}
            </span>
            <span
              style={answeredCorrecty[1] === 1 ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          if (answeredCorrecty.length > 0 && !finalAnswerGuessed) {
            setOpenTypeAnswer(true);
            setGuessFinal(true);
          }
        }}
        className="cursor-pointer"
      >
        <div
          style={
            !finalAnswerGuessed ? { display: "flex" } : { display: "none" }
          }
          className="flex items-center justify-center w-20 h-10 px-[4rem] my-10 bg-blue-500"
        >
          ?
        </div>
        <div
          style={
            finalAnswerGuessed
              ? { display: "flex", backgroundColor: "green" }
              : { display: "none" }
          }
          className="hidden px-5 py-2 my-10 bg-blue-500 "
        >
          {finalAnswer}
        </div>
      </div>

      <div className="flex space-x-10 text-center">
        <div>
          {Object.keys(ass[2])
            .slice(0, 4)
            .map((association) => (
              <div
                style={
                  answeredCorrecty[2] === 2 ? { backgroundColor: "green" } : {}
                }
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={answeredCorrecty[2] === 2 ? { display: "block" } : {}}
                  className="hidden"
                >
                  {association}
                </span>
                <span
                  style={answeredCorrecty[2] === 2 ? { display: "none" } : {}}
                  className=""
                >
                  ?
                </span>
              </div>
            ))}

          <div
            style={
              answeredCorrecty[2] === 2 ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty[2] === 2) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[2]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty[2] === 2 ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[2].answer}
            </span>
            <span
              style={answeredCorrecty[2] === 2 ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>

        <div>
          {Object.keys(ass[3])
            .slice(0, 4)
            .map((association) => (
              <div
                style={
                  answeredCorrecty[3] === 3 ? { backgroundColor: "green" } : {}
                }
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={answeredCorrecty[3] === 3 ? { display: "block" } : {}}
                  className="hidden"
                >
                  {association}
                </span>
                <span
                  style={answeredCorrecty[3] === 3 ? { display: "none" } : {}}
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty[3] === 3 ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty[3] === 3) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[3]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty[3] === 3 ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[3].answer}
            </span>
            <span
              style={answeredCorrecty[3] === 3 ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>
      </div>

      {openTypeAnswer && (
        <TypeAnswer
          guessFinal={guessFinal}
          setOpenTypeAnswer={setOpenTypeAnswer}
          setAnswer={setAnswer}
          checkCorrectHandler={checkCorrectHandler}
        />
      )}
    </section>
  );
};

export default Asocijacije;
