import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Analysis() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock data
  const mockData = {
    readiness: 72,
    strengths: ["Data Structures & Algorithms", "Backend Development"],
    weaknesses: ["System Design", "Graph Algorithms"],
  };

  // Animate the circle on mount
  useEffect(() => {
    setTimeout(() => {
      setProgress(mockData.readiness);
    }, 100);
  }, [mockData.readiness]);

  // SVG Circle Math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={styles.page}>
      {/* Decorative Tech Grid */}
      <div style={styles.gridOverlay}></div>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          {/* NEW BACK BUTTON */}
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
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
          </div>
          <h1 style={styles.heading}>
            Your Skill <br />
            <span style={styles.gradientText}>Analysis Report</span>
          </h1>
          <p style={styles.description}>
            Based on your coding stats and resume profile, our AI has evaluated your technical readiness. Review your strengths and target your knowledge gaps to improve your placement chances.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
        >
          {/* Readiness Circle Section */}
          <div style={styles.circleSection}>
            <div style={styles.svgWrapper}>
              <svg width="180" height="180" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffcc" />
                    <stop offset="100%" stopColor="#5b8cff" />
                  </linearGradient>
                  {/* Neon Glow Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                
                {/* Animated Progress Track with Glow */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="url(#circleGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  filter="url(#glow)"
                  style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div style={styles.circleText}>
                <span style={styles.percentage}>{progress}%</span>
                <span style={styles.readinessLabel}>Readiness</span>
              </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Strengths & Weaknesses */}
          <div style={styles.dataSection}>
            
            {/* Strengths */}
            <div style={styles.listContainer}>
              <h3 style={styles.listHeading}>
                <span style={{...styles.dot, background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'}}></span>
                Core Strengths
              </h3>
              <ul style={styles.ul}>
                {mockData.strengths.map((item, index) => (
                  <li 
                    key={index} 
                    style={styles.li}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(34, 197, 94, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div style={styles.listContainer}>
              <h3 style={styles.listHeading}>
                <span style={{...styles.dot, background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'}}></span>
                Areas to Improve
              </h3>
              <ul style={styles.ul}>
                {mockData.weaknesses.map((item, index) => (
                  <li 
                    key={index} 
                    style={styles.li}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <button 
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,255,204,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,255,204,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Generate Learning Roadmap
          </button>
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
    fontSize: "50px",
    fontWeight: 800,
    lineHeight: "1.15",
    marginBottom: "20px",
    letterSpacing: "-1.5px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #00ffcc 0%, #5b8cff 100%)",
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
  circleSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  svgWrapper: {
    position: "relative",
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: "36px",
    fontWeight: 800,
    color: "#f8fafc",
    letterSpacing: "-1px",
    lineHeight: "1",
  },
  readinessLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
    margin: "0 0 30px 0",
  },
  dataSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  listHeading: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  ul: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  li: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    color: "#cbd5e1",
    background: "rgba(255,255,255,0.02)",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.03)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
  },
  button: {
    width: "100%",
    marginTop: "36px",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #00ffcc 0%, #5b8cff 100%)",
    color: "#0f172a", 
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,255,204,0.15)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export default Analysis;