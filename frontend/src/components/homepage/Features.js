import React from "react";
import "../../assets/css/Features.css";

const features = [
  { title: "Flexibility", description: "Mobile-first convenience. Quick and easy to shortlist jobs." },
  { title: "Time Savings", description: "Personalized job recommendations. Effortless navigation." },
  { title: "Transparent Information", description: "Insights into job requirements while maintaining anonymity." },
  { title: "Accurate Matching", description: "Higher matching accuracy. Improved hiring rates." },
  { title: "Simplified Workflow", description: "Streamlined pre-selection process. Organized tracking." },
];

const Features = () => {
  return (
    <section className="features">
      <h2>How TalentBridge Simplifies Your Job Search</h2>
      <p>
        Job hunting can often be a long and stressful journey. But with TalentBridge, finding the perfect opportunity becomes effortless!
      </p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-item" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
