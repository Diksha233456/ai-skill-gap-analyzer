import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TechExplorer() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const domains = [
    {
      name: "Frontend Development",
      description: "Build user interfaces and interactive websites.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      difficulty: "Medium"
    },
    {
      name: "Backend Development",
      description: "Build server-side logic and manage databases.",
      skills: ["Node.js", "Express", "MongoDB", "APIs"],
      difficulty: "Medium"
    },
    {
      name: "Full Stack Development",
      description: "Work on both frontend and backend systems.",
      skills: ["React", "Node.js", "Databases", "APIs"],
      difficulty: "High"
    },
    {
      name: "Data Science",
      description: "Analyze data and build data-driven solutions.",
      skills: ["Python", "Pandas", "Statistics", "SQL"],
      difficulty: "High"
    },
    {
      name: "AI / Machine Learning",
      description: "Build intelligent systems and predictive models.",
      skills: ["Python", "Machine Learning", "Deep Learning"],
      difficulty: "High"
    },
    {
      name: "Cybersecurity",
      description: "Protect systems from cyber threats and attacks.",
      skills: ["Networking", "Linux", "Security Tools"],
      difficulty: "High"
    },
    {
      name: "Cloud Computing",
      description: "Deploy and manage applications in the cloud.",
      skills: ["AWS", "Azure", "Docker", "Kubernetes"],
      difficulty: "Medium"
    }
  ];

  const filteredDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Hero Section */}
      <div style={heroSection}>
        <h1 style={heroTitle}>Explore Tech Domains</h1>
        <p style={heroSubtitle}>
          Discover career paths and the skills required to master them.
        </p>

        <input
          type="text"
          placeholder="Search domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />
      </div>

      {/* Domain Cards */}
      <div style={cardContainer}>
        {filteredDomains.map((domain, index) => (
          <div key={index} style={cardStyle}>
            <h3>{domain.name}</h3>
            <p style={{ opacity: 0.8 }}>{domain.description}</p>

            <div style={badge(domain.difficulty)}>
              {domain.difficulty}
            </div>

            <div style={{ marginTop: "15px" }}>
              <strong>Skills:</strong>
              <ul>
                {domain.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {filteredDomains.length === 0 && (
          <p style={{ marginTop: "30px" }}>No matching domains found.</p>
        )}
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

const searchStyle = {
  padding: "12px",
  width: "300px",
  borderRadius: "10px",
  border: "none",
  marginTop: "20px",
  fontSize: "16px"
};

const cardContainer = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "30px",
  padding: "40px"
};

const cardStyle = {
  width: "280px",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 8px 30px rgba(0,0,0,0.3)",
  textAlign: "left"
};

const badge = (difficulty) => ({
  marginTop: "10px",
  display: "inline-block",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  background:
    difficulty === "High"
      ? "#ff6b6b"
      : difficulty === "Medium"
      ? "#ffd93d"
      : "#00ffcc",
  color: difficulty === "Medium" ? "black" : "white"
});

export default TechExplorer;