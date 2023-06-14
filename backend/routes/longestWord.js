import { Router } from "express";
import {
  checkWordValidity,
  getLongestWord,
} from "../controllers/longestWord.js";

const router = Router();

router.post("/getLongestWord", getLongestWord);

router.post("/checkWordValidity", checkWordValidity);

export default router;
