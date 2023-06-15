import express from "express";
import wordRoutes from "./routes/longestWord.js";
import gameRoutes from "./routes/game.js";
import matchingPairRoutes from "./routes/matchingPairs.js";
import associationsRoutes from "./routes/associations.js";
import quizRoutes from "./routes/quiz.js";
import errorHandler from "./utils/error.js";
import cors from "cors";

const port = 4000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/wordgame", wordRoutes);
app.use("/api/matchingPair", matchingPairRoutes);
app.use("/api/associations", associationsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/game", gameRoutes);

app.listen(port, () => {
  console.log("123");
});

app.use(errorHandler);
