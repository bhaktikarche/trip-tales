import express from "express";
import multer from "multer";
import { authenticateToken } from "../Middleware/auth.js";
import {
  createPost,
  getPosts,
  getUserPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route to get all posts (dashboard)
router.get("/", getPosts);

// Protected routes:
router.post("/", authenticateToken, upload.array("images", 10), createPost);
router.get("/user", authenticateToken, getUserPosts);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
