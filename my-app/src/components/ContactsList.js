import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import axiosInstance from '../axios'; // Corrected import path
import'./ContactsList.css'; 
const ContactsList = ({ studentId, onSelectContact, selectedContactId, setSelectedContactName }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    if (!studentId) {
      setError('Student ID is required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/contacts/${studentId}`);
      if (res.data.success) {
        setContacts(res.data.contacts || []);
      } else {
        throw new Error(res.data.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching contacts.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleContactClick = (contactId, contactName) => {
    onSelectContact(contactId);
    setSelectedContactName(contactName);
  };

  if (loading) {
    return (
      <div className="contacts-list-loading">
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contacts-list-error">
        <AlertTriangle className="error-icon" />
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return <div className="no-contacts">No contacts found.</div>;
  }

  return (
    <div className="contacts-list">
      <h2 className="contacts-title">Contacts</h2>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`contact-item ${selectedContactId === contact._id ? 'selected' : ''}`}
          onClick={() => handleContactClick(contact._id, contact.name)}
        >
          <span className="contact-name">{contact.name}</span>
          <span className="contact-type">{contact.type}</span>
        </div>
      ))}
    </div>
  );
};

export default ContactsList;