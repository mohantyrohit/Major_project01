import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaBell,
  FaComment,
  FaEdit,
  FaEnvelopeOpenText,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ChatBox from "./InstituteChatBox";
import axios from "axios";
import "./NavbarInstitute.css";
import { motion, AnimatePresence } from "framer-motion";

const NavbarInstitute = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [showChatBox, setShowChatBox] = useState(false);
  const [chatReceiverId, setChatReceiverId] = useState(null);
  const [chatReceiverName, setChatReceiverName] = useState("");
  const [chatEventId, setChatEventId] = useState(null);

  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [instituteInfo, setInstituteInfo] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user?._id) return;
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://major-project01-1ukh.onrender.com/api/requests/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setRequests(res.data.requests);
        setShowRequestModal(true);
      } else {
        setRequests([]);
        console.log("No requests fetched (success: false)");
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  }, [user]);

  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await axios.get(
          "https://major-project01-1ukh.onrender.com/api/instituteInfo/states"
        );
        if (res.data.success) setStates(res.data.states);
      } catch (err) {
        console.error("Error fetching states:", err);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        // Log the API call for debugging
        console.log(`Fetching districts for state: ${selectedState}`);
        
        const res = await axios.get(
          `https://major-project01-1ukh.onrender.com/api/instituteInfo/districts/${selectedState}`
        );
        
        // Log the response for debugging
        console.log("Districts response:", res.data);
        
        if (res.data.success) {
          if (res.data.districts && res.data.districts.length > 0) {
            setDistricts(res.data.districts);
          } else {
            // Handle empty districts array
            console.warn(`No districts found for ${selectedState}`);
            setDistricts([]);
            // Add a custom district option for testing purposes
            // Remove this in production if not needed
            setDistricts(["District data unavailable"]); 
          }
        } else {
          console.error("Failed to fetch districts:", res.data.message || "Unknown error");
          setDistricts([]);
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    
    fetchDistricts();
  }, [selectedState]);

  // When state changes, reset district and institute selections
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict("");
    setSelectedInstitute("");
    setInstitutes([]);
  };

  // When district changes, reset institute selection
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedInstitute("");
  };

  // Fetch Institutes when a District is Selected
  useEffect(() => {
    if (!selectedDistrict || !selectedState) {
      setInstitutes([]); // Reset institutes if no district is selected
      return;
    }

    const fetchInstitutes = async () => {
      setLoadingInstitutes(true);
      try {
        // Log the API call for debugging
        console.log(`Fetching institutes for state: ${selectedState}, district: ${selectedDistrict}`);
        
        const response = await axios.get(
          `https://major-project01-1ukh.onrender.com/api/instituteInfo/institutes/${selectedState}/${selectedDistrict}`
        );
        
        // Log the response for debugging
        console.log("Institutes response:", response.data);
        
        if (response.data.success) {
          setInstitutes(response.data.institutes); // Populate institute options
        } else {
          console.error("Failed to load institutes:", response.data.message || "Unknown error");
          setInstitutes([]);
        }
      } catch (error) {
        console.error("Error fetching institutes:", error);
        setInstitutes([]);
      } finally {
        setLoadingInstitutes(false);
      }
    };
    
    fetchInstitutes();
  }, [selectedDistrict, selectedState]);

  const handleSearch = async () => {
    if (!selectedState || !selectedDistrict || !selectedInstitute) {
      alert("Please select state, district, and institute!");
      return;
    }
    setLoadingDetails(true);
    try {
      const res = await axios.get(
        `https://major-project01-1ukh.onrender.com/api/instituteInfo/details?instituteName=${selectedInstitute}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/institute-details", {
          state: { instituteDetails: res.data.institute },
        });
      } else {
        alert(`No details available for ${selectedInstitute}.`);
      }
    } catch (err) {
      console.error("Error fetching institute details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(
        `https://major-project01-1ukh.onrender.com/api/notifications?instituteId=${user._id}`
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleNotificationModal = async () => {
    const isOpening = !showNotificationModal;
    setShowNotificationModal(isOpening);
    if (isOpening) {
      try {
        await axios.put(
          `https://major-project01-1ukh.onrender.com/api/notifications/mark-read/${user._id}`
        );
        fetchNotifications();
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`https://major-project01-1ukh.onrender.com/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const fetchInstituteInfo = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      const res = await axios.get("https://major-project01-1ukh.onrender.com/api/instituteInfo/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstituteInfo(res.data.data[0]);
      setShowInstituteModal(true);
    } catch (err) {
      console.error("Error fetching institute info:", err);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem("userToken");
      let res;
      if (status === "rejected") {
        res = await axios.delete(
          `https://major-project01-1ukh.onrender.com/api/requests/${requestId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await axios.patch(
          `https://major-project01-1ukh.onrender.com/api/requests/${requestId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (res.data.success) {
        if (status === "rejected") {
          setRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== requestId)
          );
        } else {
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === requestId
                ? { ...req, status: res.data.updated.status }
                : req
            )
          );
        }
      } else {
        alert(`Failed to ${status} request.`);
      }
    } catch (err) {
      console.error(`Error updating request status to ${status}`, err);
      alert(`Failed to ${status} request due to an error.`);
    }
  };
  
  const fetchConversations = useCallback(async () => {
    if (!user?._id) return;
    
    setLoadingConversations(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://major-project01-1ukh.onrender.com/api/chat/conversations/${user._id}?userType=institute`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.data.success) {
        setConversations(res.data.conversations);
      } else {
        console.log("No conversations found");
        setConversations([]);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  return (
    <div className="navbar-institute">
      <div className="navbar-logo">
        <Link to="/">🏫 Institute Finder</Link>
      </div>

      <div className="navbar-search">
        <select
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">
            {loadingStates ? "Loading States..." : "Select State"}
          </option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedState || loadingDistricts}
        >
          <option value="">
            {loadingDistricts 
              ? "Loading Districts..." 
              : districts.length === 0 
                ? "No districts available" 
                : "Select District"}
          </option>
          {districts.map((district, idx) => (
            <option key={idx} value={district}>
              {district}
            </option>
          ))}
        </select>

        <select
          value={selectedInstitute}
          onChange={(e) => setSelectedInstitute(e.target.value)}
          disabled={!selectedDistrict || loadingInstitutes}
        >
          <option value="">
            {loadingInstitutes 
              ? "Loading Institutes..." 
              : institutes.length === 0 
                ? "No institutes available" 
                : "Select Institute"}
          </option>
          {institutes.map((institute, idx) => (
            <option key={idx} value={institute.instituteName}>
              {institute.instituteName}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} disabled={loadingDetails || !selectedInstitute}>
          {loadingDetails ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-icon">
          <FaHome /><span className="tooltip">Home</span>
        </Link>

        <div
          className="nav-icon notification-wrapper"
          onClick={toggleNotificationModal}
        >
          <FaBell />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
        </div>
        
        <div 
          className="nav-icon msg-icon" 
          onClick={() => {
            fetchConversations();
            setShowMessageModal(true);
          }}
        >
          <FaComment />
          <span className="tooltip">Messages</span>
        </div>
        
        <div className="nav-icon">
          <FaEnvelopeOpenText
            onClick={fetchRequests}
            className="request-icon"
          />
          <span className="tooltip">Requests</span>
        </div>

        <div className="nav-icon" onClick={fetchInstituteInfo}>
          <FaEdit /><span className="tooltip">My Institute</span>
        </div>

        {user ? (
          <button onClick={logout} className="nav-icon">
            <FaSignOutAlt /><span className="tooltip">Logout</span>
          </button>
        ) : (
          <Link to="/login" className="nav-icon">
            <FaSignOutAlt /><span className="tooltip">Login</span>
          </Link>
        )}
      </div>

      {showNotificationModal && (
        <div className="notification-modal">
          <div className="notification-modal-content">
            <h2>Notifications</h2>
            <button className="close-btn" onClick={toggleNotificationModal}>
              X
            </button>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              notifications
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((notif) => (
                  <div className="notification-item" key={notif._id}>
                    <p>
                      <strong>{notif.studentName}</strong> from{" "}
                      <strong>{notif.instituteName}</strong> participated in your
                      event.
                    </p>
                    <p>Roll No: {notif.rollNo}</p>
                    <p>Gender: {notif.gender}</p>
                    <p>Contact: {notif.contact}</p>
                    {notif.idCardPath && (
                     <a
  href={
    notif.idCardPath.startsWith("http")
      ? notif.idCardPath
      : `https://major-project01-1ukh.onrender.com${notif.idCardPath}`
  }
  target="_blank"
  rel="noopener noreferrer"
>
  View ID Card
</a>


                    )}
                    <div className="notification-actions">
                      <button
                        onClick={() => {
                          setChatReceiverId(notif.studentId);
                          setChatReceiverName(notif.studentName);
                          setChatEventId(notif.eventId);
                          setShowChatBox(true);
                          setShowNotificationModal(false);
                        }}
                      >
                        Message
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notif._id)}
                        className="delete-btn"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="request-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="request-modal-content"
            >
              <div className="request-modal-header">
                <h2>Function Requests</h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="request-modal-close-btn"
                >
                  <FaTimes />
                </button>
              </div>

              {requests.length === 0 ? (
                <p className="request-modal-no-requests">No requests found.</p>
              ) : (
                <div className="request-modal-list">
                  {requests.map((req) => (
                    <div key={req._id} className="request-modal-item">
                      <h3 className="request-modal-item-title">{req.title}</h3>
                      <p className="request-modal-item-sender">
                        From: {req.senderName}
                      </p>
                      <p className="request-modal-item-message">{req.message}</p>
                      <p className="request-modal-item-status">
                        Status: {req.status}
                      </p>
                      {req.date && (
                        <p className="request-modal-item-date">
                          Date: {new Date(req.date).toLocaleDateString()}
                        </p>
                      )}
                      <div className="request-actions">
                        <button
                          onClick={() =>
                            handleUpdateRequestStatus(req._id, "accepted")
                          }
                          className="accept-button"
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateRequestStatus(req._id, "rejected")
                          }
                          className="reject-button"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showChatBox && (
        <ChatBox
          senderId={user._id}
          senderType="institute"
          senderName={user.name || "Institute"}
          receiverId={chatReceiverId}
          receiverName={chatReceiverName}
          eventId={chatEventId}
          onClose={() => setShowChatBox(false)}
        />
      )}

      {showInstituteModal && instituteInfo && (
        <div className="notification-modal">
          <div className="notification-modal-content">
            <h2>My Institute Info</h2>
            <button
              className="close-btn"
              onClick={() => setShowInstituteModal(false)}
            >
              X
            </button>
            <p>
              <strong>Name:</strong> {instituteInfo.instituteName}
            </p>
            <p>
              <strong>State:</strong> {instituteInfo.state}
            </p>
            <p>
              <strong>District:</strong> {instituteInfo.district}
            </p>
            <p>
              <strong>Email:</strong> {instituteInfo.email}
            </p>
            <p>
              <strong>Contact:</strong> {instituteInfo.contact}
            </p>
            <p>
              <strong>Address:</strong> {instituteInfo.address}
            </p>
            <p>
              <strong>Amenities:</strong> {instituteInfo.amenities}
            </p>
            {instituteInfo.mapUrl && (
              <p>
                <a
                  href={instituteInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Map
                </a>
              </p>
            )}
          </div>
        </div>
      )}
      
      {showMessageModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="message-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="message-modal-content"
            >
              <div className="message-modal-header">
                <h2>Messages</h2>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="message-modal-close-btn"
                >
                  <FaTimes />
                </button>
              </div>

              {loadingConversations ? (
                <div className="message-modal-loading">
                  <p>Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="message-modal-empty">
                  <p>No conversations yet.</p>
                </div>
              ) : (
                <div className="message-modal-list">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      className="message-modal-item"
                      onClick={() => {
                        setChatReceiverId(conversation.participantId);
                        setChatReceiverName(conversation.participantName);
                        setChatEventId(conversation.eventId);
                        setShowChatBox(true);
                        setShowMessageModal(false);
                      }}
                    >
                      <div className="message-avatar">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                      <div className="message-info">
                        <h3>{conversation.participantName}</h3>
                        <p className="message-preview">
                          {conversation.lastMessage && conversation.lastMessage.length > 30
                            ? `${conversation.lastMessage.substring(0, 30)}...`
                            : conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                      <div className="message-time">
                        {conversation.updatedAt && new Date(conversation.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default NavbarInstitute;