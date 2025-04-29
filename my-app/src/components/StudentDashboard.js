import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './StudentDashboard.css';
import { XCircle, AlertTriangle } from 'lucide-react';

const StudentChatBox = React.lazy(() => import('./StudentChatBox'));
const ContactsList = React.lazy(() => import('./ContactsList'));

const StudentDashboard = ({ onClose, initialMessagingInstituteId, initialMessagingInstituteName }) => {
  const [studentId, setStudentId] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(initialMessagingInstituteId);
  const [selectedContactName, setSelectedContactName] = useState(initialMessagingInstituteName);

  useEffect(() => {
    const token = sessionStorage.getItem('studentToken'); // Get studentToken from sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentId(decoded.id);
        console.log("Student ID from token:", decoded.id); // Debugging
      } catch (error) {
        console.error("Error decoding student token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (initialMessagingInstituteId) {
      setSelectedContactId(initialMessagingInstituteId);
      setSelectedContactName(initialMessagingInstituteName);
    }
  }, [initialMessagingInstituteId, initialMessagingInstituteName]);

  return (
    <div className="dashboard-container">
      {studentId ? (
        <React.Suspense fallback={<div className="loading">Loading Contacts...</div>}>
          <ContactsList
            studentId={studentId}
            onSelectContact={setSelectedContactId}
            selectedContactId={selectedContactId}
            setSelectedContactName={setSelectedContactName}
          />
        </React.Suspense>
      ) : (
        <div className="loading">Loading student info...</div>
      )}

      {selectedContactId && (
        <React.Suspense fallback={<div className="loading">Loading Chat...</div>}>
          <StudentChatBox
            studentId={studentId}
            instituteId={selectedContactId}
            onClose={() => {
              setSelectedContactId(null);
              setSelectedContactName('');
              onClose();
            }}
            selectedContactName={selectedContactName}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default StudentDashboard;
