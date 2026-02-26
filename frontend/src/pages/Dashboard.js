import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <div style={navbarStyle}>
        <h2 style={{ margin: 0 }}>AI Skill Gap</h2>

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

      {/* Hero Section */}
      <div style={heroSection}>
        <h1 style={heroTitle}>Analyze Your Career Readiness</h1>
        <p style={heroSubtitle}>
          Get AI-powered insights to level up your placement preparation.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={cardContainer}>
        <div style={cardStyle} onClick={() => navigate("/resume")}>
          <h3>📄 Upload Resume</h3>
          <p>Let AI analyze your resume skills.</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/coding")}>
          <h3>💻 Coding Stats</h3>
          <p>Add your problem-solving performance.</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/analysis")}>
          <h3>📊 View Analysis</h3>
          <p>See your readiness score and feedback.</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/explore")}>
          <h3>🌍 Explore Domains</h3>
          <p>Discover tech career paths and skills.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------- STYLES ------------------- */

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

const heroSection = {
  textAlign: "center",
  padding: "60px 20px"
};

const heroTitle = {
  fontSize: "40px",
  marginBottom: "10px"
};

const heroSubtitle = {
  fontSize: "18px",
  opacity: 0.9
};

const cardContainer = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "30px",
  padding: "40px"
};

const cardStyle = {
  width: "250px",
  padding: "30px",
  borderRadius: "15px",
  background: "white",
  color: "#1e3c72",
  cursor: "pointer",
  boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
  transition: "0.3s"
};

export default Dashboard;