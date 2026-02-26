import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TechExplorer() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const domains = [
    {
      name: "Frontend Development",
      description: "Build user interfaces, interactive elements, and highly responsive web applications.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      difficulty: "Medium",
    },
    {
      name: "Backend Development",
      description: "Engineer server-side logic, architect scalable APIs, and manage complex databases.",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
      difficulty: "Medium",
    },
    {
      name: "Full Stack Development",
      description: "Bridge the gap between frontend and backend to build complete, end-to-end systems.",
      skills: ["React", "Node.js", "System Design", "APIs"],
      difficulty: "High",
    },
    {
      name: "Data Science",
      description: "Extract insights from raw data using advanced analytics and statistical modeling.",
      skills: ["Python", "Pandas", "Statistics", "SQL"],
      difficulty: "High",
    },
    {
      name: "AI / Machine Learning",
      description: "Train intelligent systems, build predictive models, and implement neural networks.",
      skills: ["Python", "TensorFlow", "PyTorch", "Math"],
      difficulty: "High",
    },
    {
      name: "Cybersecurity",
      description: "Defend digital infrastructure, run penetration tests, and secure vulnerable networks.",
      skills: ["Networking", "Linux", "Cryptography", "Ethical Hacking"],
      difficulty: "High",
    },
    {
      name: "Cloud Computing",
      description: "Deploy, scale, and manage distributed applications in modern cloud environments.",
      skills: ["AWS", "Azure", "Docker", "Kubernetes"],
      difficulty: "Medium",
    },
  ];

  const filteredDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

  // Restore vibrant colors
  const getDifficultyColor = (diff) => {
    if (diff === "High") return "#ef4444"; // Neon Red
    if (diff === "Medium") return "#eab308"; // Neon Yellow
    return "#00ffcc"; // Neon Cyan
  };

  return (
    <div style={styles.page}>
      {/* VIBRANT SCROLLBAR & ANIMATIONS */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #070b14; }
        ::-webkit-scrollbar-thumb { background: rgba(91, 140, 255, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(91, 140, 255, 0.6); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        
        .animated-card {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .floating-icon {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Fixed Tech Grid */}
      <div style={styles.gridOverlay}></div>

      {/* STICKY NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
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

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        
        {/* HERO SECTION */}
        <div style={styles.heroSection}>
          <div style={styles.iconBadge} className="floating-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <h1 style={styles.heading}>
            Explore <span style={styles.gradientText}>Tech Domains</span>
          </h1>
          <p style={styles.description}>
            Discover career paths, understand the required skills, and find the perfect role to match your coding journey.
          </p>
        </div>

        {/* STICKY SEARCH BAR (With Glow) */}
        <div style={styles.stickySearchWrapper}>
          <div style={styles.searchContainer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search domains (e.g., Data Science, Frontend)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = "#00ffcc";
                e.target.style.boxShadow = "0 0 20px rgba(0, 255, 204, 0.2)";
                e.target.style.background = "rgba(15, 23, 42, 0.8)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                e.target.style.background = "rgba(15, 23, 42, 0.6)";
              }}
            />
          </div>
        </div>

        {/* DOMAIN CARDS GRID (Perfect Layout + Neon Hover) */}
        <div style={styles.gridContainer}>
          {filteredDomains.map((domain, index) => {
            const diffColor = getDifficultyColor(domain.difficulty);
            return (
              <div 
                key={domain.name} 
                className="animated-card"
                style={{
                  ...styles.card,
                  animationDelay: `${index * 0.08}s` // Perfect waterfall stagger
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 25px ${diffColor}30`;
                  e.currentTarget.style.borderColor = `${diffColor}60`; // Border glows matching difficulty
                  e.currentTarget.style.borderTop = `1px solid ${diffColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderTop = "1px solid rgba(255,255,255,0.15)";
                }}
              >
                {/* Difficulty Badge */}
                <div style={styles.badgeContainer}>
                  <div style={{...styles.dot, background: diffColor, boxShadow: `0 0 10px ${diffColor}`}}></div>
                  <span style={{ color: diffColor, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    {domain.difficulty}
                  </span>
                </div>

                <h3 style={styles.cardTitle}>{domain.name}</h3>
                <p style={styles.cardDesc}>{domain.description}</p>

                {/* Skills Chips */}
                <div style={styles.skillsContainer}>
                  {domain.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      style={styles.chip}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(91,140,255,0.2)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(91,140,255,0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Card Action Button */}
                <button 
                  style={styles.cardButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${diffColor}15`;
                    e.currentTarget.style.borderColor = `${diffColor}50`;
                    e.currentTarget.style.color = diffColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#f8fafc";
                  }}
                >
                  Explore Path 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "6px"}}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            );
          })}

          {filteredDomains.length === 0 && (
            <div style={styles.noResults}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: "20px", opacity: 0.5}}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h3 style={{color: "#e2e8f0", fontSize: "24px", margin: "0 0 8px 0"}}>No Domains Found</h3>
              <p style={{margin: 0}}>We couldn't find anything matching "{search}"</p>
            </div>
          )}
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
    `, // The deep vibrant background you liked
    color: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  gridOverlay: {
    position: "fixed",
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
    position: "sticky",
    top: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    background: "rgba(7, 11, 20, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    zIndex: 50, 
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
    color: "#5b8cff", // Neon Blue
  },
  profileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #5b8cff 0%, #8b5cf6 100%)", // Vibrant gradient
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
  main: {
    flex: 1,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "80px",
  },
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: "600px",
    marginTop: "60px",
    marginBottom: "20px",
  },
  iconBadge: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "rgba(0,255,204,0.08)",
    border: "1px solid rgba(0,255,204,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 0 25px rgba(0,255,204,0.15)", // Glowing Cyan Badge
  },
  heading: {
    fontSize: "52px",
    fontWeight: 800,
    lineHeight: "1.15",
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #00ffcc 0%, #5b8cff 100%)", // Vibrant text gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontSize: "18px",
    color: "#94a3b8",
    lineHeight: "1.6",
    fontWeight: 400,
  },
  stickySearchWrapper: {
    position: "sticky",
    top: "80px", 
    zIndex: 40, 
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "20px 0 40px 0",
    background: "linear-gradient(180deg, #070b14 20%, rgba(7,11,20,0.8) 60%, transparent 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "520px",
    padding: "0 20px",
  },
  searchIcon: {
    position: "absolute",
    left: "40px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "20px 24px 20px 54px",
    borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", // THE FIX for perfect layout
    gap: "32px",
    width: "100%",
    maxWidth: "1150px", // A bit wider to fit cards nicely
    padding: "0 20px",
  },
  card: {
    background: "linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.6) 100%)", // Deep glass
    border: "1px solid rgba(255,255,255,0.05)",
    borderTop: "1px solid rgba(255,255,255,0.15)", // Premium light edge
    backdropFilter: "blur(24px)",
    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
    borderRadius: "24px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "default",
  },
  badgeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "0 0 14px 0",
    letterSpacing: "-0.5px",
  },
  cardDesc: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: "1.7",
    margin: "0 0 28px 0",
    flex: 1,
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "32px",
  },
  chip: {
    background: "rgba(91,140,255,0.08)",
    border: "1px solid rgba(91,140,255,0.15)",
    color: "#8b5cf6", // Vibrant purple text for skills
    padding: "6px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.2s ease",
  },
  cardButton: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#f8fafc",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  noResults: {
    gridColumn: "1 / -1", // Stretches across the whole grid
    textAlign: "center",
    padding: "80px 20px",
    color: "#64748b",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
};

export default TechExplorer;