import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import TypeAnswer from "../modals/TypeAnswer";

interface Association {
  id: number;
  first: string;
  second: string;
  third: string;
  fourth: string;
  answer: string;
  finalAnswer: string;
}

const Associations = () => {
  const [openTypeAnswer, setOpenTypeAnswer] = useState(false);
  const [currentAssociation, setCurrentAssociation] =
    useState<Association | null>(null);
  const [answer, setAnswer] = useState("");
  const [answeredCorrecty, setAnsweredCorrectly] = useState<number[]>([]);
  const [guessFinal, setGuessFinal] = useState(false);
  const [finalAnswerGuessed, setFinalAnswerGuessed] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const [ass, setAss] = useState<Association[]>([]);
  const isEffectExecutedRef = useRef(false);
  const [finalAnswer, setFinalAnswer] = useState("");

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

  useEffect(() => {
    const initGame = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/associations/getAssociations"
        );

        console.log(response.data);
        setFinalAnswer(response.data[0].finalAnswer);
        setAss(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

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
    <section className="flex flex-col items-center justify-center h-[100vh] text-white text-center font-bold">
      <span className="absolute text-black top-2">{seconds}</span>

      {ass.length > 0 && (
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
                  className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
              className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
                  className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
              className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
      )}

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
          className="flex items-center justify-center w-20 h-10 px-[4rem] my-10 bg-blue-600 rounded-md"
        >
          ?
        </div>
        <div
          style={
            finalAnswerGuessed
              ? { display: "flex", backgroundColor: "green" }
              : { display: "none" }
          }
          className="hidden px-5 py-2 my-10 bg-blue-600 "
        >
          {finalAnswer}
        </div>
      </div>

      {ass.length > 0 && (
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
                  className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
              className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
                  className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
              className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-600 border-2 border-white cursor-pointer rounded-md"
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
      )}

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

export default Associations;
