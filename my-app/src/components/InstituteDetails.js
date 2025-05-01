// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { UserContext } from "../context/AuthContext";
// import "./InstituteDetails.css";
// import axios from "axios"; // Import axios for API calls

// // Star display component (non-interactive)
// const StarDisplay = ({ rating }) => {
//   const totalStars = 5;
//   const roundedRating = Math.round(rating);
//   return (
//     <>
//       {[...Array(totalStars)].map((_, index) => (
//         <span
//           key={index}
//           className={`star ${index < roundedRating ? "filled" : ""}`}
//         >
//           ★
//         </span>
//       ))}
//     </>
//   );
// };

// const InstituteDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { instituteDetails: initialInstituteDetails } = location.state || {};
//   const { user } = useContext(UserContext);
//   const [instituteDetails, setInstituteDetails] = useState(initialInstituteDetails);
//   const [reviews, setReviews] = useState([]);
//   const [reviewText, setReviewText] = useState("");
//   const [starRating, setStarRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [ setRequests] = useState([]); // State to hold requests
//   // 1️⃣ State for New Form Fields
//   const [requestName, setRequestName] = useState("");
//   const [requestMobile, setRequestMobile] = useState("");
//   const [requestTitle, setRequestTitle] = useState("");
//   const [requestContent, setRequestContent] = useState("");

//   // Fetch reviews
//   useEffect(() => {
//     const fetchReviews = async (instituteId) => {
//       if (!user) {
//         alert("Please log in to view reviews.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/reviews/${instituteId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${user.token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           if (response.status === 401) {
//             alert("Please log in to view reviews.");
//             navigate("/login");
//             return;
//           }
//           throw new Error("Failed to fetch reviews");
//         }

//         const data = await response.json();
//         setReviews(data || []);
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//       }
//     };

//     if (instituteDetails) {
//       fetchReviews(instituteDetails._id);
//     }
//   }, [instituteDetails, user, navigate]);

//   // Fetch requests for the institute (if the logged-in user is the institute)
//   useEffect(() => {
//     const fetchRequests = async (instituteId) => {
//       if (user?.isInstitute && user?._id === instituteId) {
//         try {
//           const response = await fetch(
//             `http://localhost:5000/api/requests/${instituteId}`,
//             {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${user.token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (!response.ok) {
//             throw new Error("Failed to fetch requests.");
//           }

//           const data = await response.json();
//           setRequests(data.requests || []);
//         } catch (error) {
//           console.error("Error fetching requests:", error);
//         }
//       }
//     };

//     if (instituteDetails) {
//       fetchRequests(instituteDetails.createdBy);
//     }
//   }, [instituteDetails, user, setRequests]);

//   // Submit review
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const reviewerName = user.isInstitute ? user.instituteName : user.name;

//       const requestBody = {
//         userName: reviewerName,
//         institute: instituteDetails._id,
//         reviewText,
//         starRating,
//       };

//       const response = await fetch(
//         "http://localhost:5000/api/reviews/submit",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to submit review");

//       const newReview = await response.json();
//       setReviews((prev) => [...prev, newReview]);
//       setReviewText("");
//       setStarRating(0);
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   // Submit Handler for Request Form (Corrected to include mobile)
//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/api/requests", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({
//           receiverId: instituteDetails.createdBy,
//           title: requestTitle,
//           message: requestContent,
//           date: new Date().toISOString(), // Optional: Send current date
//           senderMobile: requestMobile, // Include the mobile number
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to send request");
//       }

//       alert("Request sent successfully to the institute!");
//       setRequestName("");
//       setRequestMobile("");
//       setRequestTitle("");
//       setRequestContent("");
//     } catch (error) {
//       console.error("Error sending request:", error.message);
//       alert(error.message);
//     }
//   };

//   const handleStarClick = (rating) => setStarRating(rating);
//   const handleStarHover = (rating) => setHoverRating(rating);
//   const handleStarLeave = () => setHoverRating(0);

//   const handleViewEvents = () => {
//     navigate("/events", {
//       state: { instituteId: instituteDetails.createdBy },
//     });
//   };
//   const handleViewCollegeDetails = () => {
//     navigate("/college-details", {
//       state: { instituteId: instituteDetails._id },
//     });
//   };
//   const handleRemoveAmenityMap = async (type) => {
//     const embedKey = `${type}EmbedUrl`;
//     const nameKey = `${type}Name`;

