import { Router } from "express";
import { getQuestions } from "../controllers/quiz.js";

const router = Router();

router.get("/getQuestions", getQuestions);

export default router;
