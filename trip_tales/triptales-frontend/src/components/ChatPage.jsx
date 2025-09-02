import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { toast } from "react-toastify";
import profileIcon from "../assets/img.jpg";
import "./ChatPage.css";

function ChatPage() {
  const { postId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const initializeChat = async () => {
      try {
        const res = await axios.post("/api/chats/init", {
          postId,
          userId: currentUser.id,
        });
        setChatId(res.data.chatId);
      } catch (err) {
        console.error("Failed to initialize chat", err);
        setError("Failed to start chat");
        toast.error("Failed to start chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [postId, currentUser, navigate]);

  if (loading) return <div className="chat-loading">Loading chat...</div>;
  if (error) return <div className="chat-error">{error}</div>;

  return (
    <div className="chat-page">
      {/* Header Bar */}
      <div className="tt-header-container">
        <h1 className="tt-logo">TripTales</h1>
        <div className="tt-header-actions">
          <Link to="/postdashboard" className="tt-create-trip-btn">
            ⬅ Back to Dashboard
          </Link>
          <div className="tt-profile-dropdown-wrapper">
            <img src={profileIcon} alt="Profile" className="tt-profile-pic" />
            <span className="tt-username">{currentUser?.username}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-container">
        <div className="chat-wrapper shadow-sm">
          <div className="chat-header">💬 Chat Room</div>
          {chatId && <ChatBox chatId={chatId} userId={currentUser.id} />}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
