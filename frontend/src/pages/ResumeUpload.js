import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    console.log("Selected file:", file);
    alert("Resume uploaded (frontend only for now)");
  };

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <div style={navbarStyle}>
        <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
          AI Skill Gap
        </h2>
      </div>

      {/* Upload Section */}
      <div style={uploadContainer}>
        <div style={uploadCard}>
          <h2 style={{ marginBottom: "10px" }}>📄 Upload Your Resume</h2>
          <p style={{ opacity: 0.8 }}>
            Let AI analyze your skills and generate insights.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={fileInputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Analyze Resume
            </button>
          </form>

          {file && (
            <p style={{ marginTop: "15px", fontSize: "14px" }}>
              Selected File: {file.name}
            </p>
          )}
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
  padding: "20px 40px",
  background: "rgba(0,0,0,0.2)"
};

const uploadContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh"
};

const uploadCard = {
  width: "400px",
  padding: "40px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  textAlign: "center",
  boxShadow: "0px 8px 25px rgba(0,0,0,0.3)"
};

const fileInputStyle = {
  margin: "20px 0",
  padding: "10px",
  borderRadius: "8px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "white",
  color: "#1e3c72",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s"
};

export default ResumeUpload;