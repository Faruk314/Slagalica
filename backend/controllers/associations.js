import asyncHandler from "express-async-handler";
import query from "../db.js";

export const getAssociations = asyncHandler(async (req, res) => {
  // const finalAnswers = ["MILEVA"];
  // const randomNum = Math.floor(Math.random() * finalAnswers.length);
  // const randomFinalAnswer = finalAnswers[randomNum];
  // let q =
  //   "SELECT `id`,`first`,`second`,`third`,`fourth`,`answer`,`finalAnswer` FROM associations WHERE `finalAnswer` = ?";
  // let data = await query(q, [randomFinalAnswer]);
  // if (!data) {
  //   res.status(400);
  //   throw new Error("Could not get associations by final Answer");
  // }
  // console.log(data);
  // res.status(200).json(data);
});
