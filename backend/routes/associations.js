import { Router } from "express";
import { getAssociations } from "../controllers/associations.js";

const router = Router();

router.get("/getAssociations", getAssociations);

export default router;
