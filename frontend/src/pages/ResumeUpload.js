import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a resume file.");
      return;
    }
    alert(`Analyzing ${file.name}...`);
  };

  return (
    <div style={styles.page}>
      {/* Decorative Tech Grid */}
      <div style={styles.gridOverlay}></div>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          {/* BACK BUTTON */}
          <div
            style={styles.backButton}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f8fafc";
              e.currentTarget.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.transform = "translateX(0px)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </div>

          <div style={styles.logo} onClick={() => navigate("/")}>
            <span style={styles.logoHighlight}>AI</span> Skill Gap
          </div>
        </div>

        {/* PROFILE DROPDOWN */}
        <div style={{ position: "relative" }}>
          <div
            style={styles.profileIcon}
            onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            DK
          </div>

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem}>View Profile</div>
              <div style={styles.dropdownItem}>Edit Profile</div>
              <div style={styles.dropdownDivider}></div>
              <div style={{ ...styles.dropdownItem, color: "#ef4444" }}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN WRAPPER */}
      <main style={styles.wrapper}>
        
        {/* LEFT SECTION */}
        <div style={styles.left}>
          {/* NEW ICON BADGE */}
          <div style={styles.iconBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 style={styles.heading}>
            Turn Your Resume Into{" "}
            <br />
            <span style={styles.gradientText}>Career Intelligence</span>
          </h1>
          <p style={styles.description}>
            Upload your resume and let AI evaluate your technical readiness,
            detect skill gaps, and generate a personalized improvement roadmap.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
        >
          {/* Decorative Icon inside Card */}
          <div style={styles.iconBox}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label
              style={{
                ...styles.uploadBox,
                borderColor: file ? "rgba(91,140,255,0.6)" : "rgba(255,255,255,0.15)",
                background: file ? "rgba(91,140,255,0.08)" : "rgba(255,255,255,0.02)",
                boxShadow: file ? "0 0 20px rgba(91,140,255,0.15)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(91,140,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(91,140,255,0.4)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(91,140,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = file ? "rgba(91,140,255,0.08)" : "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = file ? "rgba(91,140,255,0.6)" : "rgba(255,255,255,0.15)";
                e.currentTarget.style.boxShadow = file ? "0 0 20px rgba(91,140,255,0.15)" : "none";
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              
              {/* Dynamic Upload Area Content */}
              {file ? (
                <div style={styles.fileSelected}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span style={styles.fileName}>{file.name}</span>
                  <p style={styles.changeFileText}>Click to change file</p>
                </div>
              ) : (
                <div style={styles.filePrompt}>
                  <span style={styles.uploadTitle}>Click to Upload Resume</span>
                  <p style={styles.uploadSubtitle}>PDF, DOC, DOCX supported</p>
                </div>
              )}
            </label>

            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(91,140,255,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(91,140,255,0.2)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Analyze Resume
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#070b14",
    background: `
      radial-gradient(circle at 15% 50%, rgba(91,140,255,0.12), transparent 45%),
      radial-gradient(circle at 85% 30%, rgba(139,92,246,0.12), transparent 45%),
      #070b14
    `,
    color: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    zIndex: 0,
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    background: "rgba(7, 11, 20, 0.7)",
    backdropFilter: "blur(16px)",
    zIndex: 10,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    cursor: "pointer",
  },
  logoHighlight: {
    color: "#5b8cff",
  },
  profileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #5b8cff 0%, #8b5cf6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(91,140,255,0.3)",
    transition: "transform 0.2s ease",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "55px",
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "12px",
    width: "160px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    padding: "8px 0",
    zIndex: 20,
  },
  dropdownItem: {
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "#e2e8f0",
  },
  dropdownDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "4px 0",
  },
  wrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "80px",
    padding: "0 80px",
    flexWrap: "wrap",
    zIndex: 1,
  },
  left: {
    maxWidth: "540px",
  },
  iconBadge: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "rgba(91,140,255,0.1)",
    border: "1px solid rgba(91,140,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 0 20px rgba(91,140,255,0.15)",
  },
  heading: {
    fontSize: "56px",
    fontWeight: 800,
    lineHeight: "1.15",
    marginBottom: "24px",
    letterSpacing: "-1.5px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontSize: "18px",
    color: "#94a3b8",
    lineHeight: "1.7",
    fontWeight: 400,
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "50px 40px",
    borderRadius: "24px",
    background: "linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.4) 100%)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)",
    transition: "transform 0.4s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconBox: {
    width: "60px",
    height: "60px",
    marginBottom: "30px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(91,140,255,0.15) 0%, rgba(91,140,255,0.05) 100%)",
    border: "1px solid rgba(91,140,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    borderRadius: "16px",
    border: "2px dashed",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "center",
  },
  filePrompt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  uploadTitle: {
    fontWeight: 600,
    fontSize: "16px",
    color: "#e2e8f0",
  },
  uploadSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  fileSelected: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileName: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#e2e8f0",
    wordBreak: "break-all",
    textAlign: "center",
  },
  changeFileText: {
    fontSize: "12px",
    color: "#8b5cf6",
    marginTop: "6px",
    fontWeight: 500,
  },
  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #5b8cff 0%, #8b5cf6 100%)",
    color: "white",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(91,140,255,0.2)",
    transition: "all 0.3s ease",
  },
};

export default ResumeUpload;