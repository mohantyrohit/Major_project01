import React, { useState, useEffect, useCallback, useRef } from "react";
import { Send, XCircle, AlertTriangle } from "lucide-react";
import axiosInstance from "../axios"; // Corrected import path
import './studentchatbox.css';

const StudentChatBox = ({ studentId, instituteId, onClose, selectedContactName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)
  const POLLING_INTERVAL = 3000;
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!studentId || !instituteId) {
      setError("Student and Institute IDs are required.");
      setLoading(false);
      return;
    }
    
    try {
      const res = await axiosInstance.get(`api/messages/${studentId}/${instituteId}`);
      if (res.data.success) {
        // Only update messages if there are new ones or it's the initial load
        if (loading || messages.length === 0 || messages.length !== res.data.messages.length) {
          setMessages(res.data.messages || []);
        }
      } else {
        throw new Error(res.data.message || `Failed to fetch messages: ${res.status}`);
      }
    } catch (err) {
      // Only show error on initial load, not during polling
      if (loading) {
        setError(err.message || "An error occurred while fetching messages.");
      } else {
        console.error("Polling error:", err);
      }
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [studentId, instituteId, loading, messages.length]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Polling mechanism
  useEffect(() => {
    let pollingInterval;
    
    if (!loading && !error) {
      pollingInterval = setInterval(() => {
        fetchMessages();
      }, POLLING_INTERVAL);
    }
    
    // Cleanup
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [fetchMessages, loading, error]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !studentId || !instituteId || !selectedContactName) return;
    
    try {
      const messagePayload = {
        receiverId: instituteId,
        receiverName: selectedContactName,
        message: newMessage,
        receiverType: "institute",
      };
      
      const res = await axiosInstance.post("api/messages", messagePayload);
      
      if (res.data.success) {
        setMessages((prevMessages) => [...prevMessages, res.data.message]);
        setNewMessage(""); // Clear input after sending
        scrollToBottom();
      } else {
        throw new Error(res.data.message || "Failed to send message");
      }
    } catch (err) {
      setError(err.message || "Failed to send message.");
    }
  }, [newMessage, studentId, instituteId, selectedContactName]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="chat-box-loading">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-box-error">
        <AlertTriangle className="error-icon" />
        <p>Error: {error}</p>
        <button 
          className="retry-button" 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchMessages();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2 className="chat-title">Chat with {selectedContactName}</h2>
        <button className="close-chat-btn" onClick={onClose}>
          <XCircle />
        </button>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === studentId ? "sent" : "received"}`}>
            <p className="message-content">{msg.message}</p>
            <span className="message-sender">
              {msg.senderId === studentId ? "You" : msg.senderName}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="message-input"
          rows={1}
        />
        <button className="send-button" onClick={handleSendMessage}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudentChatBox;