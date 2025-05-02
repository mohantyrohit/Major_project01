import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EventsPage.css"; // Ensure you are using this CSS

function EventsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [formData, setFormData] = useState({
    institute: "",
    rollNo: "",
    gender: "male",
    contact: "",
    idCard: null,
  });

  // Helper for token retrieval
  const getToken = () => localStorage.getItem("userToken");

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = getToken();
      if (!token) {
        alert("Missing login token. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://major-project01-1ukh.onrender.com/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.name) {
          setStudentName(data.name);
        } else {
          alert("Failed to fetch student info.");
        }
      } catch (err) {
        console.error("Error fetching student details:", err);
        alert("Error fetching student data.");
      }
    };

    fetchStudentDetails();
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = getToken();
      const instituteId =
        location.state?.instituteId || localStorage.getItem("instituteUserId");

      if (!instituteId) {
        alert("Missing institute ID. Redirecting...");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://major-project01-1ukh.onrender.com/api/events/institute/${instituteId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          alert(data.message || "Failed to load events.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [location.state, navigate]);

  const openForm = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setFormData({
      institute: "",
      rollNo: "",
      gender: "male",
      contact: "",
      idCard: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName) {
      alert("Student name is missing. Please wait for it to load.");
      return;
    }

    const organizerInstituteId =
      selectedEvent?.createdBy?._id || selectedEvent?.createdBy;

    if (!organizerInstituteId) {
      alert("Organizer institute ID not found.");
      return;
    }

    const data = new FormData();
    data.append("name", studentName);
    data.append("institute", formData.institute);
    data.append("rollNo", formData.rollNo);
    data.append("gender", formData.gender);
    data.append("contact", formData.contact);
    data.append("idCard", formData.idCard);
    data.append("eventId", selectedEvent._id);
    data.append("organizerInstituteId", organizerInstituteId);

    const token = getToken();

    try {
      const response = await fetch(
        "https://major-project01-1ukh.onrender.com/api/events/participate",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.message.includes("already")) {
          alert("❗ You have already submitted the participation form for this event.");
        } else {
          alert(result.message || "Submission failed");
        }
        return;
      }

      alert("✅ Participation submitted successfully!");
      closeForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading events...</div>;

  return (
    <div className="events-page">
      <h1 className="page-title">Explore Events</h1>
      {events.length === 0 ? (
        <p className="no-events">No exciting events are available right now. Stay tuned!</p>
      ) : (
        <div className="events-grid">
          {events.map((event, idx) => (
            <div key={idx} className="event-card">
              <h3 className="event-title">{event.eventName}</h3>
              <p className="event-date">
                <i className="fas fa-calendar-alt"></i>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="event-description">{event.eventDescription}</p>
              <p className="event-organizer">
                <i className="fas fa-user-tie"></i> {event.organizerName}
              </p>

              {event.organizerPhoto && (
                <div className="organizer-image-container">
                  <img
                    src={`https://major-project01-1ukh.onrender.com/${event.organizerPhoto.replace(/^\/?/, "")}`}
                    alt={event.organizerName}
                    className="organizer-image"
                  />
                </div>
              )}

              {event.eventPhotos?.length > 0 && (
                <div className="photo-gallery">
                  <h4 className="gallery-title">Event Photos:</h4>
                  {event.eventPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={`https://major-project01-1ukh.onrender.com/${photo.replace(/^\/?/, "")}`}
                      alt={`Event ${i + 1}`}
                      className="event-photo"
                    />
                  ))}
                </div>
              )}

              <button onClick={() => openForm(event)} className="btn-primary participate-button">
                <i className="fas fa-ticket-alt"></i> Participate
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={`modal ${showForm ? 'show' : ''}`} onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Participate in {selectedEvent.eventName}</h3>
            <form onSubmit={handleSubmit} className="participation-form">
              <div className="form-group">
                <label htmlFor="studentName" className="form-label">
                  Name:
                </label>
                <input type="text" id="studentName" value={studentName} readOnly className="form-input-readonly" />
              </div>
              <div className="form-group">
                <label htmlFor="institute" className="form-label">
                  Institute Name:
                </label>
                <input
                  type="text"
                  id="institute"
                  name="institute"
                  required
                  value={formData.institute}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="rollNo" className="form-label">
                  Roll Number:
                </label>
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  required
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender:
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contact" className="form-label">
                  Contact Number:
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="idCard" className="form-label">
                  Upload ID Card:
                </label>
                <input
                  id="idCard"
                  name="idCard"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  required
                  onChange={handleInputChange}
                  className="form-file-upload"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button type="button" onClick={closeForm} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;
