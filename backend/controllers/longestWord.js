import asyncHandler from "express-async-handler";
import wordList from "word-list-json";

function findLongestWord(letters) {
  let longestWord = "";

  for (const word of wordList) {
    const cleanedWord = cleanString(word);
    const cleanedLetters = cleanString(letters);

    if (
      canFormWord(cleanedWord, cleanedLetters) &&
      word.length > longestWord.length
    ) {
      longestWord = word;
    }
  }

  return longestWord;
}

function canFormWord(word, letters) {
  const lettersCopy = [...letters];

  for (const letter of word) {
    const letterIndex = lettersCopy.indexOf(letter);

    if (letterIndex === -1) {
      return false;
    }

    lettersCopy.splice(letterIndex, 1);
  }

  return true;
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z]/g, "");
}

export const getLongestWord = asyncHandler(async (req, res) => {
  const { letters } = req.body;

  console.log(letters);

  const longestWord = findLongestWord(letters);
  console.log("Longest Word:", longestWord);

  res.json(longestWord);
});

export const checkWordValidity = asyncHandler(async (req, res) => {
  const { word } = req.body;

  let wordValid = wordList.findIndex((string) => string === word.toLowerCase());

  console.log(wordValid);

  if (wordValid !== -1) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});