//     try {
//       const token = localStorage.getItem("userToken");
//       const response = await axios.put(
//         `http://localhost:5000/api/instituteInfo/amenity-map/${instituteDetails._id}`,
//         {
//           embedUrlField: embedKey,
//           nameField: nameKey,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         alert(`Removed map for ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
//         setInstituteDetails((prevDetails) => ({
//           ...prevDetails,
//           [embedKey]: null,
//           [nameKey]: null,
//         }));
//       } else {
//         alert(`Failed to remove map for ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
//       }
//     } catch (error) {
//       console.error("Error removing amenity map:", error);
//       alert("An error occurred while removing the map.");
//     }
//   };

//   if (!instituteDetails) {
//     return (
//       <div>
//         No details available. Please search again.
//       </div>
//     );
//   }

//   return (
//     <div className="institute-details-container">
//       {/* Top Menu */}
//       <div className="top-menu">
//         <div className="hamburger" onClick={() => setShowDropdown((prev) => !prev)}>
//           ☰
//         </div>
//         {showDropdown && (
//           <div className="dropdown-menu">
//             <button onClick={handleViewCollegeDetails}>College Details</button>
//             <button onClick={handleViewEvents}>Events</button>
//             <button onClick={() => navigate(-1)}>Back</button>
//           </div>
//         )}
//         {!showDropdown && (
//           <button className="back-button" onClick={() => navigate(-1)}>
//             Back
//           </button>
//         )}
//       </div>

//       {/* Institute Info */}
//       <div className="details-header">
//         <h1>{instituteDetails.instituteName}</h1>
//         <p className="location-info">
//           <strong>{instituteDetails.state}</strong>, {instituteDetails.district}
//         </p>
//         {instituteDetails.institutePictureUrl && (
//           <div className="institute-image">
//             <img
//               src={`http://localhost:5000${instituteDetails.institutePictureUrl}`}
//               alt={instituteDetails.instituteName}
//               className="institute-photo"
//             />
//           </div>
//         )}
//       </div>

//       <div className="details-section">
//         <h2>About the Institute</h2>
//         <p>{instituteDetails.description || "No description available."}</p>
//       </div>

//       {/* Amenities */}
//       <div className="details-section">
//         <h2>Nearby Amenities</h2>
//         {["nearestMall", "atm", "medicineStore", "bookstore"].map((type) => {
//           const nameKey = `${type}Name`;
//           const embedKey = `${type}EmbedUrl`;
//           const title =
//             type === "atm"
//               ? "Nearest ATM"
//               : type === "medicineStore"
//               ? "Medicine Store"
//               : type === "bookstore"
//               ? "Bookstore"
//               : "Nearest Mall";

//           return (
//             <div key={type} className="amenity">
//               <h3>{title}</h3>
//               <p><strong>Name:</strong> {instituteDetails[nameKey] || "Not Available"}</p>
//               {instituteDetails[embedKey] ? (
//                 <iframe
//                   src={instituteDetails[embedKey]}
//                   title={`${title} Map`}
//                   width="100%"
//                   height="400"
//                   className="map-frame"
//                   style={{ border: "0" }}
//                   allowFullScreen=""
//                   loading="lazy"
//                 ></iframe>
//               ) : (
//                 <p className="no-map">Map link is not available for the {title.toLowerCase()}.</p>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Reviews */}
//       <div className="details-section">
//         <h2>Student Reviews</h2>
//         <ul className="review-list">
//           {reviews.length > 0 ? (
//             reviews
//               .filter(
//                 (review, index, self) =>
//                   index === self.findIndex((r) => r._id === review._id)
//               )
//               .map((review) => (
//                 <li key={`${review._id}-${review.createdAt}`} className="review-item">
//                   <StarDisplay rating={review.starRating} />
//                   <p>{review.reviewText}</p>
//                   <p><strong>User:</strong> {review.userName}</p>
//                   <p>
//                     <small>Posted on: {new Date(review.createdAt).toLocaleDateString()}</small>
//                   </p>
//                 </li>
//               ))
//           ) : (
//             <p>No reviews yet. Be the first to review!</p>
//           )}
//         </ul>

