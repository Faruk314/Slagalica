import { Router } from "express";
import {
  createGameSession,
  deleteGameSession,
  getGameState,
} from "../controllers/game.js";

const router = Router();

router.post("/createGameSession", createGameSession);

router.delete("/deleteGameSession", deleteGameSession);

router.get("/getGameState/:gameName", getGameState);

export default router;
