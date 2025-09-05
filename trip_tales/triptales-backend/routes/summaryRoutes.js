import express from "express";
import { generateSummary } from "../controllers/summaryController.js";
import { getSummaryById } from "../controllers/summaryController.js";
const router = express.Router();

router.post("/:postId/generate", generateSummary); 
router.get("/:id", getSummaryById); 

export default router;
