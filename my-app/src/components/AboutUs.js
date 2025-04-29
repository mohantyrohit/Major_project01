import React from 'react';
import './AboutUs.css'; // optional: create this for styling if needed

const AboutUs = () => {
  return (
    <div className="about-us-container" style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', lineHeight: '1.7' }}>
      <h1>About Us: Your Gateway to INDIA's Premier Institutes</h1>

      <p>
        Welcome to <strong>InstituteConnect</strong>, your dedicated platform to navigate the diverse and thriving educational landscape of Odisha. 
        We understand that choosing the right institute is a pivotal decision, one that shapes your future and unlocks your potential. 
        At InstituteConnect, we're committed to simplifying this process, empowering you with comprehensive information and seamless tools 
        to make the best choice for your academic journey.
      </p>

      <h2>Our Vision</h2>
      <p>
        To be the most trusted and resourceful platform for students seeking higher education in India, 
        fostering a vibrant community of learners and institutions.
      </p>

      <h2>What Makes InstituteConnect Unique?</h2>
      <ul>
        <li>
          <strong>Curated Institute Profiles:</strong> We go beyond basic listings. Our platform offers in-depth profiles of Odisha's top institutes,
          providing you with essential details about courses offered, faculty expertise, infrastructure, achievements, and unique strengths.
        </li>
        <li>
          <strong>Explore Your Surroundings:</strong> Visualize your potential new environment by showcasing nearby essential entities like accommodations, libraries, eateries, transport, and healthcare.
        </li>
        <li>
          <strong>Seamless Fest Applications:</strong> Discover and apply for upcoming fests to experience the vibrant cultural scene and connect with fellow students.
        </li>
        <li>
          <strong>Stay Connected with Integrated Chat:</strong> Get real-time help through direct communication with institute representatives.
        </li>
        <li>
          <strong>Your Companion for Relocation:</strong> Access helpful resources to ease your transition into your new academic environment.
        </li>
      </ul>

      <h2>Meet the Team Behind InstituteConnect</h2>
      <ul>
        <li>
          <strong>Rohit Mohanty:</strong> Passionate about accessible education, Rohit brings technical expertise and deep local insight to the platform.
        </li>
        <li>
          <strong>Anjali Soni Singh:</strong> Focused on precision and user experience, Anjali ensures content accuracy and platform usability.
        </li>
        <li>
          <strong>Soumendra Nath:</strong> With skills in communication and community building, Soumendra fosters meaningful connections and interaction on the platform.
        </li>
      </ul>

      <h2>Why Trust InstituteConnect?</h2>
      <ul>
        <li>
          <strong>Accuracy and Reliability:</strong> We verify and regularly update information to help you make informed decisions.
        </li>
        <li>
          <strong>Student-Centric Approach:</strong> Our tools and features are tailored to address your real challenges in selecting the right institute.
        </li>
        <li>
          <strong>Transparency and Integrity:</strong> We believe in ethical, open communication and aim to be a reliable partner in your journey.
        </li>
      </ul>

      <p>
        At <strong>InstituteConnect</strong>, we are more than just a website; we are a community dedicated to helping you find your best fit 
        and embark on a successful academic adventure in Odisha. Trust us to guide you, connect you, and empower you on your path to excellence.
      </p>
    </div>
  );
};

export default AboutUs;
