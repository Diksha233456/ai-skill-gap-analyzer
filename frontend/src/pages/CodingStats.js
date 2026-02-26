import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CodingStats() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const [stats, setStats] = useState({
    easy: "",
    medium: "",
    hard: ""
  });

  const handleChange = (e) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Coding Stats:", stats);
    alert("Coding stats submitted (frontend only)");
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

      {/* Form Section */}
      <div style={formContainer}>
        <h1 style={{ marginBottom: "20px" }}>Coding Practice Stats</h1>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label>Easy Problems Solved</label>
            <input
              type="number"
              name="easy"
              value={stats.easy}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label>Medium Problems Solved</label>
            <input
              type="number"
              name="medium"
              value={stats.medium}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label>Hard Problems Solved</label>
            <input
              type="number"
              name="hard"
              value={stats.hard}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={submitButton}>
            Submit Stats
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

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

const formContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "60px"
};

const formStyle = {
  background: "rgba(255,255,255,0.15)",
  padding: "40px",
  borderRadius: "20px",
  backdropFilter: "blur(10px)",
  width: "350px",
  boxShadow: "0px 8px 30px rgba(0,0,0,0.3)"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "20px"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  marginTop: "5px",
  fontSize: "16px"
};

const submitButton = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "white",
  color: "#1e3c72",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

export default CodingStats;