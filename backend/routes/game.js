import { Router } from "express";
import { createGameSession, deleteGameSession } from "../controllers/game.js";

const router = Router();

router.post("/createGameSession", createGameSession);

router.delete("/deleteGameSession", deleteGameSession);

export default router;
