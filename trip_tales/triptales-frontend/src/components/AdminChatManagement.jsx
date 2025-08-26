// AdminChatManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminChatManagement.css";

function AdminChatManagement() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // { chatId, userId }
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const token = localStorage.getItem("token");

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/admin/chats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data.conversations);

        // Extract blocked users
        const blockedIds = response.data.conversations
          .filter(conv => conv.is_blocked)
          .map(conv => conv.user_id);
        setBlockedUsers(new Set(blockedIds));
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          toast.error("Access denied. Admin privileges required.");
        } else {
          toast.error("Failed to load conversations");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId, userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/chats/${chatId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.messages);
      setSelectedChat({ chatId, userId });
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to load messages");
    }
  };

  // Block user
  const blockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        await axios.post(
          `http://localhost:5000/api/admin/block-user/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlockedUsers(prev => new Set([...prev, userId]));
        toast.success("User blocked successfully");
      } catch (err) {
        console.error("Error blocking user:", err);
        toast.error("Failed to block user");
      }
    }
  };

  // Unblock user
  const unblockUser = async (userId) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        await axios.post(
          `http://localhost:5000/api/admin/unblock-user/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlockedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        toast.success("User unblocked successfully");
      } catch (err) {
        console.error("Error unblocking user:", err);
        toast.error("Failed to unblock user");
      }
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.post_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.last_message && conv.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return "No messages yet";
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <div className="chat-management-loading">Loading conversations...</div>;
  }

  return (
    <div className="admin-chat-management">
      <h2 className="chat-management-title">
        <i className="fas fa-comments"></i> Chat Management
      </h2>

      <div className="chat-management-container">
        {/* Conversations sidebar */}
        <div className="conversations-sidebar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users, posts, or messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                {searchTerm ? "No matching conversations found" : "No conversations yet"}
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={`${conv.id}-${conv.user_id}`}
                  className={`conversation-item ${
                    selectedChat?.chatId === conv.id && selectedChat?.userId === conv.user_id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => fetchMessages(conv.id, conv.user_id)}
                >
                  <div className="conversation-header">
                    <span className="user-name">{conv.username}</span>
                    {blockedUsers.has(conv.user_id) && (
                      <span className="blocked-badge">Blocked</span>
                    )}
                    <span className="message-count">{conv.message_count} messages</span>
                  </div>
                  <div className="post-title">Post: {conv.post_title}</div>
                  <div className="last-message">
                    {conv.last_message && (
                      <>
                        <span className="last-message-text">{conv.last_message}</span>
                        <span className="last-message-time">
                          {formatDate(conv.last_message_at)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="conversation-actions">
                    {blockedUsers.has(conv.user_id) ? (
                      <button
                        className="unblock-user-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          unblockUser(conv.user_id);
                        }}
                      >
                        Unblock User
                      </button>
                    ) : (
                      <button
                        className="block-user-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          blockUser(conv.user_id);
                        }}
                      >
                        Block User
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages panel */}
        <div className="messages-panel">
          {selectedChat ? (
            <>
              <div className="messages-header">
                <h3>
                  Chat for Post: {
                    conversations.find(
                      c => c.id === selectedChat.chatId && c.user_id === selectedChat.userId
                    )?.post_title
                  }
                </h3>
                <button
                  className={
                    blockedUsers.has(selectedChat.userId) ? "btn btn-success" : "btn btn-danger"
                  }
                  onClick={() => {
                    if (blockedUsers.has(selectedChat.userId)) {
                      unblockUser(selectedChat.userId);
                    } else {
                      blockUser(selectedChat.userId);
                    }
                  }}
                >
                  {blockedUsers.has(selectedChat.userId) ? "Unblock User" : "Block User"}
                </button>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">No messages in this conversation</div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${
                        msg.sender_id === selectedChat.userId ? "user-message" : "other-message"
                      }`}
                    >
                      <div className="message-header">
                        <span className="sender-name">{msg.sender_name}</span>
                        <span className="message-time">{formatDate(msg.created_at)}</span>
                      </div>
                      <div className="message-body">{msg.body}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="select-chat-prompt">
              <i className="fas fa-comments"></i>
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChatManagement;
