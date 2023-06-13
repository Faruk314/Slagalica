import React, { useEffect, useState } from "react";

const Slagalica = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [chosenLettersIndexes, setChosenLettersIndexes] = useState<number[]>(
    []
  );

  useEffect(() => {
    const initGame = () => {
      // Generate 12 random letters
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let generatedLetters = "";
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        generatedLetters += alphabet.charAt(randomIndex);
      }

      setLetters(generatedLetters.split(""));
    };

    initGame();
  }, []);

  useEffect(() => {
    const findLongestWord = async () => {
      const query = letters.join("").toLowerCase();
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${query}`
      );
      const data: any = await response.json();
      let longestWord = "";

      data.forEach((wordData: any) => {
        const word = wordData.word;
        if (word.length > longestWord.length) {
          longestWord = word;
        }
      });

      console.log("Longest Word:", longestWord);
    };

    if (letters.length > 0) {
      findLongestWord();
    }
  }, [letters]);

  return (
    <section className="flex flex-col mx-2 mt-2 space-y-5">
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
