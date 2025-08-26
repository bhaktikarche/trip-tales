import express from "express";
import db from "../config/db.js"; // adjust path to your DB connection

const router = express.Router();


// to console check

const fetchFeedbacks = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/feedback/all");
    console.log("Feedbacks from backend:", res.data); // 👈 add this
    setFeedbacks(res.data);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
  }
};

// ✅ Get all feedbacks with user info (for Admin Dashboard)
// In feedbackRoutes.js
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ue.id, ue.experience, ue.created_at, ue.updated_at,
              u.id AS user_id, u.name, u.email, u.username
       FROM user_experiences ue
       JOIN users u ON ue.user_id = u.id
       ORDER BY ue.created_at DESC`
    );
    
    // Ensure each feedback has both name and username properties
    const formattedFeedbacks = rows.map(row => ({
      ...row,
      username: row.username || row.name // Use name if username is missing
    }));
    
    res.json(formattedFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});


export default router;
