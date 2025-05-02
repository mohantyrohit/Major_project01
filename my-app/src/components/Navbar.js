import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/AuthContext"; // Import UserContext for managing user state
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaBell, FaSignOutAlt, FaArrowLeft } from "react-icons/fa"; // Import FaArrowLeft
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext); // Access global user state

  // State Variables
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

  const navigate = useNavigate();

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  // Fetch States on Component Mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch("https://major-project01-1ukh.onrender.com/api/instituteInfo/states");
        const data = await response.json();
        if (data.success) {
          setStates(data.states);
        } else {
          alert("Failed to load states.");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        alert("An error occurred while fetching states.");
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch Districts when a State is Selected
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const response = await fetch(`https://major-project01-1ukh.onrender.com/api/instituteInfo/districts/${selectedState}`);
        const data = await response.json();
        if (data.success) {
          setDistricts(data.districts);
        } else {
          alert("Failed to load districts.");
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        alert("An error occurred while fetching districts.");
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // Fetch Institutes when a District is Selected
  useEffect(() => {
    if (!selectedDistrict) {
      setInstitutes([]); // Reset institutes if no district is selected
      return;
    }

    const fetchInstitutes = async () => {
      setLoadingInstitutes(true);
      try {
        const response = await fetch(
          `https://major-project01-1ukh.onrender.com/api/instituteInfo/institutes/${selectedState}/${selectedDistrict}`
        );
        const data = await response.json();
        if (data.success) {
          setInstitutes(data.institutes); // Populate institute options
        } else {
          alert("Failed to load institutes.");
        }
      } catch (error) {
        console.error("Error fetching institutes:", error);
        alert("An error occurred while fetching institutes.");
      } finally {
        setLoadingInstitutes(false);
      }
    };
    fetchInstitutes();
  }, [selectedDistrict, selectedState]);

  // Handle Search
  const handleSearch = async () => {
    if (!selectedState || !selectedDistrict || !selectedInstitute) {
      alert("Please select state, district, and institute!");
      return;
    }

    setLoadingDetails(true); // Show loading state
    try {
      console.log(`Fetching details for institute: ${selectedInstitute}`);
      const response = await fetch(
        `https://major-project01-1ukh.onrender.com/api/instituteInfo/details?instituteName=${selectedInstitute}`,
        { credentials: "include" } // Include credentials for user session
      );
      const data = await response.json();
      setLoadingDetails(false); // Hide loading state

      if (data.success) {
        // Redirect to the details page and pass the institute details
        navigate("/institute-details", { state: { instituteDetails: data.institute } });
      } else {
        alert("Failed to fetch institute details: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching institute details:", error);
      alert("An error occurred while fetching details.");
      setLoadingDetails(false); // Hide loading state
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://major-project01-1ukh.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("User logged out successfully.");
        logout(); // Use the logout function from context
        localStorage.removeItem("userToken");
        navigate("/"); // Redirect after logout
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <nav className="navbar">
      {/* Back Button */}
      {navigate.length > 1 && (
        <button onClick={handleGoBack} className="navbar-back-button">
          <FaArrowLeft />
        </button>
      )}

      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">🏫 Institute Finder</Link>
      </div>

      {/* Search Filters */}
      <div className="navbar-search">
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">{loadingStates ? "Loading States..." : "Select State"}</option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
          <option value="">{loadingDistricts ? "Loading Districts..." : "Select District"}</option>
          {districts.map((district, idx) => (
            <option key={idx} value={district}>
              {district}
            </option>
          ))}
        </select>

        <select
          value={selectedInstitute}
          onChange={(e) => setSelectedInstitute(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">{loadingInstitutes ? "Loading Institutes..." : "Select Institute"}</option>
          {institutes.map((institute, idx) => (
            <option key={idx} value={institute.instituteName}>
              {institute.instituteName}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} disabled={!selectedState || !selectedDistrict || !selectedInstitute || loadingDetails}>
          {loadingDetails ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/" className="nav-icon">
          <FaHome />
          <span className="tooltip">Home</span>
        </Link>
        {user ? (
          <button onClick={handleLogout} className="nav-icon">
            <FaSignOutAlt />
            <span className="tooltip">Logout</span>
          </button>
        ) : (
          <Link to="/login" className="nav-icon">
            <FaUser />
            <span className="tooltip">Login</span>
          </Link>
        )}
        <Link to="/notifications" className="nav-icon">
          <FaBell />
          {/* You can add a notification badge here if needed */}
          <span className="tooltip">Notifications</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;