//         <form onSubmit={handleReviewSubmit} className="review-form">
//           <textarea
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             placeholder="Write your review here..."
//             required
//           ></textarea>

//           <div className="star-rating">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span
//                 key={star}
//                 className={`star ${star <= (hoverRating || starRating) ? "active" : ""}`}
//                 onClick={() => handleStarClick(star)}
//                 onMouseEnter={() => handleStarHover(star)}
//                 onMouseLeave={handleStarLeave}
//               >
//                 ★
//               </span>
//             ))}
//           </div>

//           <button type="submit">Submit Review</button>
//         </form>
//       </div>

//       {/* New Request Form */}
//       <div className="details-section">
//         <h2>Request a Function / Competition</h2>
//         <form onSubmit={handleRequestSubmit} className="review-form">
//           <input
//             type="text"
//             value={requestName}
//             onChange={(e) => setRequestName(e.target.value)}
//             placeholder="Your Name"
//             required
//           />
//           <input
//             type="tel"
//             value={requestMobile}
//             onChange={(e) => setRequestMobile(e.target.value)}
//             placeholder="Your Mobile Number"
//             required
//           />
//           <input
//             type="text"
//             value={requestTitle}
//             onChange={(e) => setRequestTitle(e.target.value)}
//             placeholder="Request Title"
//             required
//           />
//           <textarea
//             value={requestContent}
//             onChange={(e) => setRequestContent(e.target.value)}
//             placeholder="Write your request details..."
//             required
//           ></textarea>
//           <button type="submit">Send Request</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InstituteDetails;

import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import "./InstituteDetails.css";
import axios from "axios"; // Import axios for API calls

// Star display component (non-interactive)
const StarDisplay = ({ rating }) => {
  const totalStars = 5;
  const roundedRating = Math.round(rating);
  return (
    <>
      {[...Array(totalStars)].map((_, index) => (
        <span
          key={index}
          className={`star ${index < roundedRating ? "filled" : ""}`}
        >
          ★
        </span>
      ))}
    </>
  );
};

const InstituteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { instituteDetails: initialInstituteDetails } = location.state || {};
  const { user } = useContext(UserContext);
  const [instituteDetails, setInstituteDetails] = useState(initialInstituteDetails);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ setRequests] = useState([]); // State to hold requests
  // 1️⃣ State for New Form Fields
  const [requestName, setRequestName] = useState("");
  const [requestMobile, setRequestMobile] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestContent, setRequestContent] = useState("");

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async (instituteId) => {
      if (!user) {
        alert("Please log in to view reviews.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/${instituteId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            alert("Please log in to view reviews.");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (instituteDetails) {
      fetchReviews(instituteDetails._id);
    }
  }, [instituteDetails, user, navigate]);

  // Fetch requests for the institute (if the logged-in user is the institute)
  useEffect(() => {
    const fetchRequests = async (instituteId) => {
      if (user?.isInstitute && user?._id === instituteId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/requests/${instituteId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch requests.");
          }

          const data = await response.json();
          setRequests(data.requests || []);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      }
    };

    if (instituteDetails) {
      fetchRequests(instituteDetails.createdBy);
    }
  }, [instituteDetails, user, setRequests]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewerName = user.isInstitute ? user.instituteName : user.name;

      const requestBody = {
        userName: reviewerName,
        institute: instituteDetails._id,
        reviewText,
        starRating,
      };

      const response = await fetch(
        "http://localhost:5000/api/reviews/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
      setReviews((prev) => [...prev, newReview]);
      setReviewText("");
      setStarRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Submit Handler for Request Form (Corrected to include mobile)
  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          receiverId: instituteDetails.createdBy,
          title: requestTitle,
          message: requestContent,
          date: new Date().toISOString(), // Optional: Send current date
          senderMobile: requestMobile, // Include the mobile number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send request");
      }

      alert("Request sent successfully to the institute!");
      setRequestName("");
      setRequestMobile("");
      setRequestTitle("");
      setRequestContent("");
    } catch (error) {
      console.error("Error sending request:", error.message);
      alert(error.message);
    }
  };

  const handleStarClick = (rating) => setStarRating(rating);
  const handleStarHover = (rating) => setHoverRating(rating);
  const handleStarLeave = () => setHoverRating(0);

  const handleViewEvents = () => {
    navigate("/events", {
      state: { instituteId: instituteDetails.createdBy },
    });
  };
  const handleViewCollegeDetails = () => {
    navigate("/college-details", {
      state: { instituteId: instituteDetails._id },
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleRemoveAmenityMap = async (type) => {
    const embedKey = `${type}EmbedUrl`;
    const nameKey = `${type}Name`;

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `http://localhost:5000/api/instituteInfo/amenity-map/${instituteDetails._id}`,
        {
          embedUrlField: embedKey,
          nameField: nameKey,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert(`Removed map for ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        setInstituteDetails((prevDetails) => ({
          ...prevDetails,
          [embedKey]: null,
          [nameKey]: null,
        }));
      } else {
        alert(`Failed to remove map for ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      }
    } catch (error) {
      console.error("Error removing amenity map:", error);
      alert("An error occurred while removing the map.");
    }
  };

  if (!instituteDetails) {
    return (
      <div>
        No details available. Please search again.
      </div>
    );
  }

  return (
    <div className="institute-details-container">
      {/* Top Menu */}
      <div className="top-menu">
        <div className="hamburger" onClick={() => setShowDropdown((prev) => !prev)}>
          ☰
        </div>
        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={handleViewCollegeDetails}>College Details</button>
            <button onClick={handleViewEvents}>Events</button>
            <button onClick={() => navigate(-1)}>Back</button>
          </div>
        )}
        {!showDropdown && (
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
      </div>

      {/* Institute Info */}
      <div className="details-header">
        <h1>{instituteDetails.instituteName}</h1>
        <p className="location-info">
          <strong>{instituteDetails.state}</strong>, {instituteDetails.district}
        </p>
        {instituteDetails.institutePictureUrl && (
          <div className="institute-image">
            <img
              src={`http://localhost:5000${instituteDetails.institutePictureUrl}`}
              alt={instituteDetails.instituteName}
              className="institute-photo"
              />
          </div>
        )}
      </div>

      <div className="details-section">
        <h2>About the Institute</h2>
        <p>{instituteDetails.description || "No description available."}</p>
      </div>

      {/* Amenities */}
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
              <p><strong>Name:</strong> {instituteDetails[nameKey] || "Not Available"}</p>
              {instituteDetails[embedKey] ? (
                <iframe
                  src={instituteDetails[embedKey]}
                  title={`${title} Map`}
                  width="100%"
                  height="400"
                  className="map-frame"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              ) : (
                <p className="no-map">Map link is not available for the {title.toLowerCase()}.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Reviews */}
      <div className="details-section">
        <h2>Student Reviews</h2>
        <ul className="review-list">
          {reviews.length > 0 ? (
            reviews
              .filter(
                (review, index, self) =>
                  index === self.findIndex((r) => r._id === review._id)
              )
              .map((review) => (
                <li key={`${review._id}-${review.createdAt}`} className="review-item">
                  <StarDisplay rating={review.starRating} />
                  <p>{review.reviewText}</p>
                  <p><strong>User:</strong> {review.userName}</p>
                  <p>
                    <small>Posted on: {new Date(review.createdAt).toLocaleDateString()}</small>
                  </p>
                </li>
              ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </ul>

        <form onSubmit={handleReviewSubmit} className="review-form">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          ></textarea>

          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || starRating) ? "active" : ""}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              >
                ★
              </span>
            ))}
          </div>

          <button type="submit">Submit Review</button>
        </form>
      </div>

      {/* New Request Form */}
      <div className="details-section">
        <h2>Request a Function / Competition</h2>
        <form onSubmit={handleRequestSubmit} className="review-form">
          <input
            type="text"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <input
            type="tel"
            value={requestMobile}
            onChange={(e) => setRequestMobile(e.target.value)}
            placeholder="Your Mobile Number"
            required
          />
          <input
            type="text"
            value={requestTitle}
            onChange={(e) => setRequestTitle(e.target.value)}
            placeholder="Request Title"
            required
          />
          <textarea
            value={requestContent}
            onChange={(e) => setRequestContent(e.target.value)}
            placeholder="Write your request details..."
            required
          ></textarea>
          <button type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
};

export default InstituteDetails;