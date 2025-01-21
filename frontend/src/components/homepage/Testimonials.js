import React from "react";
import "../../assets/css/Testimonials.css";

const testimonials = [
  { text: "TalentBridge made my job search super easy!", name: "John Doe" },
  { text: "I found my dream job within days of using TalentBridge.", name: "Jane Smith" },
  { text: "The swipe feature is so convenient and effective.", name: "Alex Johnson" },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>User Testimonials</h2>
      <div className="testimonial-cards">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <p>"{testimonial.text}"</p>
            <h4>- {testimonial.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
