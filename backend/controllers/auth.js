import asyncHandler from "express-async-handler";
import query from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q = "SELECT `userId` FROM users WHERE `email`= ?";

  let result = await query(q, [email]);

  if (result.length > 0) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password has to be 6 characters min");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    q = "INSERT INTO users (`userName`,`email`,`password`) VALUES (?, ?, ?)";

    result = await query(q, [userName, email, hash]);

    q =
      "SELECT `userId` , `userName`,`email` FROM users WHERE `email`= ? AND `password`= ?";

    result = await query(q, [email, hash]);

    const token = jwt.sign(
      { userId: result[0].userId },
      process.env.JWT_SECRET
    );

    if (!token) {
      res.status(400);
      throw new Error("Something went wrong with token creation");
    }

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .status(200)
      .json({
        userInfo: {
          userId: result[0].userId,
          userName: result[0].userName,
          email: result[0].email,
        },
      });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred during user registration");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q =
    "SELECT `userId`,`userName`,`email`,`password` FROM users WHERE `email`= ?";

  let data = await query(q, [email]);

  if (!data) {
    res.status(404);
    throw new Error("Incorrect email or password");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Incorrect email or password");
  }

  const token = jwt.sign({ userId: data[0].userId }, process.env.JWT_SECRET);

  if (!token) {
    res.status(400);
    throw new Error("Something went wrong with token creation");
  }

  res
    .cookie("token", token, {
      httpOnly: false,
      sameSite: "strict",
      secure: true,
    })
    .status(200)
    .json({
      userInfo: {
        userId: data[0].userId,
        userName: data[0].userName,
        email: data[0].email,
      },
    });
});

export const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("successfully logged out");
});
