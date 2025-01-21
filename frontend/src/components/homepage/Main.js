import React from "react";
import "../../assets/css/Main.css";

const Main = () => {
      return (
        <section className="hero">
          <h1>"Where Talent Meets Opportunity."</h1>
          <p>
            TalentBridge connects developers and companies seamlessly, ensuring
            skill-based matchmaking for job opportunities and collaborations.
          </p>
          <div className="buttons">
            <button className="btn-developer">I'm a Developer</button>
            <button className="btn-company">I'm a Company</button>
          </div>
        </section>
      );
};
export default Main;
     