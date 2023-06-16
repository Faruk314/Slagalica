import asyncHandler from "express-async-handler";
import wordList from "word-list-json";

export const getLongestWord = asyncHandler(async (req, res) => {
  // const { letters } = req.body;
  // console.log(letters);
  // const longestWord = findLongestWord(letters);
  // console.log("Longest Word:", longestWord);
  // res.json(longestWord);
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
