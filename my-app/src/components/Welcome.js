import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import StudentDashboard from "../components/StudentDashboard";
import "./LandingPage.css";

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [initialMessagingInstituteId, setInitialMessagingInstituteId] = useState("");
  const [initialMessagingInstituteName, setInitialMessagingInstituteName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Assuming general user info uses localStorage
        if (!token) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }
        const response = await fetch("https://major-project01-1ukh.onrender.com/api/student/getUserName", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserName(data.name || "Student");
      } catch (error) {
        console.error("Error fetching user name:", error.message);
      }
    };
    fetchUserName();
  }, []);

  const handleOpenChat = () => {
    setShowDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setInitialMessagingInstituteId("");
    setInitialMessagingInstituteName("");
  };

  return (
    <div
      className="landing-container"
      style={{
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        color: '#333',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div className="content">
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.5em', fontWeight: 600, marginBottom: '15px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
          Welcome, <span className="username">{userName || "Guest"}</span>
          <button
            className="msg-inline-btn"
            onClick={handleOpenChat}
            title="Open Messages"
          >
            <FaEnvelope />
          </button>
        </h2>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.1em', lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
          <FaSearch style={{ marginRight: '8px' }} /> Use the search bar above to find your college easily.
        </p>

        {showDashboard && (
          <div className="dashboard-overlay">
            <StudentDashboard
              initialMessagingInstituteId={initialMessagingInstituteId}
              initialMessagingInstituteName={initialMessagingInstituteName}
              onClose={handleCloseDashboard}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Welcome;
// Welcome.js
// import React, { useState, useEffect } from "react";
// import Footer from "../components/Footer";
// import { FaEnvelope, FaSearch } from "react-icons/fa";
// import ChatBox from "./StudentChatBox";
// import axiosInstance from "../axios";
// import { jwtDecode } from "jwt-decode";
// import "./LandingPage.css";

// const Welcome = () => {
//   const [userName, setUserName] = useState("");
//   const [showChat, setShowChat] = useState(false);
//   const [hasNewMessage, setHasNewMessage] = useState(false);
//   const [instituteList, setInstituteList] = useState([]);
//   const [selectedInstitute, setSelectedInstitute] = useState(null);
//   const [studentId, setStudentId] = useState(""); // Add state for studentId

//   useEffect(() => {
//     const fetchUserName = async () => {
//       try {
//         const token = localStorage.getItem("userToken");

//         if (!token) {
//           alert("Session expired. Please log in again.");
//           window.location.href = "/login";
//           return;
//         }

//         const response = await fetch("https://major-project01-1ukh.onrender.com/api/student/getUserName", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setUserName(data.name || "Student");
//       } catch (error) {
//         console.error("Error fetching user name:", error.message);
//       }
//     };

//     fetchUserName();
//   }, []);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const token = sessionStorage.getItem("studentToken");
//         if (!token) return;
//         const decoded = jwtDecode(token);
//         const studentId = decoded.id;
//         setStudentId(studentId); // Store studentId
//         const res = await axiosInstance.get(`/messages/contacts/${studentId}`);
//         if (res.data.success) {
//           setInstituteList(res.data.contacts);
//         }
//       } catch (err) {
//         console.error("Error fetching contacts:", err.message);
//       }
//   };

//     fetchContacts();
//   }, []);

//   // 🔔 Poll for new messages notification
//   useEffect(() => {
//     const token = sessionStorage.getItem("studentToken");
//     if (!token) return;

//     const decoded = jwtDecode(token);
//     const studentId = decoded.id;
//     setStudentId(studentId); // Also set it here, in case this effect runs first.

//     const checkNewMessages = async () => {
//       try {
//         const res = await axiosInstance.get(`/messages/unread/${studentId}`);
//         const data = res.data;

//         if (data.success) {
//           setHasNewMessage(data.newMessagesExist); // boolean returned from backend
//         }
//       } catch (err) {
//         console.error("Message check error:", err.message);
//       }
//     };

//     checkNewMessages();
//     const interval = setInterval(checkNewMessages, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleOpenChat = () => {
//     setShowChat(!showChat);
//     setHasNewMessage(false); // clear dot when opening chat
//   };

//   return (
//     <div
//       className="landing-container"
//       style={{
//         background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         textAlign: "center",
//         color: '#333',
//         padding: '20px',
//         boxSizing: 'border-box',
//       }}
//     >
//       <div className="content">
//         <h2
//           style={{
//             fontFamily: 'Montserrat, sans-serif',
//             fontSize: '2.5em',
//             fontWeight: 600,
//             marginBottom: '15px',
//             color: '#1e3a8a',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '15px',
//             justifyContent: 'center',
//           }}
//         >
//           Welcome, <span className="username">{userName || "Guest"}</span>
//           <button
//             className="msg-inline-btn"
//             onClick={handleOpenChat}
//             title="Check Messages"
//             style={{ position: "relative" }}
//           >
//             <FaEnvelope />
//             {hasNewMessage && <span className="blue-dot" />}
//           </button>
//         </h2>
//         <p
//           style={{
//             fontFamily: 'Open Sans, sans-serif',
//             fontSize: '1.1em',
//             lineHeight: '1.6',
//             color: '#555',
//             marginBottom: '20px',
//           }}
//         >
//           <FaSearch style={{ marginRight: '8px' }} /> Use the search bar above to
//           find your college easily.
//         </p>

//         {instituteList.length > 0 && (
//           <div style={{ marginBottom: "15px" }}>
//             <label style={{ marginRight: "10px", fontWeight: 500 }}>
//               Select Institute to Chat:
//             </label>
//             <select
//               value={selectedInstitute?._id || ""}
//               onChange={(e) => {
//                 const selected = instituteList.find((i) => i._id === e.target.value);
//                 setSelectedInstitute(selected);
//                 setShowChat(true);
//                 setHasNewMessage(false);
//               }}
//             >
//               <option value="">-- Choose --</option>
//               {instituteList.map((institute) => (
//                 <option key={institute._id} value={institute._id}>
//                   {institute.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* ✅ Chat Modal with receiver info */}
//         {showChat && selectedInstitute && (
//           <div className="chat-popup">
//             <ChatBox
//               receiverId={selectedInstitute._id}
//               receiverName={selectedInstitute.name}
//               eventId={null}
//               onClose={() => setShowChat(false)}
//             />
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Welcome;
