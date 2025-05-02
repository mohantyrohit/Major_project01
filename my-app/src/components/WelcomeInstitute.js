
import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import "./WelcomeInstitute.css";
import { FaPlusCircle, FaCalendarPlus, FaBuilding } from "react-icons/fa"; // Import icons

function WelcomeInstitute() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [ setInstitutes] = useState([]);
  const { verifyInstituteAccess } = useContext(UserContext);

  const [formData, setFormData] = useState({
    state: "",
    district: "",
    instituteName: "",
    description: "",
    institutePicture: null,
    nearestMallName: "",
    nearestMallEmbedUrl: "",
    medicineStoreName: "",
    medicineStoreEmbedUrl: "",
    bookstoreName: "",
    bookstoreEmbedUrl: "",
    atmName: "",
    atmEmbedUrl: "",
  });

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventDescription: "",
    organizerName: "",
    organizerPhoto: null,
    eventPhotos: null,
  });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        await verifyInstituteAccess();
        const token = localStorage.getItem("userToken");
        const response = await fetch("https://major-project01-1ukh.onrender.com/api/institute/getUserName", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.name || "Institute");
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Access error:", err);
        navigate("/login");
      }
    };

    fetchUserName();
  }, [verifyInstituteAccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEventInputChange = (e) => {
    const { name, value, files } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: name === "eventPhotos" ? files : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyInstituteAccess();
      const token = localStorage.getItem("userToken");
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch("https://major-project01-1ukh.onrender.com/api/instituteInfo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Institute information added successfully!");
        setInstitutes((prev) => [...prev, data.data]);
        setShowForm(false);
        setFormData({
          state: "",
          district: "",
          instituteName: "",
          description: "",
          institutePicture: null,
          nearestMallName: "",
          nearestMallEmbedUrl: "",
          medicineStoreName: "",
          medicineStoreEmbedUrl: "",
          bookstoreName: "",
          bookstoreEmbedUrl: "",
          atmName: "",
          atmEmbedUrl: "",
        });
      } else {
        alert(data.message || "Failed to submit institute information.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const instituteId = localStorage.getItem("instituteUserId");

      const formDataToSend = new FormData();
      formDataToSend.append("createdBy", instituteId);
      for (const key in eventData) {
        if (key === "eventPhotos") {
          Array.from(eventData.eventPhotos || []).forEach((file) => {
            formDataToSend.append("eventPhoto", file);
          });
        } else {
          formDataToSend.append(key, eventData[key]);
        }
      }

      const response = await fetch("https://major-project01-1ukh.onrender.com/api/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        setShowEventForm(false);
        setEventData({
          eventName: "",
          eventDate: "",
          eventDescription: "",
          organizerName: "",
          organizerPhoto: null,
          eventPhotos: null,
        });
      } else {
        alert(data.message || "Event creation failed.");
      }
    } catch (err) {
      console.error("Event error:", err);
    }
  };

  return (
    <div className="welcome-institute-container" style={{ backgroundImage: `url("/images/background.jpg")` }}>
      <div className="welcome-content">
        <h2 className="welcome-title">
          <FaBuilding className="welcome-icon" /> Welcome, {userName || "Guest"}!
        </h2>
        <p className="welcome-subtitle">Share updates and create events for your institute.</p>
        <div className="welcome-button-group">
          <button className="welcome-add-button" onClick={() => setShowForm(true)}>
            <FaPlusCircle className="button-icon" /> Add New Information
          </button>
          <button className="welcome-event-button" onClick={() => setShowEventForm(true)}>
            <FaCalendarPlus className="button-icon" /> Create Event
          </button>
        </div>
      </div>


      {showForm && (
        <div
          className={`form-overlay ${showForm ? 'active' : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="form-container">
            <h3 className="form-title">Add New Institute Information</h3>
            <form onSubmit={handleSubmit} className="institute-form">
              {[
                { label: "State", name: "state", type: "text" },
                { label: "District", name: "district", type: "text" },
                { label: "Institute Name", name: "instituteName", type: "text" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Institute Picture", name: "institutePicture", type: "file" },
                { label: "Nearest Mall Name", name: "nearestMallName", type: "text" },
                { label: "Nearest Mall Embed URL", name: "nearestMallEmbedUrl", type: "url" },
                { label: "Medicine Store Name", name: "medicineStoreName", type: "text" },
                { label: "Medicine Store Embed URL", name: "medicineStoreEmbedUrl", type: "url" },
                { label: "Bookstore Name", name: "bookstoreName", type: "text" },
                { label: "Bookstore Embed URL", name: "bookstoreEmbedUrl", type: "url" },
                { label: "ATM Name", name: "atmName", type: "text" },
                { label: "ATM Embed URL", name: "atmEmbedUrl", type: "url" },
              ].map(({ label, name, type }) => (
                <div key={name} className="form-group">
                  <label htmlFor={name} className="form-label">
                    {label}:
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="form-input form-textarea"
                      required
                    />
                  ) : (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      value={type === "file" ? undefined : formData[name]}
                      onChange={handleInputChange}
                      className={`form-input ${type === "file" ? "form-file" : ""}`}
                      required
                    />
                  )}
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Add Institute
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
   <button
  className="welcome-moreinfo-button"
  onClick={() => navigate("/college-details-form")}
>
  <FaPlusCircle className="button-icon" /> More Info
</button>

      {showEventForm && (
        <div
          className={`form-overlay ${showEventForm ? 'active' : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEventForm(false);
          }}
        >
          <div className="form-container">
            <h3 className="form-title">Create New Event</h3>
            <form onSubmit={handleEventSubmit} className="institute-form">
              <div className="form-group">
                <label htmlFor="eventName" className="form-label">
                  Event Name:
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleEventInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventDate" className="form-label">
                  Event Date:
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={eventData.eventDate}
                  onChange={handleEventInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventDescription" className="form-label">
                  Event Description:
                </label>
                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={eventData.eventDescription}
                  onChange={handleEventInputChange}
                  className="form-input form-textarea"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="organizerName" className="form-label">
                  Organizer Name:
                </label>
                <input
                  type="text"
                  id="organizerName"
                  name="organizerName"
                  value={eventData.organizerName}
                  onChange={handleEventInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="organizerPhoto" className="form-label">
                  Organizer Photo:
                </label>
                <input
                  type="file"
                  id="organizerPhoto"
                  name="organizerPhoto"
                  onChange={handleEventInputChange}
                  className="form-input form-file"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventPhotos" className="form-label">
                  Event Photos:
                </label>
                <input
                  type="file"
                  id="eventPhotos"
                  name="eventPhotos"
                  multiple
                  onChange={handleEventInputChange}
                  className="form-input form-file"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Create Event
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowEventForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       <Footer />
    </div>
  );
}

export default WelcomeInstitute;