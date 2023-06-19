import { Router } from "express";
import {
  createGameSession,
  deleteGameSession,
  getGameState,
  updateGameState,
} from "../controllers/game.js";

const router = Router();

router.post("/createGameSession", createGameSession);

router.delete("/deleteGameSession", deleteGameSession);

router.put("/updateGameState", updateGameState);

router.get("/getGameState/:gameName", getGameState);

export default router;
