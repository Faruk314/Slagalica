import asyncHandler from "express-async-handler";
import query from "../db.js";
import { Redis } from "ioredis";

const client = new Redis({
  host: "localhost",
  port: 6379,
});

export const createGameSession = asyncHandler(async (req, res) => {
  const userId = 1;
  const game = {
    longestWord: {
      seconds: 60,
      longestWord: "",
      letters: [],
      chosenLetters: [],
      chosenLettersIndexes: [],
    },
    associations: {
      ass: [],
      score: 0,
      fieldsOpenCount: {
        0: [],
        1: [],
        2: [],
        3: [],
      },
      finalAnswer: "",
      seconds: 100,
      answeredCorrectly: [],
    },
    mastermind: {
      grid: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ],
      winCombination: [],
      rowsChecked: [],
      hints: [],
      seconds: 90,
    },
    matchingPairs: {
      leftSide: [],
      rightSide: [],
      corrects: [],
      incorrects: [],
      totalAnswered: 0,
      score: 0,
      seconds: 60,
    },
    quiz: {
      currentQuestionIndex: 0,
      currentAnswers: {},
      questions: [],
      points: 0,
      seconds: 120,
    },
    targetNumber: {
      chars: [],
      targetNumber: 0,
      randomNumbers: [],
      usedNumbersIndexes: [],
      result: null,
      seconds: 90,
    },
  };

  try {
    await client.set(userId, JSON.stringify(game));
    res.status(200).json("success");
  } catch (error) {
    console.log("Error creating game session");
    res.status(500).json("Error creating game session");
  }
});

export const deleteGameSession = asyncHandler(async (req, res) => {
  const userId = 1;

  try {
    await client.del(userId);
    res.status(200).json("successfully deleted game session");
  } catch (error) {
    console.log("Error deleting game session");
    res.status(500).json("Error deleting game session");
  }
});
