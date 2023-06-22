import { Router } from "express";
import {
  createGameSession,
  deleteGameSession,
  getGameState,
  getGameStats,
  searchPlayers,
  updateGameState,
} from "../controllers/game.js";

const router = Router();

router.post("/createGameSession", createGameSession);

router.delete("/deleteGameSession", deleteGameSession);

router.put("/updateGameState", updateGameState);

router.get("/getGameState/:gameName", getGameState);

router.get("/getGameStats", getGameStats);

router.get("/searchPlayers", searchPlayers);

export default router;
