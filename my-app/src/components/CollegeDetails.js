import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './CollegeDetails.css'; // Import the CSS file

const CollegeDetails = () => {
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Improved JWT token parsing function
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  // Function to determine the institute ID
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

  // Function to fetch chat history
  const fetchChatHistory = React.useCallback(async (instituteId, email) => {
    try {
      console.log(`Fetching chat history for user ${email} with institute ${instituteId}`);
      const studentToken = sessionStorage.getItem('studentToken');
      const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};
      
      const response = await axios.get(
        `https://major-project01-1ukh.onrender.com/api/chat/history/${instituteId}/${encodeURIComponent(email)}`,
        { headers }
      );
      
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        console.log('Chat history found:', response.data.messages);
        setMessages(response.data.messages);
      } else {
        console.log('No existing chat history found');
        // Add welcome message only if no messages are displayed yet
        if (messages.length === 0 && collegeDetails?.collegeName) {
          setMessages([
            {
              sender: 'institute',
              text: `Hello ${userName}, welcome to ${collegeDetails.collegeName} chat support! How can we assist you today?`,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      if (error.response && error.response.status !== 404) {
        console.log('Error response data:', error.response.data);
      }
      // 404 is expected if no chat history exists yet, so we don't need to handle it specially
      
      // Add welcome message even if history fetch fails
      if (messages.length === 0 && collegeDetails?.collegeName) {
        setMessages([
          {
            sender: 'institute',
            text: `Hello ${userName}, welcome to ${collegeDetails.collegeName} chat support! How can we assist you today?`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [messages, userName, collegeDetails]);

  // Enhanced student authentication checking
  useEffect(() => {
    const studentToken = sessionStorage.getItem('studentToken');
    const loggedInStudentName = sessionStorage.getItem('studentName');
    const loggedInStudentEmail = sessionStorage.getItem('studentEmail');
    const storedStudentId = sessionStorage.getItem('studentId');
    
    console.log('Authentication data check:');
    console.log('- studentToken exists:', !!studentToken);
    console.log('- storedStudentId:', storedStudentId);
    
    let extractedStudentId = null;
    
    if (studentToken) {
      try {
        // Attempt to decode JWT token
        const tokenData = parseJwt(studentToken);
        console.log('Decoded student token data:', tokenData);
        
        // Extract id from token with multiple fallback options
        if (tokenData) {
          // Try multiple possible field names for the student ID
          extractedStudentId = tokenData.studentId || tokenData.id || tokenData._id || tokenData.userId || null;
          console.log('Extracted student ID from token:', extractedStudentId);
          
          // Set user info from token if available
          if (tokenData.name) setUserName(tokenData.name);
          if (tokenData.email) setUserEmail(tokenData.email);
        }
      } catch (error) {
        console.error('Error working with student token:', error);
      }
    }
    
    // Set student ID with priority: token > session storage
    const finalStudentId = extractedStudentId || storedStudentId || null;
    console.log('Final student ID being set:', finalStudentId);
    setStudentId(finalStudentId);
    
    // Auto-populate name and email if available from session storage (if not already set from token)
    if (!userName && loggedInStudentName) setUserName(loggedInStudentName);
    if (!userEmail && loggedInStudentEmail) setUserEmail(loggedInStudentEmail);
    
    // Check for previously initialized chat state
    const chatInitialized = sessionStorage.getItem(`chatInitialized_${determineInstituteId()}_${loggedInStudentEmail || extractedStudentId}`);
    if (chatInitialized === 'true') {
      console.log('Chat previously initialized, restoring state');
      setIsChatInitialized(true);
    }
    
  }, [userName, userEmail, determineInstituteId]);

  const fetchCollegeDetails = React.useCallback(async (instituteId) => {
    try {
      console.log(`Fetching college details for institute: ${instituteId}`);
      const apiUrl = `https://major-project01-1ukh.onrender.com/api/college-details/institute/${instituteId}`;
      console.log(`Requesting URL: ${apiUrl}`);
      
      // Add auth token if available
      const studentToken = sessionStorage.getItem('studentToken');
      const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};
      
      const response = await axios.get(apiUrl, { headers });
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
  }, [determineInstituteId, fetchCollegeDetails]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load chat history automatically on component mount if chat was previously initialized
  useEffect(() => {
    const instituteId = determineInstituteId();
    
    // If already initialized and we have userEmail, fetch chat history
    if (isChatInitialized && userEmail) {
      fetchChatHistory(instituteId, userEmail);
    }
  }, [isChatInitialized, userEmail, determineInstituteId, fetchChatHistory]);

  const initializeChat = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      alert('Please provide your name and email to start the chat.');
      return;
    }

    setIsChatInitialized(true);
    const instituteId = determineInstituteId();
    
    // Store initialization state in session storage
    const chatStateKey = `chatInitialized_${instituteId}_${userEmail}`;
    sessionStorage.setItem(chatStateKey, 'true');
    
    // Only load chat history if we don't already have messages
    if (messages.length === 0) {
      // Load existing chat history if available
      await fetchChatHistory(instituteId, userEmail);
    }
    
    // Notify the institute about this chat session via API, with proper error handling
    try {
      // Log all data being sent, including studentId
      console.log('Initializing chat with data:', {
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null,  // Make sure to send null if undefined
        collegeName: collegeDetails?.collegeName
      });
      
      // Add auth token if available
      const studentToken = sessionStorage.getItem('studentToken');
      const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};
      
      // Always include studentId in the request payload, even if it's null
      const response = await axios.post('https://major-project01-1ukh.onrender.com/api/chat/initialize', {
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null,  // Ensure we send null if undefined/falsy
        collegeName: collegeDetails?.collegeName
      }, { headers });
      
      console.log('Chat initialized successfully with server, response:', response.data);
    } catch (error) {
      console.error('Error initializing chat session:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      }
      
      // We don't need to show an error to the user or reset the state
      // since the chat can still function locally even if the server notification failed
      console.log('Continuing with local chat functionality despite server error');
    }
  };

  // Send message function with explicit student ID handling
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message to local state immediately for UI responsiveness
    const userMessage = {
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Store message text before clearing input
    const messageToSend = newMessage;
    setNewMessage('');

    // Determine the institute ID
    const instituteId = determineInstituteId();
    
    try {
      // Log all data being sent, focusing on studentId
      console.log('Sending message to institute with student data:', {
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null, // Log the actual value
        message: messageToSend,
        collegeName: collegeDetails?.collegeName
      });
      
      // Add auth token if available
      const studentToken = sessionStorage.getItem('studentToken');
      const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};
      
      // Send message to backend with studentId explicitly included
      const response = await axios.post('https://major-project01-1ukh.onrender.com/api/chat/message', {
        instituteId,
        userName,
        userEmail,
        studentId: studentId || null, // Explicitly send null if undefined/falsy
        message: messageToSend,
        collegeName: collegeDetails?.collegeName
      }, { headers });
      
      console.log('Message sent successfully, response:', response.data);
      
      // Check if we got responses in the returned data
      if (response.data && response.data.messages) {
        // Find the latest institute message in the response
        const instituteMessages = response.data.messages.filter(msg => msg.sender === 'institute');
        if (instituteMessages.length > 0) {
          // Get the most recent institute message
          const latestMessage = instituteMessages[instituteMessages.length - 1];
          
          // Add it to our local state if it's not already there
          const messageExists = messages.some(msg => 
            msg.sender === 'institute' && msg.text === latestMessage.text
          );
          
          if (!messageExists) {
            const instituteResponse = {
              sender: 'institute',
              text: latestMessage.text,
              timestamp: latestMessage.timestamp || new Date().toISOString()
            };
            setMessages(prevMessages => [...prevMessages, instituteResponse]);
          }
        } else {
          // If no institute message in response, add a "fallback" response
          simulateInstituteResponse(messageToSend);
        }
      } else {
        // If no messages in response, add a "fallback" response
        simulateInstituteResponse(messageToSend);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      }
      
      // Show error message to user
      const errorMessage = {
        sender: 'institute',
        text: "Sorry, we couldn't deliver your message due to a technical issue. Please try again later.",
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      // Additionally, simulate a normal response so the chat feels functional
      // even when there are backend issues
      simulateInstituteResponse(messageToSend);
    }
  };

  // Helper function to simulate institute response when backend fails
  const simulateInstituteResponse = (message) => {
    setTimeout(() => {
      const instituteResponse = {
        sender: 'institute',
        text: getAutomaticResponse(message),
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, instituteResponse]);
    }, 1000);
  };

  // This is a temporary function until you implement real-time messaging
  const getAutomaticResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('admission') || lowerMsg.includes('apply')) {
      return `Thank you for your interest in admissions. Please visit our admission portal on our website or call us at ${collegeDetails.phoneNumber} for detailed information about the application process.`;
    } else if (lowerMsg.includes('fee') || lowerMsg.includes('cost') || lowerMsg.includes('tuition')) {
      return 'Our fee structure varies by program. We can email you the detailed fee structure for your program of interest. Could you please specify which program you\'re interested in?';
    } else if (lowerMsg.includes('scholarship')) {
      return 'We offer various merit-based and need-based scholarships. Eligibility criteria and application details can be found on our website under the Scholarships section.';
    } else if (lowerMsg.includes('hostel') || lowerMsg.includes('accommodation')) {
      return 'Yes, we provide on-campus accommodation for both boys and girls with modern amenities and security. The allocation is based on first-come-first-serve basis after admission.';
    } else {
      return 'Thank you for your message. Our team will get back to you shortly with more information. If this is urgent, please call us directly at our helpline.';
    }
  };

  const renderFacilities = () => {
    if (!collegeDetails.facilities || collegeDetails.facilities.length === 0) {
      return <p>Information not available</p>;
    }
    
    return (
      <div className="facilities-list">
        {collegeDetails.facilities.map((facility, index) => (
          <div className="facility-item" key={index}>
            <span className="facility-icon">✓</span> {facility}
          </div>
        ))}
      </div>
    );
  };

  // Modified closeChatbox function to only hide the chatbox without clearing messages
  const closeChatbox = () => {
    setShowChatbox(false);
    // Do not reset messages or chat initialization state
  };
  
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
        <button 
          className="contact-button"
          onClick={() => setShowChatbox(!showChatbox)}
        >
          {showChatbox ? 'Close Chat' : 'Contact Us'}
        </button>
      </div>
      
      {/* Chat Interface */}
      {showChatbox && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h3>Chat with {collegeDetails.collegeName}</h3>
            <button className="close-chat-button" onClick={closeChatbox}>×</button>
          </div>

          {!isChatInitialized ? (
            <div className="chat-initialization-form">
              <p>Please provide your details to start the chat</p>
              {studentId && (
                <div className="logged-in-notice">
                  <p>You are logged in as a registered student.</p>
                  <p>Student ID: {studentId}</p>
                </div>
              )}
              <form onSubmit={initializeChat}>
                <div className="form-group">
                  <label htmlFor="userName">Your Name:</label>
                  <input 
                    type="text" 
                    id="userName" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userEmail">Email:</label>
                  <input 
                    type="email" 
                    id="userEmail" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                </div>
                
                <button type="submit" className="start-chat-button">Start Chat</button>
              </form>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === 'user' ? 'user-message' : 'institute-message'}`}
                  >
                    <div className="message-content">{msg.text}</div>
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={sendMessage} className="chat-input-form">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  className="chat-input"
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </>
          )}
        </div>
      )}
      
      {/* College details sections - No changes needed here */}
      <div className="basic-info">
        <div className="info-item">
          <span className="info-label">Type:</span>
          {collegeDetails.type || 'Not specified'}
        </div>
        <div className="info-item">
          <span className="info-label">Established:</span>
          {collegeDetails.yearOfEstablishment || 'Not specified'}
        </div>
        <div className="info-item">
          <span className="info-label">Accreditation:</span>
          {collegeDetails.accreditation || 'Not specified'}
        </div>
        <div className="info-item">
          <span className="info-label">Approval:</span>
          {collegeDetails.approval || 'Not specified'}
        </div>
      </div>
      
      {/* The rest of the component remains unchanged */}
      <div className="contact-info">
        <h3>Contact Information</h3>
        <div className="contact-item">
          <span className="info-label">Address:</span>
          {collegeDetails.address || 'Not available'}, 
          {collegeDetails.city ? ` ${collegeDetails.city},` : ''} 
          {collegeDetails.district ? ` ${collegeDetails.district},` : ''} 
          {collegeDetails.state ? ` ${collegeDetails.state}` : ''} 
          {collegeDetails.pincode ? ` - ${collegeDetails.pincode}` : ''}
        </div>
        <div className="contact-item">
          <span className="info-label">Phone:</span>
          {collegeDetails.phoneNumber || 'Not available'}
        </div>
        <div className="contact-item">
          <span className="info-label">Email:</span>
          {collegeDetails.email || 'Not available'}
        </div>
        <div className="contact-item">
          <span className="info-label">Website:</span>
          {collegeDetails.website ? (
            <a href={collegeDetails.website} target="_blank" rel="noopener noreferrer">
              {collegeDetails.website}
            </a>
          ) : 'Not available'}
        </div>
      </div>
      
      <div className="two-column">
        <div className="info-section">
          <h3>Vision</h3>
          <p>{collegeDetails.vision || 'Information not available'}</p>
        </div>
        
        <div className="info-section">
          <h3>Mission</h3>
          <p>{collegeDetails.mission || 'Information not available'}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Principal's Message</h3>
        <p>{collegeDetails.principalMessage || 'Information not available'}</p>
      </div>
      
      <div className="info-section">
        <h3>Academic Programs</h3>
        
        <div className="program-list">
          <div>
            <h4>Undergraduate Programs</h4>
            <div>
              {collegeDetails.undergraduatePrograms ? 
                collegeDetails.undergraduatePrograms.split(',').map((program, index) => (
                  <div className="program-item" key={index}>{program.trim()}</div>
                )) : 
                <p>No undergraduate programs listed</p>
              }
            </div>
          </div>
          
          <div>
            <h4>Postgraduate Programs</h4>
            <div>
              {collegeDetails.postgraduatePrograms ? 
                collegeDetails.postgraduatePrograms.split(',').map((program, index) => (
                  <div className="program-item" key={index}>{program.trim()}</div>
                )) : 
                <p>No postgraduate programs listed</p>
              }
            </div>
          </div>
          
          <div>
            <h4>Diploma Courses</h4>
            <div>
              {collegeDetails.diplomaCourses ? 
                collegeDetails.diplomaCourses.split(',').map((course, index) => (
                  <div className="program-item" key={index}>{course.trim()}</div>
                )) : 
                <p>No diploma courses listed</p>
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Departments</h3>
        <div className="department-list">
          {collegeDetails.departments ? 
            collegeDetails.departments.split(',').map((department, index) => (
              <div className="department-item" key={index}>{department.trim()}</div>
            )) : 
            <p>No departments listed</p>
          }
        </div>
      </div>

      <div className="info-section">
        <h3>Campus Facilities</h3>
        {renderFacilities()}
      </div>
      
      <div className="two-column">
        <div className="info-section">
          <h3>Rankings & Accreditations</h3>
          <p>{collegeDetails.rankings || 'Information not available'}</p>
        </div>
        
        <div className="info-section">
          <h3>Awards & Recognitions</h3>
          <p>{collegeDetails.awards || 'Information not available'}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Admissions</h3>
        
        <div className="two-column">
          <div>
            <h4>Admission Process</h4>
            <p>{collegeDetails.admissionProcess || 'Information not available'}</p>
          </div>
          
          <div>
            <h4>Entrance Exams</h4>
            <p>{collegeDetails.entranceExams || 'Information not available'}</p>
          </div>
        </div>
        
        <div className="two-column">
          <div>
            <h4>Eligibility Criteria</h4>
            <p>{collegeDetails.eligibilityCriteria || 'Information not available'}</p>
          </div>
          
          <div>
            <h4>Important Dates</h4>
            <p>{collegeDetails.importantDates || 'Information not available'}</p>
          </div>
        </div>
        
        <div>
          <h4>Scholarships</h4>
          <p>{collegeDetails.scholarships || 'Information not available'}</p>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Placements</h3>
        
        <div className="two-column">
          <div className="placement-stats">
            <h4>Placement Statistics</h4>
            <p>{collegeDetails.placementStats || 'Information not available'}</p>
          </div>
          
          <div className="top-recruiters">
            <h4>Top Recruiters</h4>
            <div className="recruiters-list">
              {collegeDetails.topRecruiters ? 
                collegeDetails.topRecruiters.split(',').map((recruiter, index) => (
                  <div className="recruiter-item" key={index}>{recruiter.trim()}</div>
                )) : 
                <p>Information not available</p>
              }
            </div>
          </div>                                                                                
        </div>
      </div>
      
      <div className="info-section">
        <h3>Student Life</h3>
        <div>
          <h4>Student Clubs & Societies</h4>
          <div className="clubs-list">
            {collegeDetails.studentClubs ? 
              collegeDetails.studentClubs.split(',').map((club, index) => (
                <div className="club-item" key={index}>{club.trim()}</div>
              )) : 
              <p>Information not available</p>
            }
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Notable Alumni</h3>
        <p>{collegeDetails.notableAlumni || 'Information not available'}</p>
      </div>

      <div className="action-buttons">
        <button 
          className="home-button" 
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default CollegeDetails;