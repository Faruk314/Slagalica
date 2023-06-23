import { Router } from "express";
import {
  createGameSession,
  deleteGameSession,
  getGameInfo,
  getGameState,
  getGameStats,
  searchPlayers,
  updateGameState,
} from "../controllers/game.js";
import { protect } from "../utils/protect.js";

const router = Router();

router.post("/createGameSession", protect, createGameSession);

router.delete("/deleteGameSession", protect, deleteGameSession);

router.put("/updateGameState", protect, updateGameState);

router.get("/getGameState/:gameName", protect, getGameState);

router.get("/getGameStats", protect, getGameStats);

router.get("/searchPlayers", protect, searchPlayers);

router.get("/getGameInfo", protect, getGameInfo);

export default router;
