import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/homepage/Navbar";
import Main from "../components/homepage/Main";
import Features from "../components/homepage/Features";
import Testimonials from "../components/homepage/Testimonials";
import Footer from "../components/homepage/Footer";
import "../assets/css/App.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        navigate("/signup");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Main />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;
