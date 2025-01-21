import React from "react";
import Navbar from "../components/homepage/Navbar";
import Main from "../components/homepage/Main";
import Features from "../components/homepage/Features";
import Testimonials from "../components/homepage/Testimonials";
import Footer from "../components/homepage/Footer";
import "../assets/css/App.css";

const HomePage = () => {
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