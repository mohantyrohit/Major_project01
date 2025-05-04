import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './CollegeDetails.css'; // Import the CSS file

const CollegeDetails = () => {
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const determineInstituteId = React.useCallback(() => {
    const instituteCreatorId = sessionStorage.getItem('instituteCreatorId');
    const currentInstituteId = sessionStorage.getItem('currentInstituteId');
    const locationStateInstituteId = location.state?.instituteId;
    
    console.log('Available IDs in storage:');
    console.log('- instituteCreatorId:', instituteCreatorId);
    console.log('- currentInstituteId:', currentInstituteId);
    console.log('- location state instituteId:', locationStateInstituteId);
    
    if (instituteCreatorId) {
      console.log('PRIORITIZED: Using instituteCreatorId from session storage:', instituteCreatorId);
      return instituteCreatorId;
    }
    
    if (locationStateInstituteId) {
      console.log('Using instituteId from location state:', locationStateInstituteId);
      return locationStateInstituteId;
    }
    
    if (currentInstituteId) {
      console.log('Using currentInstituteId from session storage:', currentInstituteId);
      return currentInstituteId;
    }
    
    if (id) {
      console.log('Using ID from URL parameter:', id);
      return id;
    }
    
    return null;
  }, [location.state, id]);
  
  const fetchCollegeDetails = React.useCallback(async (instituteId) => {
    try {
      console.log(`Fetching college details for institute: ${instituteId}`);
      const apiUrl = `https://major-project01-1ukh.onrender.com/api/college-details/institute/${instituteId}`;
      console.log(`Requesting URL: ${apiUrl}`);
      
      const response = await axios.get(apiUrl);
      console.log('College details fetched successfully:', response.data);
      
      setCollegeDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching college details: ', error);
      if (error.response) {
        console.log('Server response status:', error.response.status);
        console.log('Server response data:', error.response.data);
      }
      setError(true);
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const instituteId = determineInstituteId();
    if (instituteId) {
      fetchCollegeDetails(instituteId);
    } else {
      console.error('No institute ID found');
      setError(true);
      setLoading(false);
    }
  }, [id, location, determineInstituteId, fetchCollegeDetails]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h3>Loading college details...</h3>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading College Details</h2>
        <p>
          We couldn't load the college information at this time. Please try again later 
          or contact support if the problem persists.
        </p>
        <button className="home-button" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    );
  }
  
  if (!collegeDetails) {
    return (
      <div className="error-container">
        <h2>No College Information Found</h2>
        <p>
          We couldn't find any details for this college. The information may not have been 
          added yet or the college ID might be incorrect.
        </p>
        <button className="home-button" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="college-details-container">
      <div className="college-header">
        <h1 className="college-name">{collegeDetails.collegeName}</h1>
        <div className="college-motto">"{collegeDetails.motto}"</div>
      </div>
      
      <div className="basic-info">
        <div className="info-item">
          <span className="info-label">Type:</span>
          {collegeDetails.type}
        </div>
        <div className="info-item">
          <span className="info-label">Established:</span>
          {collegeDetails.yearOfEstablishment}
        </div>
        <div className="info-item">
          <span className="info-label">Accreditation:</span>
          {collegeDetails.accreditation}
        </div>
        <div className="info-item">
          <span className="info-label">Approval:</span>
          {collegeDetails.approval}
        </div>
      </div>
      
      <div className="contact-info">
        <h3>Contact Information</h3>
        <div className="contact-item">
          <span className="info-label">Address:</span>
          {collegeDetails.address}, {collegeDetails.city}, {collegeDetails.district}, {collegeDetails.state} - {collegeDetails.pincode}
        </div>
        <div className="contact-item">
          <span className="info-label">Phone:</span>
          {collegeDetails.phoneNumber}
        </div>
        <div className="contact-item">
          <span className="info-label">Email:</span>
          {collegeDetails.email}
        </div>
        <div className="contact-item">
          <span className="info-label">Website:</span>
          <a href={collegeDetails.website} target="_blank" rel="noopener noreferrer">
            {collegeDetails.website}
          </a>
        </div>
      </div>
      
      <div className="two-column">
        <div className="info-section">
          <h3>Vision</h3>
          <p>{collegeDetails.vision}</p>
        </div>
        
        <div className="info-section">
          <h3>Mission</h3>
          <p>{collegeDetails.mission}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Principal's Message</h3>
        <p>{collegeDetails.principalMessage}</p>
      </div>
      
      <div className="info-section">
        <h3>Academic Programs</h3>
        
        <div className="program-list">
          <div>
            <h4>Undergraduate Programs</h4>
            <div>
              {collegeDetails.undergraduatePrograms.split(',').map((program, index) => (
                <div className="program-item" key={index}>{program.trim()}</div>
              ))}
            </div>
          </div>
          
          <div>
            <h4>Postgraduate Programs</h4>
            <div>
              {collegeDetails.postgraduatePrograms.split(',').map((program, index) => (
                <div className="program-item" key={index}>{program.trim()}</div>
              ))}
            </div>
          </div>
          
          <div>
            <h4>Diploma Courses</h4>
            <div>
              {collegeDetails.diplomaCourses.split(',').map((course, index) => (
                <div className="program-item" key={index}>{course.trim()}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Departments</h3>
        <div className="department-list">
          {collegeDetails.departments.split(',').map((department, index) => (
            <div className="department-item" key={index}>{department.trim()}</div>
          ))}
        </div>
      </div>
      
      <div className="two-column">
        <div className="info-section">
          <h3>Rankings & Accreditations</h3>
          <p>{collegeDetails.rankings}</p>
        </div>
        
        <div className="info-section">
          <h3>Awards & Recognitions</h3>
          <p>{collegeDetails.awards}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Admissions</h3>
        
        <div className="two-column">
          <div>
            <h4>Admission Process</h4>
            <p>{collegeDetails.admissionProcess}</p>
          </div>
          
          <div>
            <h4>Entrance Exams</h4>
            <p>{collegeDetails.entranceExams}</p>
          </div>
        </div>
        
        <div className="two-column">
          <div>
            <h4>Eligibility Criteria</h4>
            <p>{collegeDetails.eligibilityCriteria}</p>
          </div>
          
          <div>
            <h4>Important Dates</h4>
            <p>{collegeDetails.importantDates}</p>
          </div>
        </div>
        
        <div>
          <h4>Scholarships</h4>
          <p>{collegeDetails.scholarships}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Placements</h3>
        
        <div className="two-column">
          <div className="placement-stats">
            <h4>Placement Statistics</h4>
            <p>{collegeDetails.placementStats}</p>
          </div>
          
          <div className="top-recruiters">
            <h4>Top Recruiters</h4>
            <p>{collegeDetails.topRecruiters}</p>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Student Life</h3>
        <div>
          <h4>Student Clubs & Societies</h4>
          <p>{collegeDetails.studentClubs}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Notable Alumni</h3>
        <p>{collegeDetails.notableAlumni}</p>
      </div>
    </div>
  );
};

export default CollegeDetails;