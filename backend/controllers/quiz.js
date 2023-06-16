import asyncHandler from "express-async-handler";
import query from "../db.js";

// id: 5,
// question: "Koja je najveća planina na Zemlji?",
// answerOne: "K2",
// answerTwo: "Mount Kilimandžaro",
// answerThree: "Mount Denali",
// correctAnswer: "Mount Everest",

export const getQuestions = asyncHandler(async (req, res) => {
  // let q =
  //   "SELECT `id`,`question`,`answerOne`,`answerTwo`,`answerThree`,`correctAnswer` FROM questions ORDER BY RAND() LIMIT 10";
  // let data = await query(q, []);
  // if (!data) {
  //   res.status(404);
  //   throw new Error("Could not retrieve questions from database");
  // }
  // res.status(200).json(data);
});
