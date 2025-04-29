// import React, { useState, useEffect, useCallback } from "react";
// import { Send, XCircle, AlertTriangle } from "lucide-react";
// import axiosInstance from "../axios"; // Corrected import path
// import './studentchatbox.css';

// const StudentChatBox = ({ studentId, instituteId, onClose, selectedContactName }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchMessages = useCallback(async () => {
//     if (!studentId || !instituteId) {
//       setError("Student and Institute IDs are required.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/messages/${studentId}/${instituteId}`);
//       if (res.data.success) {
//         setMessages((prevMessages) => {
//           // Only append new messages if they are different from the latest ones
//           const newMessages = res.data.messages || [];
//           if (newMessages.length !== prevMessages.length) {
//             return newMessages;
//           }
//           return prevMessages;
//         });
//       } else {
//         throw new Error(res.data.message || `Failed to fetch messages: ${res.status}`);
//       }
//     } catch (err) {
//       setError(err.message || "An error occurred while fetching messages.");
//     } finally {
//       setLoading(false);
//     }
//   }, [studentId, instituteId]);

//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
//     return () => clearInterval(interval); // Clean up interval on unmount
//   }, [fetchMessages]);

//   const handleSendMessage = useCallback(async () => {
//     if (!newMessage.trim() || !studentId || !instituteId || !selectedContactName) return;

//     try {
//       const messagePayload = {
//         senderId: studentId,
//         senderType: "student",
//         senderName: "You",
//         receiverId: instituteId,
//         receiverName: selectedContactName,
//         message: newMessage,
//         receiverType: "institute",
//       };

//       const res = await axiosInstance.post("/messages", messagePayload);
//       if (res.data.success) {
//         setMessages((prevMessages) => [...prevMessages, res.data.message]);
//         setNewMessage(""); // Clear input after sending
//       } else {
//         throw new Error(res.data.message || "Failed to send message");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to send message.");
//     }
//   }, [newMessage, studentId, instituteId, selectedContactName]);

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="chat-box-loading">
//         <p>Loading messages...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="chat-box-error">
//         <AlertTriangle className="error-icon" />
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-box">
//       <div className="chat-header">
//         <h2 className="chat-title">Chat with {selectedContactName}</h2>
//         <button className="close-chat-btn" onClick={onClose}>
//           <XCircle />
//         </button>
//       </div>
//       <div className="message-list">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.senderId === studentId ? "sent" : "received"}`}>
//             <p className="message-content">{msg.message}</p>
//             <span className="message-sender">
//               {msg.senderId === studentId ? "You" : msg.senderName}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className="input-area">
//         <textarea
//           value={newMessage}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           placeholder="Type your message..."
//           className="message-input"
//           rows={1}
//         />
//         <button className="send-button" onClick={handleSendMessage}>
//           <Send />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentChatBox;
import React, { useState, useEffect, useCallback } from "react";
import { Send, XCircle, AlertTriangle } from "lucide-react";
import axiosInstance from "../axios"; // Corrected import path
import './studentchatbox.css';

const StudentChatBox = ({ studentId, instituteId, onClose, selectedContactName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!studentId || !instituteId) {
      setError("Student and Institute IDs are required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${studentId}/${instituteId}`);
      if (res.data.success) {
        setMessages(res.data.messages || []); // Set fetched messages
      } else {
        throw new Error(res.data.message || `Failed to fetch messages: ${res.status}`);
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching messages.");
    } finally {
      setLoading(false);
    }
  }, [studentId, instituteId]);

  useEffect(() => {
    fetchMessages(); // Fetch messages when the component is mounted
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !studentId || !instituteId || !selectedContactName) return;

    try {
      const messagePayload = {
        senderId: studentId,
        senderType: "student",
        senderName: "You",
        receiverId: instituteId,
        receiverName: selectedContactName,
        message: newMessage,
        receiverType: "institute",
      };

      const res = await axiosInstance.post("/messages", messagePayload);
      if (res.data.success) {
        setMessages((prevMessages) => [...prevMessages, res.data.message]);
        setNewMessage(""); // Clear input after sending
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
          <Send />
        </button>
      </div>
    </div>
  );
};

export default StudentChatBox;
