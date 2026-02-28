import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CodingStats() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    easy: "",
    medium: "",
    hard: "",
  });

  const handleChange = (e) => {
    // Prevent negative numbers
    const val = Math.max(0, Number(e.target.value));
    setStats({ ...stats, [e.target.name]: val === 0 && e.target.value === "" ? "" : val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Coding Stats:", stats);
    alert("Stats updated successfully!");
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
          <div style={styles.iconBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h1 style={styles.heading}>
            Visualize Your <br />
            <span style={styles.gradientText}>Coding Journey</span>
          </h1>
          <p style={styles.description}>
            Log your algorithmic problem-solving progress. Let our AI correlate your practice history with technical readiness for top-tier roles.
          </p>
        </div>

        {/* RIGHT CARD (Form) */}
        <div
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
        >
          <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* Easy Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{...styles.dot, background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'}}></span>
                Easy Problems
              </label>
              <input
                type="number"
                min="0"
                name="easy"
                placeholder="e.g., 50"
                value={stats.easy}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#22c55e";
                  e.target.style.boxShadow = "0 0 10px rgba(34, 197, 94, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Medium Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{...styles.dot, background: '#eab308', boxShadow: '0 0 8px rgba(234, 179, 8, 0.4)'}}></span>
                Medium Problems
              </label>
              <input
                type="number"
                min="0"
                name="medium"
                placeholder="e.g., 120"
                value={stats.medium}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#eab308";
                  e.target.style.boxShadow = "0 0 10px rgba(234, 179, 8, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Hard Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{...styles.dot, background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'}}></span>
                Hard Problems
              </label>
              <input
                type="number"
                min="0"
                name="hard"
                placeholder="e.g., 15"
                value={stats.hard}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ef4444";
                  e.target.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(91,140,255,0.4)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(91,140,255,0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Update Stats
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
    maxWidth: "500px",
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
    marginBottom: "20px",
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
    maxWidth: "460px",
    padding: "40px",
    borderRadius: "24px",
    background: "linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.4) 100%)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)",
    transition: "transform 0.4s ease",
    display: "flex",
    flexDirection: "column",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#e2e8f0",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  input: {
    width: "100%",
    boxSizing: "border-box", 
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    marginTop: "12px",
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

export default CodingStats;

