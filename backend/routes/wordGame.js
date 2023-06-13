import { Router } from "express";
import { getLongestWord } from "../controllers/wordGame.js";

const router = Router();

router.post("/getLongestWord", getLongestWord);

export default router;
