import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import "./InstituteDetails.css";

const MyInstituteDetails = () => {
  const { user } = useContext(UserContext);
  const [instituteDetails, setInstituteDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        const instituteUserId = sessionStorage.getItem("instituteUserId");

        if (!instituteUserId) {
          console.error("No instituteUserId found in sessionStorage");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `https://major-project01-1ukh.onrender.com/api/instituteInfo/${instituteUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch institute details");
        }

        const data = await response.json();
        setInstituteDetails(data);
      } catch (error) {
        console.error("Error fetching institute details:", error);
      }
    };

    if (user?.token) {
      fetchInstituteDetails();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!instituteDetails) {
    return <p>Loading your institute details...</p>;
  }

  return (
    <div className="institute-details">
      {/* Header Section */}
      <div className="details-header">
        <h1>{instituteDetails.instituteName}</h1>
        <p className="location-info">
          <strong>{instituteDetails.state}</strong>, {instituteDetails.district}
        </p>

        {instituteDetails.institutePictureUrl && (
          <div className="institute-image">
            <img
              src={`https://major-project01-1ukh.onrender.com${instituteDetails.institutePictureUrl}`}
              alt={instituteDetails.instituteName}
              className="institute-photo"
            />
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="details-section">
        <h2>About the Institute</h2>
        <p>{instituteDetails.description || "No description available."}</p>
      </div>

      {/* Amenities Section */}
      <div className="details-section">
        <h2>Nearby Amenities</h2>

        {["nearestMall", "atm", "medicineStore", "bookstore"].map((type) => {
          const nameKey = `${type}Name`;
          const embedKey = `${type}EmbedUrl`;
          const title =
            type === "atm"
              ? "Nearest ATM"
              : type === "medicineStore"
              ? "Medicine Store"
              : type === "bookstore"
              ? "Bookstore"
              : "Nearest Mall";

          return (
            <div key={type} className="amenity">
              <h3>{title}</h3>
              <p>
                <strong>Name:</strong>{" "}
                {instituteDetails[nameKey] || "Not Available"}
              </p>

              {instituteDetails[embedKey] ? (
                <iframe
                  src={instituteDetails[embedKey]}
                  title={`${title} Map`}
                  width="100%"
                  height="400"
                  className="map-frame"
                  style={{
                    border: "0",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              ) : (
                <p className="no-map">
                  Map link is not available for the {title.toLowerCase()}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="details-section button-group">
        <button
          onClick={() =>
            navigate("/update-institute-info", {
              state: { instituteDetails },
            })
          }
          className="update-button"
        >
          Update Institute Info
        </button>

        <button
          onClick={() =>
            navigate("/delete-institute-info", {
              state: { instituteId: instituteDetails._id },
            })
          }
          className="delete-button"
        >
          Delete Institute Info
        </button>
      </div>
    </div>
  );
};

export default MyInstituteDetails;