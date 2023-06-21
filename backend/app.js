import express from "express";
import wordRoutes from "./routes/longestWord.js";
import gameRoutes from "./routes/game.js";
import matchingPairRoutes from "./routes/matchingPairs.js";
import associationsRoutes from "./routes/associations.js";
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import errorHandler from "./utils/error.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/wordgame", wordRoutes);
app.use("/api/matchingPair", matchingPairRoutes);
app.use("/api/associations", associationsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/game", gameRoutes);

app.listen(port, () => {
  console.log("Server runninng and listening on port: ", port);
});

app.use(errorHandler);
