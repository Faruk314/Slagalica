import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const LongestWord = () => {
  const [longestWord, setLongestWord] = useState("");
  const [letters, setLetters] = useState<string[]>([]);
  const [chosenLetters, setChossenLetters] = useState<string[]>([]);
  const isEffectExecutedRef = useRef(false);
  const [chosenLettersIndexes, setChosenLettersIndexes] = useState<number[]>(
    []
  );
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  console.log(points);

  const submitHandler = async () => {
    const word: string = chosenLetters.join("");

    try {
      const validity = await axios.post(
        "http://localhost:4000/api/wordgame/checkWordValidity",
        { word }
      );

      console.log(validity);

      if (validity.data && word.length === longestWord.length) {
        setPoints(10);
      }

      if (validity.data && word.length !== longestWord.length) {
        setPoints(word.length);
      }

      setIsGameOver(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (letter: string, index: number) => {
    setChossenLetters((prev) => [...prev, letter]);
    setChosenLettersIndexes((prev) => [...prev, index]);
  };

  const deleteHandler = () => {
    let chosenLettersCopy = [...chosenLetters];
    let chosenlettersIndexesCopy = [...chosenLettersIndexes];

    console.log("chosen letters", chosenLettersCopy);

    chosenLettersCopy.splice(chosenLettersCopy.length - 1, 1);
    chosenlettersIndexesCopy.splice(chosenlettersIndexesCopy.length - 1, 1);

    setChossenLetters(chosenLettersCopy);
    setChosenLettersIndexes(chosenlettersIndexesCopy);
  };

  useEffect(() => {
    const initGame = async () => {
      // Generate 12 random letters
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let generatedLetters = "";
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        generatedLetters += alphabet.charAt(randomIndex);
      }

      try {
        const response = await axios.post(
          "http://localhost:4000/api/wordgame/getLongestWord",
          { letters: generatedLetters }
        );

        console.log(response.data);
        setLongestWord(response.data);
      } catch (error) {
        console.log(error);
      }

      setLetters(generatedLetters.split(""));
    };

    if (!isEffectExecutedRef.current) {
      initGame();
      isEffectExecutedRef.current = true;
    }
  }, []);

  return (
    <section className="flex flex-col justify-center h-[100vh] mx-2 mt-2 space-y-5  max-w-5xl md:mx-auto">
      <div className="grid grid-cols-6 gap-2 text-xl font-bold text-white rounded-md">
        {letters.map((letter, index) => (
          <button
            disabled={chosenLettersIndexes.includes(index) ? true : false}
            onClick={() => handleClick(letter, index)}
            className="h-[3rem] bg-blue-600 rounded-md disabled:text-gray-400"
            key={index}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <div className="flex items-center justify-center w-full h-10 text-black border border-black rounded-md">
          <span> {chosenLetters}</span>
        </div>
        <button
          onClick={deleteHandler}
          className="px-3 text-white bg-red-600 rounded-md"
        >
          X
        </button>
      </div>

      <button
        disabled={chosenLetters.length > 1 ? false : true}
        onClick={submitHandler}
        className="p-2 mx-auto font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
      >
        SUBMIT
      </button>
    </section>
  );
};

export default LongestWord;
