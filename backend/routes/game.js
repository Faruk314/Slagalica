import { Router } from "express";
import { createGameSession } from "../controllers/game.js";

const router = Router();

router.post("/createGameSession", createGameSession);

export default router;
