import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  FileText, 
  Code, 
  LineChart, 
  Compass, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  ArrowRight
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const cards = [
    {
      title: "Upload Resume",
      description: "Let our AI analyze your resume for missing skills and exact keywords to boost your profile.",
      icon: <FileText size={28} color="#00ffcc" />,
      path: "/resume",
      color: "#00ffcc", // Neon Cyan
      status: "Step 1"
    },
    {
      title: "Coding Stats",
      description: "Connect your LeetCode or GitHub to track your algorithm problem-solving performance.",
      icon: <Code size={28} color="#eab308" />,
      path: "/coding",
      color: "#eab308", // Neon Yellow
      status: "Step 2"
    },
    {
      title: "View Analysis",
      description: "See your overall placement readiness score, detailed feedback, and individual growth metrics.",
      icon: <LineChart size={28} color="#ef4444" />,
      path: "/analysis",
      color: "#ef4444", // Neon Red
      status: "Report"
    },
    {
      title: "Explore Domains",
      description: "Discover new tech career paths and find the exact skills required to master them.",
      icon: <Compass size={28} color="#5b8cff" />,
      path: "/explore",
      color: "#5b8cff", // Neon Blue
      status: "Discover"
    }
  ];

  return (
    <div style={styles.page}>
      {/* VIBRANT SCROLLBAR & ANIMATIONS */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #070b14; }
        ::-webkit-scrollbar-thumb { background: rgba(91, 140, 255, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(91, 140, 255, 0.6); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
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
              <div style={styles.dropdownItem}>
                <User size={14} style={{ marginRight: '8px' }} /> View Profile
              </div>
              <div style={styles.dropdownItem}>
                <Settings size={14} style={{ marginRight: '8px' }} /> Edit Profile
              </div>
              <div style={styles.dropdownDivider}></div>
              <div style={{ ...styles.dropdownItem, color: "#ef4444" }}>
                <LogOut size={14} style={{ marginRight: '8px' }} /> Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        
        {/* HERO SECTION */}
        <div style={styles.heroSection}>
          <div style={styles.iconBadge} className="floating-icon">
            <Sparkles size={28} color="#5b8cff" />
          </div>
          <h1 style={styles.heading}>
            Analyze Your <br />
            <span style={styles.gradientText}>Career Readiness</span>
          </h1>
          <p style={styles.description}>
            Get AI-powered insights to level up your placement preparation, identify missing skills, and land your dream job.
          </p>
        </div>

        {/* PERFECT 2x2 FEATURE CARDS GRID */}
        <div style={styles.gridContainer}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="animated-card"
              onClick={() => navigate(card.path)}
              style={{
                ...styles.card,
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px ${card.color}20`;
                e.currentTarget.style.borderColor = `${card.color}60`; 
                
                // Animate Icon Box
                const iconBox = e.currentTarget.querySelector('.feature-icon-box');
                if (iconBox) iconBox.style.transform = "scale(1.1) rotate(5deg)";
                
                // Animate Button
                const btn = e.currentTarget.querySelector('.feature-btn');
                if (btn) {
                  btn.style.background = `${card.color}20`;
                  btn.style.borderColor = `${card.color}50`;
                  btn.querySelector('.arrow-icon').style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                
                // Reset Icon Box
                const iconBox = e.currentTarget.querySelector('.feature-icon-box');
                if (iconBox) iconBox.style.transform = "scale(1) rotate(0deg)";
                
                // Reset Button
                const btn = e.currentTarget.querySelector('.feature-btn');
                if (btn) {
                  btn.style.background = "rgba(255,255,255,0.03)";
                  btn.style.borderColor = "rgba(255,255,255,0.08)";
                  btn.querySelector('.arrow-icon').style.transform = "translateX(0px)";
                }
              }}
            >
              {/* THE INNER GLOW EFFECT */}
              <div style={{
                position: "absolute",
                top: 0, right: 0,
                width: "200px", height: "200px",
                background: `radial-gradient(circle at top right, ${card.color}20, transparent 70%)`,
                opacity: 0.8,
                pointerEvents: "none",
                borderRadius: "0 24px 0 0"
              }}></div>

              <div style={styles.cardContentWrapper}>
                
                {/* Header: Icon & Badge */}
                <div style={styles.cardHeader}>
                  <div className="feature-icon-box" style={{ 
                    ...styles.cardIconBox, 
                    background: `${card.color}15`, 
                    border: `1px solid ${card.color}30`, 
                    boxShadow: `0 8px 20px ${card.color}15` 
                  }}>
                    {card.icon}
                  </div>
                  
                  <div style={{ ...styles.statusBadge, color: card.color, background: `${card.color}10`, border: `1px solid ${card.color}20` }}>
                    {card.status}
                  </div>
                </div>

                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDesc}>{card.description}</p>
              </div>
              
              {/* Pill-Shaped Feature Button */}
              <div className="feature-btn" style={{...styles.cardButton, color: card.color}}>
                <span style={{ fontWeight: 600, fontSize: "14px", letterSpacing: "0.5px" }}>Launch Module</span>
                <div className="arrow-icon" style={{ transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", display: "flex", alignItems: "center" }}>
                  <ArrowRight size={16} />
                </div>
              </div>

            </div>
          ))}
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
  navLeft: { display: "flex", alignItems: "center" },
  logo: { fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", cursor: "pointer" },
  logoHighlight: { color: "#5b8cff" },
  profileIcon: {
    width: "42px", height: "42px", borderRadius: "12px",
    background: "linear-gradient(135deg, #5b8cff 0%, #8b5cf6 100%)", 
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: "15px", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(91,140,255,0.3)", transition: "transform 0.2s ease",
  },
  dropdown: {
    position: "absolute", right: 0, top: "55px",
    background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)", borderRadius: "12px", width: "180px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)", padding: "8px 0", zIndex: 20,
  },
  dropdownItem: {
    padding: "12px 16px", cursor: "pointer", fontSize: "14px", fontWeight: 500,
    color: "#e2e8f0", display: "flex", alignItems: "center", transition: "background 0.2s ease",
  },
  dropdownDivider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" },
  
  main: {
    flex: 1, zIndex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", padding: "40px 20px 100px 20px",
  },
  heroSection: {
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    maxWidth: "650px", marginTop: "20px", marginBottom: "60px",
  },
  iconBadge: {
    width: "60px", height: "60px", borderRadius: "18px",
    background: "rgba(91,140,255,0.08)", border: "1px solid rgba(91,140,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "24px", boxShadow: "0 0 25px rgba(91,140,255,0.15)", 
  },
  heading: { fontSize: "56px", fontWeight: 800, lineHeight: "1.15", marginBottom: "20px", letterSpacing: "-1.5px" },
  gradientText: {
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)", 
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  description: { fontSize: "18px", color: "#94a3b8", lineHeight: "1.7", fontWeight: 400 },

  // Grid Configuration
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // Wider minmax makes them look like sweeping feature cards
    gap: "32px",
    width: "100%",
    maxWidth: "1000px", // Constrained max-width ensures exactly 2 per row
    padding: "0 20px",
  },

  // Premium Feature Card
  card: {
    position: "relative",
    background: "linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)", 
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
    borderRadius: "24px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    height: "100%", 
    overflow: "hidden", // Keeps the ambient glow inside
  },
  cardContentWrapper: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column",
    position: "relative",
    zIndex: 2, // Keeps text above the glow
  },
  
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  cardIconBox: {
    width: "56px", height: "56px", borderRadius: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "transform 0.3s ease",
  },
  statusBadge: {
    fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
    padding: "6px 12px", borderRadius: "20px",
  },
  cardTitle: {
    fontSize: "26px", fontWeight: 700, color: "#f8fafc", margin: "0 0 12px 0", letterSpacing: "-0.5px",
  },
  cardDesc: { 
    fontSize: "16px", color: "#94a3b8", lineHeight: "1.6", margin: "0 0 32px 0" 
  },
  
  // Sleek Pill Button
  cardButton: {
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    marginTop: "auto", 
    padding: "16px 20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 2,
  }
};

export default Dashboard;