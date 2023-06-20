import asyncHandler from "express-async-handler";
import query from "../db.js";
import { Redis } from "ioredis";
import wordList from "word-list-json";

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
      gameState: "",
      seconds: 60,
      longestWord: "",
      letters: [],
      chosenLetters: [],
      chosenLettersIndexes: [],
      score: 0,
    },
    associations: {
      gameState: "",
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
      score: 0,
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
      score: 0,
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
      gameState: "",
      currentQuestionIndex: 0,
      currentAnswers: {},
      questions: [],
      score: 0,
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
      score: 0,
    },
  };

  let gameState = await client.get(userId);

  if (gameState) return;

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

  if (gameName === "quiz" && gameState.quiz.gameState === "") {
    let q =
      "SELECT `id`,`question`,`answerOne`,`answerTwo`,`answerThree`,`correctAnswer` FROM questions ORDER BY RAND() LIMIT 10";

    let data = await query(q, []);

    console.log("data", data);

    if (!data) {
      res.status(404);
      throw new Error("Could not retrieve questions from database");
    }

    let answers = data.map((question) => {
      return {
        answerOne: question.answerOne,
        answersTwo: question.answerTwo,
        answerThree: question.answerThree,
        answerFour: question.correctAnswer,
      };
    });

    gameState.quiz.questions = data;
    gameState.quiz.currentAnswers = answers[0];
    gameState.quiz.gameState = "playing";

    await client.set(userId, JSON.stringify(gameState));
  }

  if (gameName === "associations" && gameState.associations.gameState === "") {
    const finalAnswers = ["MILEVA"];
    const randomNum = Math.floor(Math.random() * finalAnswers.length);
    const randomFinalAnswer = finalAnswers[randomNum];

    let q =
      "SELECT `id`,`first`,`second`,`third`,`fourth`,`answer`,`finalAnswer` FROM associations WHERE `finalAnswer` = ?";

    let data = await query(q, [randomFinalAnswer]);

    if (!data) {
      res.status(400);
      throw new Error("Could not get associations by final Answer");
    }

    gameState.associations.ass = data;
    gameState.associations.finalAnswer = data[0].finalAnswer;
    gameState.associations.gameState = "playing";

    await client.set(userId, JSON.stringify(gameState));
  }

  if (gameName === "longestWord" && gameState.longestWord.gameState === "") {
    // Generate 12 random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let generatedLetters = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      generatedLetters += alphabet.charAt(randomIndex);
    }

    const longestWord = findLongestWord(generatedLetters);

    console.log("Longest Word:", longestWord);

    gameState.longestWord.letters = generatedLetters.split("");
    gameState.longestWord.longestWord = longestWord;
    gameState.longestWord.gameState = "playing";
    gameState.longestWord.seconds = Math.floor(Date.now() / 1000);

    await client.set(userId, JSON.stringify(gameState));
  }

  let updatedData = await client.get(userId);
  let updatedGameState = JSON.parse(updatedData);

  res.status(200).json(updatedGameState[gameName]);
});

export const updateGameState = asyncHandler(async (req, res) => {
  const { updatedGameState, gameName } = req.body;
  const userId = 1;

  let data = await client.get(userId);

  if (!data) {
    res.status(500);
    throw new Error(
      "Could not retrieve game state in updateGameState controller"
    );
  }

  let gameState = JSON.parse(data);

  if (!gameName) {
    res.status(400);
    throw new Error("Game name not provided");
  }

  gameState[gameName] = updatedGameState;

  await client.set(userId, JSON.stringify(gameState));

  res.status(200).json("Game state updated successfully");
});

export const getGameStats = asyncHandler(async (req, res) => {
  let userId = 1;

  let data = await client.get(userId);

  if (!data) {
    res.status(500);
    throw new Error(
      "Could not retrieve game state from getGameStats controller"
    );
  }
  let gameStates = JSON.parse(data);
  console.log(gameStates);

  let gameStats = Object.entries(gameStates).map(([key, value]) => {
    console.log(value);

    return {
      gameName: key,
      score: value.score,
      gameState: value.gameState,
    };
  });

  res.status(200).json(gameStats);
});
