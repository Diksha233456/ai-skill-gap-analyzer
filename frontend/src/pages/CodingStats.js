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
      {/* Aurora Background */}
      <div style={styles.gridOverlay} />
      <div style={{ ...styles.orb, top: "-20%", left: "-8%", background: "rgba(139,0,255,0.45)", width: "700px", height: "700px" }} />
      <div style={{ ...styles.orb, top: "-5%", right: "-12%", background: "rgba(0,180,255,0.28)", width: "600px", height: "600px" }} />
      <div style={{ ...styles.orb, top: "40%", left: "20%", background: "rgba(251,191,36,0.1)", width: "500px", height: "500px" }} />
      <div style={{ ...styles.orb, bottom: "-8%", right: "5%", background: "rgba(255,80,180,0.15)", width: "500px", height: "500px" }} />

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          {/* BACK BUTTON */}
          <div
            style={styles.backButton}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h1 style={styles.heading} className="outfit hero-title">
            Visualize Your <br />
            <span style={styles.gradientText}>Coding Journey</span>
          </h1>
          <p style={styles.description}>
            Log your algorithmic problem-solving progress. Let our AI correlate your practice history with technical readiness for top-tier tech roles.
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
                <span style={{ ...styles.dot, background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)' }}></span>
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
                <span style={{ ...styles.dot, background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)' }}></span>
                Medium Problems
              </label>
              <input
                type="number"
                min="0"
                name="medium"
                placeholder="e.g., 85"
                value={stats.medium}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-accent)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Hard Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{ ...styles.dot, background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)' }}></span>
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
                  e.target.style.borderColor = "var(--border-accent)";
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
    background: "var(--bg-dark)",
    color: "var(--text-primary)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "hidden",
  },
  orb: { position: "fixed", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" },
  gridOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    zIndex: 0,
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(13,8,33,0.88)",
    backdropFilter: "blur(20px)",
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
    gap: "8px",
    cursor: "pointer",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  logo: {
    fontSize: "24px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif"
  },
  logoHighlight: {
    color: "var(--accent-blue)",
  },
  profileIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(91,140,255,0.4)",
    transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
    fontFamily: "'Outfit', sans-serif"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "55px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(30px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTop: "1px solid rgba(255,255,255,0.18)",
    padding: "48px 56px",
    width: "100%",
    maxWidth: "540px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    position: "relative",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-primary)",
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
    fontSize: "64px",
    fontWeight: 800,
    lineHeight: "1.1",
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
    color: "var(--text-secondary)",
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
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text-primary)",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s ease",
  },
  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)",
    color: "#0d0821",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 28px rgba(251,191,36,0.35)",
    transition: "all 0.3s ease",
    letterSpacing: "0.3px",
  },
};

export default CodingStats;
