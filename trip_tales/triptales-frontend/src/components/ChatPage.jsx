import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { RiChatSmile3Line, RiUserUnfollowLine } from "react-icons/ri";

function ChatPage() {
  const { postId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const initializeChat = async () => {
      try {
        // ✅ check if user is blocked
        try {
          const statusRes = await axios.get(
            `http://localhost:5000/api/users/${currentUser.id}/status`
          );
          setBlocked(statusRes.data.blocked);

          if (statusRes.data.blocked) {
            setLoading(false);
            return; // stop here, no chat init
          }
        } catch (err) {
          console.warn("User status endpoint not available, proceeding with chat");
          setBlocked(false);
        }

        // ✅ Initialize chat if not blocked
        const chatRes = await axios.post(
          "http://localhost:5000/api/chats/init",
          {
            postId,
            userId: currentUser.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        setChatId(chatRes.data.chatId);
        setOtherUser(chatRes.data.otherUser);

      } catch (err) {
        console.error("Failed to initialize chat", err);
        if (err.response?.status === 403) {
          setError("You are blocked from chatting.");
        } else {
          setError("Failed to start chat. Please try again.");
        }
        toast.error("Failed to start chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [postId, currentUser, navigate]);

  if (loading)
    return (
      <div className="chat-loading-container">
        <div className="chat-loading-content">
          <div className="loading-animation">
            <div className="loading-bubble"></div>
            <div className="loading-bubble"></div>
            <div className="loading-bubble"></div>
          </div>
          <p>Starting your conversation...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="chat-error-container">
        <div className="error-content">
          <div className="error-icon">💬</div>
          <h3>Chat Unavailable</h3>
          <p>{error}</p>
          <button className="modern-btn secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="chat-page-container">
      {/* Header - Minimal */}
      <div className="chat-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>

        <div className="chat-info">
          <div className="chat-avatar">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar} alt={otherUser.name} />
            ) : (
              <div className="avatar-placeholder">
                <FaUserCircle />
              </div>
            )}
          </div>
          <div className="chat-details">
            <h2>{otherUser ? otherUser.name : "Traveler"}</h2>
            <p className="status">{otherUser ? "Online" : "Connecting..."}</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Maximized */}
      <div className="chat-main-area">
        {blocked ? (
          <div className="chat-blocked-message">
            <div className="blocked-icon">
              <RiUserUnfollowLine />
            </div>
            <h3>Account Restricted</h3>
            <p>
              Your account has been temporarily suspended. You cannot initiate chats at this time.
            </p>
            <button className="modern-btn primary" onClick={() => navigate("/support")}>
              Contact Support
            </button>
          </div>
        ) : (
          <>
            {chatId ? (
              <div className="chat-interface">
                <ChatBox chatId={chatId} userId={currentUser.id} />
              </div>
            ) : (
              <div className="chat-welcome-section">
                <div className="welcome-icon">
                  <RiChatSmile3Line />
                </div>
                <h3>Your Travel Conversation</h3>
                <p>Start planning your adventure together</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        .chat-page-container {
          position: relative;
          height: 100vh;
          background: #f8fafc;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .chat-header {
          background: white;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 10;
          min-height: 60px;
        }
        
        .back-btn {
          background: #f1f5f9;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
          margin-right: 15px;
        }
        
        .back-btn:hover {
          background: #e2e8f0;
        }
        
        .chat-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #4a90e2, #63b3ed);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          color: white;
          font-size: 20px;
        }
        
        .chat-details h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 600;
        }
        
        .chat-details .status {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .status::before {
          content: "";
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
        }
        
        .chat-main-area {
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
        }
        
        .chat-welcome-section {
          text-align: center;
          padding: 20px;
          margin: auto;
          max-width: 300px;
        }
        
        .welcome-icon {
          font-size: 2.5rem;
          color: #4a90e2;
          margin-bottom: 15px;
        }
        
        .chat-welcome-section h3 {
          margin: 0 0 10px 0;
          color: #1e293b;
          font-weight: 600;
          font-size: 1.2rem;
        }
        
        .chat-welcome-section p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .chat-interface {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .chat-blocked-message {
          text-align: center;
          padding: 30px 20px;
          margin: auto;
          max-width: 400px;
        }
        
        .blocked-icon {
          font-size: 2.5rem;
          color: #ef4444;
          margin-bottom: 15px;
        }
        
        .chat-blocked-message h3 {
          margin: 0 0 12px 0;
          color: #1e293b;
          font-weight: 600;
          font-size: 1.2rem;
        }
        
        .chat-blocked-message p {
          margin: 0 0 20px 0;
          color: #64748b;
          line-height: 1.5;
          font-size: 0.9rem;
        }
        
        .modern-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .modern-btn.primary {
          background: linear-gradient(135deg, #4a90e2, #63b3ed);
          color: white;
        }
        
        .modern-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
        }
        
        .modern-btn.secondary {
          background: #f1f5f9;
          color: #64748b;
        }
        
        .modern-btn.secondary:hover {
          background: #e2e8f0;
        }
        
        .chat-loading-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }
        
        .chat-loading-content {
          text-align: center;
        }
        
        .loading-animation {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 15px;
        }
        
        .loading-bubble {
          width: 10px;
          height: 10px;
          background: #4a90e2;
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        
        .loading-bubble:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .loading-bubble:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .chat-error-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }
        
        .error-content {
          text-align: center;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 90%;
        }
        
        .error-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }
        
        .error-content h3 {
          margin: 0 0 12px 0;
          color: #1e293b;
          font-size: 1.2rem;
        }
        
        .error-content p {
          margin: 0 0 20px 0;
          color: #64748b;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .chat-header {
            padding: 10px 12px;
          }
          
          .chat-avatar {
            width: 36px;
            height: 36px;
          }
          
          .chat-details h2 {
            font-size: 1rem;
          }
          
          .chat-welcome-section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatPage;