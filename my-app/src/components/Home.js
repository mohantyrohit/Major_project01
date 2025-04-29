import React from "react";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  return (
    <div
      className="landing-container"
      style={{
        backgroundImage: `url("/images/background.jpg")`,
      }}
    >
      <div className="content">
        <h2>Welcome to College Finder</h2>
        <p>Recognizing your pursuit of excellence, we invite you to use the search bar to discover the best colleges through College Finder.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
