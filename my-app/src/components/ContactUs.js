import React from 'react';
// import './ContactUs.css'; // optional if you want to style it

const ContactUs = () => {
  return (
    <div className="contact-us-container" style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', lineHeight: '1.6' }}>
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Whether you have questions, suggestions, or just want to connect — feel free to reach out.</p>
      
      <h2>Email</h2>
      <p><a href="mailto:contact@example.com">contact@example.com</a></p>

      <h2>Phone</h2>
      <p>+91-12345-67890</p>

      <h2>Address</h2>
      <p>
        InstituteConnect HQ<br />
        Bhubaneswar, Odisha - 751001<br />
        India
      </p>

      <h2>Social Media</h2>
      <p>Follow us on our social media platforms to stay updated with the latest events and updates.</p>
      <ul>
        <li>Facebook: <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">facebook.com/instituteconnect</a></li>
        <li>Instagram: <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">instagram.com/instituteconnect</a></li>
      </ul>
    </div>
  );
};

export default ContactUs;
