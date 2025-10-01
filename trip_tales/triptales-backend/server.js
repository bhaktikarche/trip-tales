import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import postRoutes from "./routes/postRoutes.js";
import locationRoutes from "./routes/location.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import bookmarksRoutes from "./routes/bookmarks.js";
import helpfulsRoutes from "./routes/helpfuls.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import announceRoutes from "./routes/announceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import db from "./config/db.js";

const app = express();

// --- Fix for __dirname in ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpServer = createServer(app);

// --- Socket.IO setup ---
const io = new Server(httpServer, {
  cors: {
    origin: "https://trip-tales-fqbl.onrender.com", // deployed frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Make io available to routes
export { io };

// --- Socket.IO Events ---
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // Join chat room
  socket.on("joinChat", ({ chatId, userId }) => {
    try {
      console.log(`👥 User ${userId} joined chat_${chatId}`);
      socket.join(`chat_${chatId}`);

      // Mark messages as read
      db.query(
        "UPDATE chat_participants SET last_seen = NOW() WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );

      // Send chat history
      db.query(
        `SELECT m.id, m.sender_id, m.body, m.created_at, u.username AS sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE chat_id = ?
         ORDER BY m.created_at ASC`,
        [chatId]
      ).then(([messages]) => {
        socket.emit("chatHistory", messages);
      });
    } catch (err) {
      console.error("❌ Error joining chat:", err);
    }
  });

  // Handle request for chat history
  socket.on("requestChatHistory", ({ chatId }) => {
    db.query(
      `SELECT m.id, m.sender_id, m.body, m.created_at, u.username AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE chat_id = ?
       ORDER BY m.created_at ASC`,
      [chatId]
    ).then(([messages]) => {
      socket.emit("chatHistory", messages);
    });
  });

  // Handle sending message
  socket.on("sendMessage", async ({ chatId, senderId, body }) => {
    try {
      console.log("📨 Received message:", { chatId, senderId, body });

      // First insert the message into database
      const [result] = await db.query(
        "INSERT INTO messages (chat_id, sender_id, body) VALUES (?, ?, ?)",
        [chatId, senderId, body]
      );

      // Then retrieve the complete message with user info
      const [rows] = await db.query(
        `SELECT m.id, m.sender_id, m.body, m.created_at, u.username AS sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE m.id = ?`,
        [result.insertId]
      );

      const message = rows[0];
      console.log("📤 Broadcasting message:", message);

      // Broadcast to all in the room (including sender)
      io.to(`chat_${chatId}`).emit("receiveMessage", message);

      // Update unread counts for other participants only
      await db.query(
        `UPDATE chat_participants 
         SET unread_count = unread_count + 1 
         WHERE chat_id = ? AND user_id != ?`,
        [chatId, senderId]
      );
    } catch (err) {
      console.error("❌ Error sending message:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// --- Test database connection ---
const testDatabaseConnection = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

// Middleware to authenticate admin
function authenticateAdmin(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Auth header:", req.header("Authorization"));
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const decoded = jwt.verify(token, jwtSecret);
console.log("Decoded token:", decoded);


    // Check for role instead of isAdmin
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(400).json({ error: "Invalid token." });
  }
}

// Initialize the application
const initializeApp = async () => {
  // Test database connection first
  await testDatabaseConnection();

  // Middleware
 app.use(
  cors({
    origin: "https://trip-tales-fqbl.onrender.com", // deployed frontend URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static uploads
  app.use("/uploads", express.static(path.join("public", "uploads")));

  // Routes
  app.use("/api/posts", postRoutes);
  app.use("/api", locationRoutes);
  app.use("/api/summary", summaryRoutes);
  app.use("/api", authRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/likes", likeRoutes);
  app.use("/api/bookmarks", bookmarksRoutes);
  app.use("/api/helpfuls", helpfulsRoutes);
  app.use("/api/experiences", experienceRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/chats", chatRoutes);

  // Get user status (blocked or not)
  app.get("/api/users/:userId/status", async (req, res) => {
    try {
      const { userId } = req.params;

      const [rows] = await db.query(
        "SELECT id, is_blocked FROM users WHERE id = ?",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ blocked: rows[0].is_blocked === 1 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user status" });
    }
  });

  // Admin chat routes
  app.get("/api/admin/chats", authenticateAdmin, async (req, res) => {
    try {
      const [conversations] = await db.query(`
        SELECT 
          c.id,
          c.post_id,
          p.title as post_title,
          u.id as user_id,
          u.username as username,
          (SELECT body FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
          (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
          (SELECT COUNT(*) FROM messages WHERE chat_id = c.id) as message_count,
          u.is_blocked
        FROM chats c
        JOIN posts p ON p.id = c.post_id
        JOIN chat_participants cp ON cp.chat_id = c.id
        JOIN users u ON u.id = cp.user_id
        ORDER BY last_message_at DESC
      `);

      res.json({ conversations });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get messages for a specific chat
  app.get(
    "/api/admin/chats/:chatId/messages",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { chatId } = req.params;

        const [messages] = await db.query(
          `SELECT m.id, m.sender_id, m.body, m.created_at, u.username as sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE chat_id = ?
         ORDER BY m.created_at ASC`,
          [chatId]
        );

        res.json({ messages });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    }
  );

  // Block a user
  app.post(
    "/api/admin/block-user/:userId",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { userId } = req.params;

        await db.query("UPDATE users SET is_blocked = TRUE WHERE id = ?", [
          userId,
        ]);

        res.json({ message: "User blocked successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to block user" });
      }
    }
  );

  // Unblock a user
  app.post(
    "/api/admin/unblock-user/:userId",
    authenticateAdmin,
    async (req, res) => {
      try {
        const { userId } = req.params;

        await db.query("UPDATE users SET is_blocked = FALSE WHERE id = ?", [
          userId,
        ]);

        res.json({ message: "User unblocked successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unblock user" });
      }
    }
  );

  // Get all blocked users
  app.get("/api/admin/blocked-users", authenticateAdmin, async (req, res) => {
    try {
      const [blockedUsers] = await db.query(
        "SELECT id, username, email FROM users WHERE is_blocked = TRUE"
      );

      res.json({ blockedUsers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch blocked users" });
    }
  });

  app.use(
    "/api/announcements",
    (req, res, next) => {
      console.log("📢 Hit /api/announcements route:", req.method, req.url);
      next();
    },
    announceRoutes
  );

  // Use httpServer to listen, not app.listen()
  const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("Socket.IO server is ready");
});

};

// Start the application
initializeApp().catch((err) => {
  console.error("Failed to initialize application:", err);
  process.exit(1);
});
