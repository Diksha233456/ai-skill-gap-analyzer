import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [dashboardData, setDashboardData] = useState(null);

  // ✅ Single API Call
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/diksha@test.com")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDashboardData(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const cards = [
    {
      title: "Upload Resume",
      description: "Let our AI analyze your resume for missing skills and exact keywords to boost your profile.",
      icon: <FileText size={28} color="#00ffcc" />,
      path: "/resume",
      color: "#00ffcc",
      status: "Step 1"
    },
    {
      title: "Coding Stats",
      description: "Connect your LeetCode or GitHub to track your algorithm problem-solving performance.",
      icon: <Code size={28} color="#eab308" />,
      path: "/coding",
      color: "#eab308",
      status: "Step 2"
    },
    {
      title: "View Analysis",
      description: "See your overall placement readiness score, detailed feedback, and individual growth metrics.",
      icon: <LineChart size={28} color="#ef4444" />,
      path: "/analysis",
      color: "#ef4444",
      status: "Report"
    },
    {
      title: "Explore Domains",
      description: "Discover new tech career paths and find the exact skills required to master them.",
      icon: <Compass size={28} color="#5b8cff" />,
      path: "/explore",
      color: "#5b8cff",
      status: "Discover"
    }
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          <span style={{ color: "#5b8cff" }}>AI</span> Skill Gap
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={styles.profileIcon}
            onClick={() => setShowProfile(!showProfile)}
          >
            DK
          </div>

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem}><User size={14}/> View Profile</div>
              <div style={styles.dropdownItem}><Settings size={14}/> Edit Profile</div>
              <div style={{...styles.dropdownItem, color:"#ef4444"}}><LogOut size={14}/> Logout</div>
            </div>
          )}
        </div>
      </nav>

      <main style={styles.main}>

        {/* HERO SECTION */}
        <div style={styles.heroSection}>
          <Sparkles size={28} color="#5b8cff" />
          <h1 style={styles.heading}>
            Analyze Your <br />
            <span style={styles.gradientText}>Career Readiness</span>
          </h1>
        </div>

        {/* 🔥 DYNAMIC DASHBOARD DATA */}
        {dashboardData && (
          <div style={styles.statsCard}>
            <h2>Welcome {dashboardData.name}</h2>

            <h3 style={{color:"#5b8cff"}}>
              Target Role: {dashboardData.targetRole}
            </h3>

            <h3>
              Readiness Score: {dashboardData.readinessScore}%
            </h3>

            {/* Progress Bar */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${dashboardData.readinessScore}%`
                }}
              ></div>
            </div>

            <div>
              <strong>Skills:</strong>
              <div>
                {dashboardData.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{marginTop:"15px"}}>
              <strong style={{color:"#ef4444"}}>Missing Skills:</strong>
              <div>
                {dashboardData.missingSkills.map((skill, index) => (
                  <span key={index} style={styles.missingTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 🔥 AI Feedback Section */}
            {dashboardData.feedback && (
              <div style={styles.feedbackBox}>
                {dashboardData.feedback}
              </div>
            )}
          </div>
        )}

        {/* FEATURE CARDS */}
        <div style={styles.gridContainer}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => navigate(card.path)}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div style={styles.cardButton}>
                Launch Module <ArrowRight size={16}/>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#070b14",
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 60px"
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    cursor: "pointer"
  },
  profileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#5b8cff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "55px",
    background: "#1e293b",
    padding: "10px",
    borderRadius: "12px"
  },
  dropdownItem: {
    padding: "8px",
    cursor: "pointer"
  },
  main: {
    padding: "40px"
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "40px"
  },
  heading: {
    fontSize: "48px"
  },
  gradientText: {
    background: "linear-gradient(135deg,#5b8cff,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  statsCard: {
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "40px"
  },
  feedbackBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(91,140,255,0.15)"
  },
  progressBar: {
    height: "10px",
    background: "#1e293b",
    borderRadius: "10px",
    margin: "15px 0"
  },
  progressFill: {
    height: "10px",
    background: "#5b8cff",
    borderRadius: "10px"
  },
  skillTag: {
    display: "inline-block",
    padding: "6px 12px",
    margin: "5px",
    background: "#1e293b",
    borderRadius: "12px"
  },
  missingTag: {
    display: "inline-block",
    padding: "6px 12px",
    margin: "5px",
    background: "#2a0f0f",
    borderRadius: "12px"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "20px",
    cursor: "pointer"
  },
  cardIcon: {
    marginBottom: "10px"
  },
  cardButton: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};

export default Dashboard;