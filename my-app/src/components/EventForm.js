import React, { useState } from "react";
import "./EventForm.module.css";

function EventForm({ onSubmit, onCancel }) {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventDescription: "",
    eventPhotos: null,
    organizerName: "",
    organizerPhoto: null,
    organizerDescription: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "eventPhotos" || name === "organizerPhoto") {
      setEventData({ ...eventData, [name]: files });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDate", new Date(eventData.eventDate).toISOString());
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("organizerName", eventData.organizerName);
    formData.append("organizerDescription", eventData.organizerDescription);

    if (eventData.eventPhotos) {
      Array.from(eventData.eventPhotos).forEach((file) =>
        formData.append("eventPhoto", file)
      );
    }

    if (eventData.organizerPhoto) {
      formData.append("organizerPhoto", eventData.organizerPhoto[0]);
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const originalToken = localStorage.getItem("userToken");

    if (!originalToken) {
      alert("Unauthorized: Please log in.");
      window.location.href = "/login";
      return;
    }

    const formData = buildFormData();

    const postEvent = async (tokenToUse) => {
      return fetch("https://major-project01-1ukh.onrender.com/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: formData,
      });
    };

    try {
      let response = await postEvent(originalToken);

      if (response.status === 401) {
        // Try refreshing token
        const refreshRes = await fetch("https://major-project01-1ukh.onrender.com/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${originalToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!refreshRes.ok) throw new Error("Token refresh failed");

        const { token: newToken, user } = await refreshRes.json();
        localStorage.setItem("userToken", newToken);
        if (user?.signupType === "institute") {
          localStorage.setItem("instituteUserId", user.id);
        }

        response = await postEvent(newToken); // retry with new token
      }

      const resJson = await response.json();
      if (response.ok) {
        alert("Event submitted successfully!");
        onSubmit();
      } else {
        alert(`Failed to submit event: ${resJson.message}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An error occurred while submitting the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Event Name:
        <input
          type="text"
          name="eventName"
          value={eventData.eventName}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Event Date:
        <input
          type="date"
          name="eventDate"
          value={eventData.eventDate}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Event Description:
        <textarea
          name="eventDescription"
          value={eventData.eventDescription}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Event Photos:
        <input
          type="file"
          name="eventPhotos"
          onChange={handleInputChange}
          multiple
          required
        />
      </label>

      <label>
        Organizer Name:
        <input
          type="text"
          name="organizerName"
          value={eventData.organizerName}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Organizer Photo:
        <input
          type="file"
          name="organizerPhoto"
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Organizer Description:
        <textarea
          name="organizerDescription"
          value={eventData.organizerDescription}
          onChange={handleInputChange}
        />
      </label>

      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EventForm;
