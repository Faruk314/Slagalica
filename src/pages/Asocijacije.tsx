import React, { useState } from "react";

interface Association {
  first: string;
  second: string;
  third: string;
  fourth: string;
  answer: string;
}

const Asocijacije = () => {
  const [openTypeAnswer, setOpenTypeAnswer] = useState(false);
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

  const checkCorrectHandler = (association: Association) => {
    setOpenTypeAnswer(true);
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
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span className="hidden">{association}</span>
                <span className="">?</span>
              </div>
            ))}
          <div
            onClick={() => checkCorrectHandler(ass[0])}
            className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
          >
            <span className="hidden">{ass[0].answer}</span>
            <span className="">Answer</span>
          </div>
        </div>

        <div>
          {Object.keys(ass[1])
            .slice(0, 4)
            .map((association) => (
              <div
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span className="hidden">{association}</span>
                <span className="">?</span>
              </div>
            ))}
          <div className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer">
            <span className="hidden">{ass[1].answer}</span>
            <span className="">Answer</span>
          </div>
        </div>
      </div>

      <div className="cursor-pointer">
        <div className="flex items-center justify-center w-20 h-10 px-[4rem] my-10 bg-blue-500">
          ?
        </div>
        <div className="hidden px-5 py-2 my-10 bg-blue-500 ">FEFEFEFEFE</div>
      </div>

      <div className="flex space-x-10 text-center">
        <div>
          {Object.keys(ass[2])
            .slice(0, 4)
            .map((association) => (
              <div
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span className="hidden">{association}</span>
                <span className="">?</span>
              </div>
            ))}

          <div className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer">
            <span className="hidden">{ass[2].answer}</span>
            <span className="">Answer</span>
          </div>
        </div>

        <div>
          {Object.keys(ass[3])
            .slice(0, 4)
            .map((association) => (
              <div
                onClick={handleClick}
                key={association}
                className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer"
              >
                <span className="hidden">{association}</span>
                <span className="">?</span>
              </div>
            ))}
          <div className="flex items-center justify-center w-20 h-10 px-[4rem] bg-blue-500 border-2 border-white cursor-pointer">
            <span className="hidden">{ass[3].answer}</span>
            <span className="">Answer</span>
          </div>
        </div>
      </div>

      {openTypeAnswer && (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
          <div className="flex flex-col items-center p-2 mx-2 text-black bg-white rounded-md">
            <h2>Unesite vas odgovor</h2>

            <textarea className="p-1 my-1 border" rows={1} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Asocijacije;
