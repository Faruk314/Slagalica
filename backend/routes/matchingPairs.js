import { Router } from "express";
import { getMatchingPairs } from "../controllers/matchingPairs.js";

const router = Router();

router.get("/getMatchingPairs", getMatchingPairs);

export default router;
