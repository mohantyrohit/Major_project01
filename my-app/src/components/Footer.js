import React from "react";
import "./Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-navigation">
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <p>Contact us: contact@gmail.com</p>
        </div>
        <div className="footer-right">
          <p>Follow us on social media</p>
          <div className="social-icons">
            <img src="/logo/01 facebook.png" alt="Facebook Logo" className="footer-logo" />
            <img src="/logo/02 insta.jpg" alt="Instagram Logo" className="footer-logo" />
          </div>
        </div>
        <div className="copyright">&copy; {new Date().getFullYear()} Life@College. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;