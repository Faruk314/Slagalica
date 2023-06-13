import express from "express";
import wordRoutes from "./routes/wordGame.js";
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

app.listen(port, () => {
  console.log("123");
});

app.use(errorHandler);
