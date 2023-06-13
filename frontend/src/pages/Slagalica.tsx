import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Slagalica = () => {
  const [longestWord, setLongestWord] = useState("");
  const [letters, setLetters] = useState<string[]>([]);
  const [chosenLettersIndexes, setChosenLettersIndexes] = useState<number[]>(
    []
  );
  const isEffectExecutedRef = useRef(false);

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
    <section className="flex flex-col justify-center h-[100vh] mx-2 mt-2 space-y-5">
      <div className="grid grid-cols-6 gap-2 text-xl font-bold text-white rounded-md">
        {letters.map((letter, index) => (
          <button className="py-2 bg-blue-500 rounded-md" key={index}>
            {letter}
          </button>
        ))}
      </div>

      <div>
        <div className="py-5 border border-black rounded-md"></div>
      </div>

      <div>
        <span>OUR WORD</span>
        <div className="py-5 border border-black rounded-md"></div>
      </div>
    </section>
  );
};

export default Slagalica;
