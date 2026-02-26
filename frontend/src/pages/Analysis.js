import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Analysis() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Temporary dummy data
  const mockData = {
    readiness: 72,
    strengths: ["DSA", "Backend Development"],
    weaknesses: ["System Design", "Graph Algorithms"]
  };

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <div style={navbarStyle}>
        <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
          AI Skill Gap
        </h2>

        <div style={{ position: "relative" }}>
          <div
            style={profileIconStyle}
            onClick={() => setShowProfile(!showProfile)}
          >
            DK
          </div>

          {showProfile && (
            <div style={dropdownStyle}>
              <p style={dropdownItem}>View Profile</p>
              <p style={dropdownItem}>Edit Profile</p>
              <p style={dropdownItem}>Logout</p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Content */}
      <div style={analysisContainer}>
        <h1 style={{ marginBottom: "30px" }}>Your Skill Analysis</h1>

        {/* Readiness Circle */}
        <div style={circleContainer}>
          <div style={circleOuter}>
            <div style={circleInner}>
              {mockData.readiness}%
            </div>
          </div>
          <p style={{ marginTop: "10px" }}>Placement Readiness</p>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={cardsWrapper}>
          <div style={infoCard}>
            <h3 style={{ color: "#00ffcc" }}>Strengths</h3>
            <ul>
              {mockData.strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={infoCard}>
            <h3 style={{ color: "#ff6b6b" }}>Areas to Improve</h3>
            <ul>
              {mockData.weaknesses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  color: "white"
};

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 40px",
  background: "rgba(0,0,0,0.2)"
};

const profileIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "white",
  color: "#1e3c72",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  cursor: "pointer"
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "50px",
  background: "white",
  color: "black",
  borderRadius: "8px",
  padding: "10px",
  width: "150px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)"
};

const dropdownItem = {
  padding: "8px",
  cursor: "pointer"
};

const analysisContainer = {
  textAlign: "center",
  padding: "60px 20px"
};

const circleContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "50px"
};

const circleOuter = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "conic-gradient(#00ffcc 0% 72%, rgba(255,255,255,0.2) 72%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const circleInner = {
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  background: "#1e3c72",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold"
};

const cardsWrapper = {
  display: "flex",
  justifyContent: "center",
  gap: "40px",
  flexWrap: "wrap"
};

const infoCard = {
  background: "rgba(255,255,255,0.15)",
  padding: "30px",
  borderRadius: "20px",
  backdropFilter: "blur(10px)",
  width: "300px",
  boxShadow: "0px 8px 30px rgba(0,0,0,0.3)",
  textAlign: "left"
};

export default Analysis;