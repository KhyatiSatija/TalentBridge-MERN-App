import React from "react";
import "../../assets/css/Main.css";
import { Link } from "react-router-dom";
const Main = () => {
      return (
        <section className="hero">
          <h1 id="heading">Where Talent Meets Opportunity.</h1>
          <p>
            TalentBridge connects developers and companies seamlessly, ensuring
            skill-based matchmaking for job opportunities and collaborations.
          </p>
          <div className="buttons">
            <Link to="/signup">
            <button className="btn-company">Find The Right Match</button>
            </Link>
          </div>
        </section>
      );
};
export default Main;
     