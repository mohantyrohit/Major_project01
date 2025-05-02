import React, { useEffect, useState, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import "./ChatBox.css";

const InstituteChatBox = ({ receiverId, receiverName, eventId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [instituteName, setInstituteName] = useState("Institute");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("instituteToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setInstituteId(decoded.id);
        setInstituteName(decoded.instituteName || decoded.name || "Institute");
      } catch (err) {
        console.error("Token decode error:", err);
        alert("Invalid session. Please log in again.");
      }
    } else {
      alert("Please log in as an institute to access chat.");
    }
  }, []);

  useEffect(() => {
    console.log("Institute ID:", instituteId, "Institute Name:", instituteName);
  }, [instituteId, instituteName]);

  const fetchMessages = useCallback(async () => {
    if (!instituteId || !receiverId) return;

    const token = sessionStorage.getItem("instituteToken");
    try {
      const res = await fetch(`https://major-project01-1ukh.onrender.com/api/messages/${instituteId}/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
      } else {
        console.error("Fetch error:", data.message);
      }
    } catch (err) {
      console.error("Message fetch failed:", err);
    }
  }, [instituteId, receiverId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const token = sessionStorage.getItem("instituteToken");

    const messagePayload = {
      senderId: instituteId,
      senderType: "institute",
      senderName: instituteName,
      receiverId,
      receiverName,
      eventId,
      message: trimmedMessage,
      receiverType: "student",
    };

    const isValid =
      messagePayload.senderId &&
      messagePayload.receiverId &&
      messagePayload.eventId &&
      messagePayload.message &&
      messagePayload.receiverName &&
      messagePayload.receiverType;

    if (!isValid) {
      alert("Missing required message fields.");
      console.error("Invalid message payload:", messagePayload);
      return;
    }

    if (!messagePayload.receiverType) { // Added check
      console.error("CRITICAL ERROR: receiverType is missing!");
      alert("Critical error: receiverType is missing. Please check your application.");
      return;
    }

    console.log("Message Payload:", messagePayload);

    try {
      const res = await fetch("https://major-project01-1ukh.onrender.com/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messagePayload),
      });

      const data = await res.json();
      console.log("Response Status:", res.status);
      console.log("Response Data:", data);
      if (res.ok && data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      } else {
        console.error("Message send error:", data.message);
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <span>Chat with {receiverName}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatbox-message ${msg.senderId === instituteId ? "sent" : "received"}`}
          >
            <div className="sender-name">
              {msg.senderId === instituteId ? "You" : msg.senderName}
            </div>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbox-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default InstituteChatBox;




// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { jwtDecode } from "jwt-decode";
// import "./ChatBox.css";

// const InstituteChatBox = ({ receiverId, receiverName, eventId, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [instituteId, setInstituteId] = useState("");
//   const [instituteName, setInstituteName] = useState("Institute");
//   const chatEndRef = useRef(null);

//   // ✅ Decode institute info from token
//   useEffect(() => {
//     const token = localStorage.getItem("instituteToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setInstituteId(decoded.id);
//         setInstituteName(decoded.instituteName || decoded.name || "Institute");
//       } catch (err) {
//         console.error("Token decode error:", err);
//         alert("Invalid session. Please log in again.");
//       }
//     } else {
//       alert("Please log in as an institute to access chat.");
//     }
//   }, []);

//   // ✅ Fetch messages between institute and student
//   const fetchMessages = useCallback(async () => {
//     if (!instituteId || !receiverId) return;

//     const token = localStorage.getItem("instituteToken");
//     try {
//       const res = await fetch(`https://major-project01-1ukh.onrender.com/api/messages/${instituteId}/${receiverId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         setMessages(data.messages || []);
//       } else {
//         console.error("Fetch error:", data.message);
//       }
//     } catch (err) {
//       console.error("Message fetch failed:", err);
//     }
//   }, [instituteId, receiverId]);

//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   // ✅ Scroll to bottom on new message
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Handle sending messages
//   const handleSend = async () => {
//     const trimmedMessage = newMessage.trim();
//     if (!trimmedMessage) return;

//     const token = localStorage.getItem("instituteToken");

//     const messagePayload = {
//       senderId: instituteId,
//       senderType: "institute",
//       senderName: instituteName,
//       receiverId,
//       receiverName,
//       eventId,
//       message: trimmedMessage,
//     };

//     // Validate all fields before sending
//     const isValid =
//       messagePayload.senderId &&
//       messagePayload.receiverId &&
//       messagePayload.eventId &&
//       messagePayload.message &&
//       messagePayload.receiverName;

//     if (!isValid) {
//       alert("Missing required message fields.");
//       console.error("Invalid message payload:", messagePayload);
//       return;
//     }

//     try {
//       const res = await fetch("https://major-project01-1ukh.onrender.com/api/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(messagePayload),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         setMessages((prev) => [...prev, data.message]);
//         setNewMessage("");
//       } else {
//         console.error("Message send error:", data.message);
//         alert(data.message || "Failed to send message.");
//       }
//     } catch (err) {
//       console.error("Send error:", err);
//       alert("Failed to send message.");
//     }
//   };

//   return (
//     <div className="chatbox-container">
//       <div className="chatbox-header">
//         <span>Chat with {receiverName}</span>
//         <button onClick={onClose}>✖</button>
//       </div>

//       <div className="chatbox-messages">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`chatbox-message ${msg.senderId === instituteId ? "sent" : "received"}`}
//           >
//             <div className="sender-name">
//               {msg.senderId === instituteId ? "You" : msg.senderName}
//             </div>
//             <div>{msg.message}</div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="chatbox-input">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default InstituteChatBox;
