import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import NavbarInstitute from "../NavbarInstitute";
import Home from "../Home";
import Login from "../Login";
import Signup from "../Signup";
import Welcome from "../Welcome";
import WelcomeInstitute from "../WelcomeInstitute";
import InstituteDetails from "../InstituteDetails";
import EventForm from "../EventForm";
import EventsPage from "../EventsPage";
import MyInstituteDetails from "../MyInstituteDetails"; // ✅ New import
import AboutUs from "../AboutUs"; 
import ContactUs from "../ContactUs"; 
import CollegeDetailsForm from "../CollegeDetailsForm";



const App = () => {
  const location = useLocation();

  // Check if the current route is for WelcomeInstitute and its subroutes
  const showInstituteNavbar = location.pathname.toLowerCase().includes("/welcomeinstitute");

  // Event Form Submission Handler
  const handleEventSubmit = async (eventData) => {
    console.log("Submitted data:", eventData);

    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDate", eventData.eventDate);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("eventPhoto", eventData.eventPhoto);

    if (eventData.organizerName) {
      formData.append("organizerName", eventData.organizerName);
    }
    if (eventData.organizerPhoto) {
      formData.append("organizerPhoto", eventData.organizerPhoto);
    }
    if (eventData.organizerDescription) {
      formData.append("organizerDescription", eventData.organizerDescription);
    }

    try {
      const response = await fetch("https://major-project01-1ukh.onrender.com/api/events", {
        method: "POST",
        body: formData,
      });
      

      const result = await response.json();
      if (response.ok) {
        alert("Event submitted successfully!");
      } else {
        alert(`Failed to submit event: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("An error occurred while submitting the event.");
    }
  };

  const handleCancel = () => {
    alert("Event submission canceled.");
  };

  return (
    <>
      {/* Conditionally render Navbar */}
      {showInstituteNavbar ? <NavbarInstitute /> : <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/welcomeinstitute" element={<WelcomeInstitute />} />
        <Route path="/institute-details" element={<InstituteDetails />} />
        <Route
          path="/create-event"
          element={<EventForm onSubmit={handleEventSubmit} onCancel={handleCancel} />}
        />
        <Route path="/events" element={<EventsPage />} />
        
        {/* ✅ Add route to show institute’s own details */}
        <Route path="/my-institute-details" element={<MyInstituteDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/college-details-form" element={<CollegeDetailsForm />} />

      </Routes>
    </>
  );
};

export default App;
