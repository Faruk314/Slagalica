import React, { useEffect, useState } from "react";
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
  const [seconds, setSeconds] = useState(5);

  console.log(currentAssociation);
  console.log(answeredCorrecty);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      console.log("You run out of time");
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [seconds]);

  const finalAnswer = "NOVAK";

  let ass: Association[] = [
    {
      first: "BREJ",
      second: "MREZA",
      third: "VIMBLDON",
      fourth: "REKET",
      answer: "TENIS",
    },
    {
      first: "DRZAVA",
      second: "SLJIVA",
      third: ".RS",
      fourth: "BEOGRAD",
      answer: "SRBIJA",
    },
    {
      first: "LIGA",
      second: "PRVAK",
      third: "POBEDNIK",
      fourth: "AS",
      answer: "SAMPION",
    },
    {
      first: "SUMADIJA",
      second: "FIAT",
      third: "ZASTAVA",
      fourth: "GRAD",
      answer: "KRAGUJEVAC",
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
      <span className="absolute text-black top-2">{seconds}</span>
      <div className="flex space-x-10">
        <div>
          {Object.entries(ass[0])
            .slice(0, 4)
            .map(([key, value]) => (
              <div
                style={
                  answeredCorrecty.includes(0)
                    ? { backgroundColor: "green" }
                    : {}
                }
                onClick={handleClick}
                key={key}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={
                    answeredCorrecty.includes(0) ? { display: "block" } : {}
                  }
                  className="hidden"
                >
                  {value}
                </span>
                <span
                  style={
                    answeredCorrecty.includes(0) ? { display: "none" } : {}
                  }
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty.includes(0) ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty.includes(0)) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[0]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty.includes(0) ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[0].answer}
            </span>
            <span
              style={answeredCorrecty.includes(0) ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>

        <div>
          {Object.entries(ass[1])
            .slice(0, 4)
            .map(([key, value]) => (
              <div
                style={
                  answeredCorrecty.includes(1)
                    ? { backgroundColor: "green" }
                    : {}
                }
                onClick={handleClick}
                key={key}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={
                    answeredCorrecty.includes(1) ? { display: "block" } : {}
                  }
                  className="hidden"
                >
                  {value}
                </span>
                <span
                  style={
                    answeredCorrecty.includes(1) ? { display: "none" } : {}
                  }
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty.includes(1) ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty.includes(1)) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[1]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty.includes(1) ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[1].answer}
            </span>
            <span
              style={answeredCorrecty.includes(1) ? { display: "none" } : {}}
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
          {Object.entries(ass[2])
            .slice(0, 4)
            .map(([key, value]) => (
              <div
                style={
                  answeredCorrecty.includes(2)
                    ? { backgroundColor: "green" }
                    : {}
                }
                onClick={handleClick}
                key={key}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={
                    answeredCorrecty.includes(2) ? { display: "block" } : {}
                  }
                  className="hidden"
                >
                  {value}
                </span>
                <span
                  style={
                    answeredCorrecty.includes(2) ? { display: "none" } : {}
                  }
                  className=""
                >
                  ?
                </span>
              </div>
            ))}

          <div
            style={
              answeredCorrecty.includes(2) ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty.includes(2)) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[2]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty.includes(2) ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[2].answer}
            </span>
            <span
              style={answeredCorrecty.includes(2) ? { display: "none" } : {}}
              className=""
            >
              Answer
            </span>
          </div>
        </div>

        <div>
          {Object.entries(ass[3])
            .slice(0, 4)
            .map(([key, value]) => (
              <div
                style={
                  answeredCorrecty.includes(3)
                    ? { backgroundColor: "green" }
                    : {}
                }
                onClick={handleClick}
                key={key}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span
                  style={
                    answeredCorrecty.includes(3) ? { display: "block" } : {}
                  }
                  className="hidden"
                >
                  {value}
                </span>
                <span
                  style={
                    answeredCorrecty.includes(3) ? { display: "none" } : {}
                  }
                  className=""
                >
                  ?
                </span>
              </div>
            ))}
          <div
            style={
              answeredCorrecty.includes(3) ? { backgroundColor: "green" } : {}
            }
            onClick={() => {
              if (answeredCorrecty.includes(3)) return;
              setOpenTypeAnswer(true);
              setCurrentAssociation(ass[3]);
            }}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span
              style={answeredCorrecty.includes(3) ? { display: "block" } : {}}
              className="hidden"
            >
              {ass[3].answer}
            </span>
            <span
              style={answeredCorrecty.includes(3) ? { display: "none" } : {}}
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
