import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FileText, Code, LineChart, Compass, User, Settings, LogOut, ArrowRight } from "lucide-react";
import { getAuthUser, getInitials, logout } from "../services/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const authUser = getAuthUser();
  const initials = getInitials(authUser?.name);

  const cards = [
    {
      title: "Upload Resume",
      description: "Let our AI analyze your resume for missing skills and match your exact keywords.",
      icon: <FileText size={28} color="#34d399" />,
      path: "/resume",
      accent: "#34d399",
      bgHover: "rgba(52,211,153,0.08)",
      glow: "0 20px 60px rgba(52,211,153,0.25), 0 0 0 1px rgba(52,211,153,0.3)",
      iconBg: "rgba(52,211,153,0.12)",
    },
    {
      title: "Coding Stats",
      description: "Track your algorithm problem-solving performance.",
      icon: <Code size={28} color="#fbbf24" />,
      path: "/coding",
      accent: "#fbbf24",
      bgHover: "rgba(251,191,36,0.08)",
      glow: "0 20px 60px rgba(251,191,36,0.25), 0 0 0 1px rgba(251,191,36,0.3)",
      iconBg: "rgba(251,191,36,0.12)",
    },
    {
      title: "View Analysis",
      description: "See your dynamic readiness score and detailed feedback.",
      icon: <LineChart size={28} color="#fb7185" />,
      path: "/analysis",
      accent: "#fb7185",
      bgHover: "rgba(251,113,133,0.08)",
      glow: "0 20px 60px rgba(251,113,133,0.25), 0 0 0 1px rgba(251,113,133,0.3)",
      iconBg: "rgba(251,113,133,0.12)",
    },
    {
      title: "Explore Domains",
      description: "Discover new tech career paths and required skills.",
      icon: <Compass size={28} color="#38bdf8" />,
      path: "/explore",
      accent: "#38bdf8",
      bgHover: "rgba(56,189,248,0.08)",
      glow: "0 20px 60px rgba(56,189,248,0.25), 0 0 0 1px rgba(56,189,248,0.3)",
      iconBg: "rgba(56,189,248,0.12)",
    }
  ];

  return (
    <div style={S.page}>
      <style>{`
        .outfit { font-family: 'Outfit', sans-serif; }
        .hero-title { background: linear-gradient(135deg, #ffffff 0%, #e0d4ff 50%, #a5f3fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-glow { background: linear-gradient(135deg, #34d399 0%, #38bdf8 50%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card-wrap { position: relative; border-radius: 22px; background: rgba(255,255,255,0.05); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.09); padding: 36px 28px 32px; cursor: pointer; transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: flex-start; min-height: 180px; overflow: hidden; }
        .card-wrap:hover { transform: translateY(-10px) scale(1.02); }
        .card-icon-box { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: all 0.3s ease; flex-shrink: 0; }
        .card-wrap:hover .card-icon-box { transform: scale(1.15) rotate(6deg); }
        .card-title { font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: -0.3px; font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* Background — Aurora Borealis */}
      <div style={S.gridOverlay} />
      <div style={{ ...S.orb, top: "-20%", left: "-8%", background: "rgba(139, 0, 255, 0.55)", width: "750px", height: "750px" }} />
      <div style={{ ...S.orb, top: "-5%", right: "-12%", background: "rgba(0, 180, 255, 0.35)", width: "650px", height: "650px" }} />
      <div style={{ ...S.orb, top: "35%", left: "25%", background: "rgba(0, 230, 170, 0.18)", width: "600px", height: "600px" }} />
      <div style={{ ...S.orb, bottom: "-10%", right: "10%", background: "rgba(255, 80, 180, 0.22)", width: "550px", height: "550px" }} />
      <div style={{ ...S.orb, bottom: "5%", left: "-5%", background: "rgba(255, 140, 0, 0.14)", width: "450px", height: "450px" }} />

      {/* NAVBAR */}
      <nav style={S.navbar}>
        <div style={S.logo} className="outfit" onClick={() => navigate("/")}>
          <span style={{ color: "var(--accent-blue)" }}>AI</span> Skill Gap
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={S.profileIcon}
            className="outfit"
            onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {initials}
          </div>

          {showProfile && (
            <div style={S.dropdown}>
              <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{authUser?.name || "User"}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{authUser?.email || ""}</div>
              </div>
              <div style={S.dropdownItem} onClick={() => navigate("/profile")}><User size={15} /> Profile</div>
              <div style={S.dropdownItem} onClick={() => navigate("/settings")}><Settings size={15} /> Settings</div>
              <div style={S.dropdownDivider} />
              <div style={{ ...S.dropdownItem, color: "#fb7185" }} onClick={logout}><LogOut size={15} /> Logout</div>
            </div>
          )}
        </div>
      </nav>

      <main style={S.main}>
        {/* HERO SECTION */}
        <div style={{ textAlign: "center", marginBottom: "80px", maxWidth: "800px", position: "relative", zIndex: 10 }}>
          <div style={S.heroBadge}>
            <span style={{ fontSize: "16px" }}>⚡</span> Empowering Careers
          </div>
          <h1 style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-2px" }} className="outfit hero-title">
            {authUser ? `Hey, ${authUser.name.split(" ")[0]} 👋` : "Analyze Your"} <br />
            <span className="hero-glow">Career Readiness</span>
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-secondary)", margin: "0", lineHeight: 1.6, fontWeight: 400 }}>
            Upload your resume, track coding stats, and discover the skills separating you from your dream role at top tech companies.
          </p>
        </div>

        {/* CARDS GRID */}
        <div style={S.gridContainer}>
          {cards.map((card, index) => (
            <div
              key={index}
              className="card-wrap"
              onClick={() => navigate(card.path)}
              onMouseEnter={e => {
                e.currentTarget.style.background = card.bgHover;
                e.currentTarget.style.boxShadow = card.glow;
                e.currentTarget.style.borderColor = card.accent + "55";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
              }}
            >
              <div className="card-icon-box" style={{ background: card.iconBg, border: `1px solid ${card.accent}40` }}>
                {card.icon}
              </div>
              <h3 className="card-title">{card.title}</h3>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div className="outfit" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-secondary)" }}>
          Built with <span style={{ color: "var(--accent-red)" }}>♥</span> for Engineers
        </div>
      </footer>
    </div >
  );
}

const S = {
  page: { minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", overflowX: "hidden" },
  gridOverlay: { position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" },
  orb: { position: "fixed", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(130px)", zIndex: 0, pointerEvents: "none" },

  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 60px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(13,8,33,0.88)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: "24px", fontWeight: 800, cursor: "pointer", color: "var(--text-primary)" },
  profileIcon: { width: "45px", height: "45px", borderRadius: "14px", background: "linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 8px 20px rgba(192,132,252,0.4)", transition: "transform 0.2s" },

  dropdown: { position: "absolute", right: 0, top: "58px", background: "rgba(20,10,50,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", borderRadius: "14px", width: "170px", boxShadow: "0 20px 50px rgba(0,0,0,0.7)", padding: "8px 0", zIndex: 200 },
  dropdownItem: { padding: "12px 20px", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" },
  dropdownDivider: { height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" },

  main: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 40px 120px", position: "relative", zIndex: 10 },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px", background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.3)", color: "#d8b4fe", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", margin: "0 auto 32px", textTransform: "uppercase" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", width: "100%", maxWidth: "1200px", position: "relative", zIndex: 10 },

  footer: { padding: "32px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(13,8,33,0.9)", position: "relative", zIndex: 10 },
};

export default Dashboard;
