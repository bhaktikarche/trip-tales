import db from "../config/db.js"; // your MySQL connection

// Admin: get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM announcements ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

// Admin: create announcement
export const createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ error: "Title and message required" });
  try {
    const [result] = await db.execute(
      "INSERT INTO announcements (title, message) VALUES (?, ?)",
      [title, message]
    );
    res.json({ id: result.insertId, title, message, date: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// Admin: delete announcement
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM announcements WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};

// Users: mark as seen
export const markAnnouncementSeen = async (req, res) => {
  const userId = req.user.id;
  const { announcementId } = req.body;
  try {
    await db.execute(
      "INSERT IGNORE INTO user_announcements_seen (user_id, announcement_id) VALUES (?, ?)",
      [userId, announcementId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as seen" });
  }
};

// Users: get unseen announcements
export const getUnseenAnnouncements = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute(
      `
      SELECT a.* FROM announcements a
      WHERE a.id NOT IN (
        SELECT announcement_id FROM user_announcements_seen WHERE user_id = ?
      )
      ORDER BY a.date DESC
    `,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unseen announcements" });
  }
};
