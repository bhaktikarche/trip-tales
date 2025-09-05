import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Create a comment
router.post("/", async (req, res) => {
  const { postId, userId, commentText } = req.body;

  if (!postId || !userId || !commentText) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await db.query(
      `INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)`,
      [postId, userId, commentText]
    );

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all comments for a post
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const [results] = await db.query(
      `SELECT c.id, c.comment_text, c.created_at, u.name AS username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json(results);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
