import asyncHandler from "express-async-handler";
import query from "../db.js";
import { Redis } from "ioredis";

const client = new Redis({
  host: "localhost",
  port: 6379,
});

const simbols = [
  "/images/skocko.png",
  "/images/club.png",
  "/images/spades.png",
  "/images/heart.png",
  "/images/diamond.png",
  "/images/star.png",
  "/images/skocko.png",
  "/images/club.png",
  "/images/spades.png",
  "/images/heart.png",
  "/images/diamond.png",
  "/images/star.png",
  "/images/skocko.png",
  "/images/club.png",
  "/images/spades.png",
  "/images/heart.png",
  "/images/diamond.png",
  "/images/star.png",
  "/images/skocko.png",
  "/images/club.png",
  "/images/spades.png",
  "/images/heart.png",
  "/images/diamond.png",
  "/images/star.png",
];

function findTargetNumber(randomTargetNumber, randomNumbers) {
  const target = randomTargetNumber;
  const numbers = randomNumbers;

  let closestNumber = Infinity;
  let closestDifference = Infinity;

  const generateExpressions = (currentNumber, currentIndex) => {
    if (currentIndex === numbers.length) {
      const difference = Math.abs(currentNumber - target);
      if (difference < closestDifference) {
        closestDifference = difference;
        closestNumber = currentNumber;
      }
      return;
    }

    const nextNumber = numbers[currentIndex];

    generateExpressions(currentNumber + nextNumber, currentIndex + 1);
    generateExpressions(currentNumber - nextNumber, currentIndex + 1);
    generateExpressions(currentNumber * nextNumber, currentIndex + 1);
    if (nextNumber !== 0 && currentNumber % nextNumber === 0) {
      generateExpressions(currentNumber / nextNumber, currentIndex + 1);
    }
  };

  generateExpressions(0, 0);

  return closestNumber !== Infinity ? closestNumber : -1;
}

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
      gameState: "",
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
      gameState: "",
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
      gameState: "",
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

export const getGameState = asyncHandler(async (req, res) => {
  const { gameName } = req.params;
  const userId = 1;

  let data = await client.get(userId);

  if (!data) {
    res.status(500);
    throw new Error("Could not retrieve game state");
  }

  let gameState = JSON.parse(data);

  // winCombination: [],

  //init mastermind game
  if (gameName === "mastermind" && gameState.mastermind.gameState === "") {
    const randomCombination = simbols
      .sort((a, b) => 0.5 - Math.random())
      .slice(0, 4);

    gameState.mastermind.winCombination = randomCombination;
    gameState.mastermind.gameState = "playing";

    await client.set(userId, JSON.stringify(gameState));
  }

  if (gameName === "targetNumber" && gameState.targetNumber.gameState === "") {
    let randomNumbers = [];
    let nums = [10, 25, 50, 75, 100, 20];

    let randomTargetNumber;
    let expression;

    while (true) {
      randomNumbers = [];
      nums = [10, 25, 50, 75, 100, 20];

      for (let i = 0; i < 6; i++) {
        let randomNum;

        if (i < 4) {
          randomNum = Math.floor(Math.random() * 9) + 1;
          randomNumbers.push(randomNum);
        } else {
          randomNum = Math.floor(Math.random() * nums.length);
          let randomSplice = nums.splice(randomNum, 1);
          randomNumbers.push(...randomSplice);
        }
      }

      randomTargetNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      expression = findTargetNumber(randomTargetNumber, randomNumbers);

      if (expression === randomTargetNumber) {
        break;
      }
    }

    gameState.targetNumber.targetNumber = expression;
    gameState.targetNumber.randomNumbers = randomNumbers;
    gameState.targetNumber.gameState = "playing";

    await client.set(userId, JSON.stringify(gameState));
  }

  if (
    gameName === "matchingPairs" &&
    gameState.matchingPairs.gameState === ""
  ) {
    const categories = ["Alcohol", "Players", "Actors"];
    const randomNum = Math.floor(Math.random() * categories.length);
    const randomCategorie = categories[randomNum];

    let q = "SELECT `id`,`question`,`answer` FROM pairs WHERE `category` = ?";

    let data = await query(q, [randomCategorie]);

    if (!data) {
      res.status(400);
      throw new Error("Could not get matching pairs by category");
    }

    const leftSideData = data
      .map((object) => {
        return {
          id: object.id,
          question: object.question,
        };
      })
      .sort((a, b) => Math.random() - 0.5);

    const rightSideData = data
      .map((object) => {
        return {
          id: object.id,
          answer: object.answer,
        };
      })
      .sort((a, b) => Math.random() - 0.5);

    gameState.matchingPairs.rightSide = rightSideData;
    gameState.matchingPairs.leftSide = leftSideData;
    gameState.matchingPairs.gameState = "playing";

    await client.set(userId, JSON.stringify(gameState));
  }

  let updatedData = await client.get(userId);
  let updatedGameState = JSON.parse(updatedData);

  res.status(200).json(updatedGameState[gameName]);
});
