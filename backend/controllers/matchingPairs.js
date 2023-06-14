import asyncHandler from "express-async-handler";
import query from "../db.js";

export const getMatchingPairs = asyncHandler(async (req, res) => {
  const categories = ["Alcohol", "Players", "Actors"];
  const randomNum = Math.floor(Math.random() * categories.length);
  const randomCategorie = categories[randomNum];

  let q = "SELECT `id`,`question`,`answer` FROM spojnice WHERE `category` = ?";

  let data = await query(q, [randomCategorie]);

  if (!data) {
    res.status(400);
    throw new Error("Could not get matching pairs by category");
  }

  res.status(200).json(data);
});
