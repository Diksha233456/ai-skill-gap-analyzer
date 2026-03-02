import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getInitials, logout } from "../services/auth";

// ─── Radar Chart (SVG) ───────────────────────────────────────────────────────
function RadarChart({ data, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 40;
  const n = data.length;
  const points = data.map((_, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle };
  });
  const scalePoints = (scale) =>
    points.map(p => {
      const angle = p.angle;
      const sr = r * scale;
      return `${cx + sr * Math.cos(angle)},${cy + sr * Math.sin(angle)}`;
    }).join(" ");

  const userPoints = points.map((p, i) => {
    const val = (data[i].value / 100);
    const angle = p.angle;
    return `${cx + r * val * Math.cos(angle)},${cy + r * val * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={scalePoints(s)}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      <polygon points={userPoints}
        fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.5))" }} />
      {points.map((p, i) => {
        const val = data[i].value / 100;
        const angle = p.angle;
        const px = cx + r * val * Math.cos(angle);
        const py = cy + r * val * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={4} fill="#38bdf8" style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }} />
            <text x={p.x + Math.cos(angle) * 16} y={p.y + Math.sin(angle) * 16}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(241,240,255,0.8)" fontSize="11" fontWeight="600">
              {data[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 150 }) {
  const r = size / 2 - 12, circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#fb7185";
  useEffect(() => { const t = setTimeout(() => setAnim(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (anim / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 10px ${color})` }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)" }}>{score}%</span>
        <span style={{ fontSize: "9px", color: "#9b8ec4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Readiness</span>
      </div>
    </div>
  );
}

// ─── Pill ────────────────────────────────────────────────────────────────────
function Pill({ label, type }) {
  const c = {
    match: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)", text: "#34d399" },
    missing: { bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.35)", text: "#fb7185" },
    neutral: { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)", text: "#38bdf8" },
    purple: { bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)", text: "#c084fc" },
  }[type] || { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)", text: "#38bdf8" };
  return (
    <span style={{
      display: "inline-flex", padding: "5px 13px", borderRadius: "30px", fontSize: "12px", fontWeight: 600,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text, margin: "3px", alignItems: "center", gap: "5px"
    }}>
      {label}
    </span>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
      borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "inherit",
      fontWeight: 700, fontSize: "13px", transition: "all 0.25s",
      background: active ? "linear-gradient(135deg, rgba(251,113,133,0.2), rgba(192,132,252,0.2))" : "transparent",
      color: active ? "#f1f0ff" : "#9b8ec4",
      borderBottom: active ? "2px solid #fb7185" : "2px solid transparent",
    }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>{label}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Analysis() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const authUser = getAuthUser();
  const initials = getInitials(authUser?.name);

  // Per-tab AI state
  const [interviewQs, setInterviewQs] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [sprintPlan, setSprintPlan] = useState(null);
  const [sprintLoading, setSprintLoading] = useState(false);
  const [careerIntel, setCareerIntel] = useState(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);
  const [completedWeeks, setCompletedWeeks] = useState({});

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisData");
    if (stored) { try { setData(JSON.parse(stored)); } catch { setNoData(true); } }
    else setNoData(true);
    const cw = localStorage.getItem("sprintProgress");
    if (cw) setCompletedWeeks(JSON.parse(cw));
  }, []);

  const fetchInterviewQs = async () => {
    if (interviewQs || !data) return;
    setInterviewLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/ai/interview-questions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missingSkills: data.missingSkills?.slice(0, 6) || [], targetRole: data.targetRole }),
      });
      const d = await r.json();
      setInterviewQs(d.questions || []);
    } catch { setInterviewQs([]); }
    setInterviewLoading(false);
  };

  const fetchSprint = async () => {
    if (sprintPlan || !data) return;
    setSprintLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/ai/sprint-plan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missingSkills: data.missingSkills?.slice(0, 8) || [], targetRole: data.targetRole }),
      });
      const d = await r.json();
      setSprintPlan(d);
    } catch { setSprintPlan(null); }
    setSprintLoading(false);
  };

  const fetchIntel = async () => {
    if (careerIntel || !data) return;
    setIntelLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/ai/career-intel", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchedSkills: data.matchedSkills || [], missingSkills: data.missingSkills || [], targetRole: data.targetRole }),
      });
      const d = await r.json();
      setCareerIntel(d);
    } catch { setCareerIntel(null); }
    setIntelLoading(false);
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    if (tab === "interview" && !interviewQs) fetchInterviewQs();
    if (tab === "sprint" && !sprintPlan) fetchSprint();
    if (tab === "intel" && !careerIntel) fetchIntel();
  };

  const toggleWeek = (i) => {
    const updated = { ...completedWeeks, [i]: !completedWeeks[i] };
    setCompletedWeeks(updated);
    localStorage.setItem("sprintProgress", JSON.stringify(updated));
  };

  // Radar data derived from analysis
  const radarData = data ? [
    { label: "Technical", value: Math.min(100, (data.matchedSkills?.length || 0) * 12) },
    { label: "Matched\nSkills", value: data.readinessScore || 0 },
    { label: "Action\nReady", value: Math.min(100, (data.actionPlan?.length || 0) * 16) },
    { label: "Strengths", value: Math.min(100, (data.strengths?.length || 0) * 18) },
    { label: "Domain\nFit", value: Math.max(20, (data.readinessScore || 50) - 10) },
    { label: "Overall", value: data.readinessScore || 0 },
  ] : [];

  const difficultyColor = { Hard: "#fb7185", Medium: "#fbbf24", Easy: "#34d399" };
  const typeColor = { Technical: "#38bdf8", Behavioral: "#c084fc", "System Design": "#fb923c" };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes pulse { 0%,100%{opacity:0.6;}50%{opacity:1;} }
        *{box-sizing:border-box;}
        .tab-pane{animation:fadeInUp 0.4s ease;}
        .q-card:hover{border-color:rgba(251,113,133,0.4)!important;transform:translateY(-2px);}
        .week-card:hover{border-color:rgba(56,189,248,0.4)!important;}
        .intel-bar{transition:width 1.2s cubic-bezier(.4,0,.2,1);}
      `}</style>

      {/* Aurora BG */}
      <div style={S.grid} />
      <div style={{ ...S.orb, top: "-20%", left: "-8%", background: "rgba(139,0,255,0.45)", width: "700px", height: "700px" }} />
      <div style={{ ...S.orb, top: "-5%", right: "-12%", background: "rgba(0,180,255,0.28)", width: "600px", height: "600px" }} />
      <div style={{ ...S.orb, bottom: "0%", right: "8%", background: "rgba(255,80,180,0.2)", width: "500px", height: "500px" }} />
      <div style={{ ...S.orb, bottom: "-5%", left: "20%", background: "rgba(251,113,133,0.15)", width: "450px", height: "450px" }} />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={S.back} onClick={() => navigate("/")}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.transform = "translateX(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.transform = "translateX(0)"; }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Dashboard
          </div>
          <span style={S.logo}>AI<span style={{ color: "#fb7185" }}>SkillGap</span></span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={S.avatar} onClick={() => setShowProfile(p => !p)}>{initials}</div>
          {showProfile && (
            <div style={S.drop}>
              <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{authUser?.name || "User"}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{authUser?.email || ""}</div>
              </div>
              <div style={S.dropItem} onClick={() => navigate("/")}>🏠 Dashboard</div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
              <div style={{ ...S.dropItem, color: "#fb7185" }} onClick={logout}>🚪 Logout</div>
            </div>
          )}
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ padding: "32px 50px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg,#fb7185,#c084fc)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "20px"
          }}>🧠</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>
              Career Intelligence <span style={{ color: "#fb7185" }}>Command Center</span>
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
              {data ? `Analysis for ${data.name || "User"} · ${data.targetRole}` : "AI-powered career insights"}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "4px", marginTop: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0" }}>
          <TabBtn active={activeTab === "overview"} onClick={() => handleTab("overview")} icon="📊" label="Overview" />
          <TabBtn active={activeTab === "interview"} onClick={() => handleTab("interview")} icon="🎯" label="Interview Coach" />
          <TabBtn active={activeTab === "sprint"} onClick={() => handleTab("sprint")} icon="🗓️" label="90-Day Sprint" />
          <TabBtn active={activeTab === "intel"} onClick={() => handleTab("intel")} icon="💡" label="Career Intel" />
        </div>
      </div>

      <main style={S.main}>
        {noData && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>📭</div>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>No Analysis Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>Upload your resume first to unlock all features</p>
            <button onClick={() => navigate("/resume")} style={S.btn}>Go to Resume Upload →</button>
          </div>
        )}

        {data && activeTab === "overview" && (
          <div className="tab-pane" style={{ width: "100%", maxWidth: "1100px" }}>
            {/* Top Row: Score + Radar + Hirability */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Score */}
              <div style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <ScoreRing score={data.readinessScore || 0} size={150} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {data.readinessScore >= 70 ? "🏆 Strong Candidate" : data.readinessScore >= 40 ? "📈 Needs Growth" : "⚠️ Not Ready Yet"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{data.targetRole}</div>
                </div>
                {/* Sprint progress mini bar */}
                {Object.keys(completedWeeks).length > 0 && (() => {
                  const completedCount = Object.values(completedWeeks).filter(Boolean).length;
                  const totalKeys = Object.keys(completedWeeks).length;
                  const pct = Math.round((completedCount / Math.max(totalKeys, 13)) * 100);
                  return (
                    <div style={{ width: "100%", marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>🗓 Sprint Progress</span>
                        <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg,#34d399,#38bdf8)", width: `${pct}%`, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Radar */}
              <div style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Skills DNA</h3>
                <RadarChart data={radarData} size={240} />
              </div>

              {/* Stats */}
              <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Quick Stats</h3>
                {[
                  { label: "Matched Skills", value: data.matchedSkills?.length || 0, color: "#34d399", icon: "✅" },
                  { label: "Skill Gaps", value: data.missingSkills?.length || 0, color: "#fb7185", icon: "🔴" },
                  { label: "Total Extracted", value: data.extractedSkills?.length || 0, color: "#38bdf8", icon: "🔵" },
                  { label: "Action Steps", value: data.actionPlan?.length || 0, color: "#fbbf24", icon: "📌" },
                ].map(s => (
                  <div key={s.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${s.color}25`
                  }}>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{s.icon} {s.label}</span>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div style={S.card}>
                <h3 style={S.secTitle}>✅ Matched Skills</h3>
                <div>{(data.matchedSkills || []).map(s => <Pill key={s} label={s} type="match" />)}</div>
              </div>
              <div style={S.card}>
                <h3 style={S.secTitle}>🔴 Missing Skills</h3>
                <div>{(data.missingSkills || []).map(s => <Pill key={s} label={s} type="missing" />)}</div>
              </div>
            </div>

            {/* Strengths + Action Plan */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div style={S.card}>
                <h3 style={S.secTitle}>💪 Strengths</h3>
                {(data.strengths || []).map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "10px", marginBottom: "10px", padding: "10px 14px",
                    borderRadius: "10px", background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)"
                  }}>
                    <span style={{ color: "#34d399", fontWeight: 700, flexShrink: 0 }}>0{i + 1}</span>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <h3 style={S.secTitle}>📌 Action Plan</h3>
                {(data.actionPlan || []).map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "10px", marginBottom: "10px", padding: "10px 14px",
                    borderRadius: "10px", background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)"
                  }}>
                    <span style={{ color: "#38bdf8", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {data.feedback && (
              <div style={{ ...S.card, background: "rgba(251,113,133,0.06)", border: "1px solid rgba(251,113,133,0.2)" }}>
                <h3 style={{ ...S.secTitle, color: "#fb7185" }}>💬 AI Feedback</h3>
                <p style={{ margin: 0, fontSize: "15px", color: "var(--text-primary)", lineHeight: 1.7 }}>{data.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* ── INTERVIEW SIMULATOR TAB ── */}
        {data && activeTab === "interview" && (
          <div className="tab-pane" style={{ width: "100%", maxWidth: "900px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 800, margin: "0 0 8px" }}>
                  🎯 Interview <span style={{ color: "#fb7185" }}>Weak Spot</span> Simulator
                </h2>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>AI-generated questions targeting YOUR specific skill gaps — with answer frameworks</p>
              </div>
              {interviewQs && (
                <button onClick={() => { setInterviewQs(null); fetchInterviewQs(); }}
                  style={{
                    padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(251,113,133,0.4)",
                    background: "rgba(251,113,133,0.08)", color: "#fb7185", fontSize: "12px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", flexShrink: 0
                  }}>🔄 Regenerate</button>
              )}
            </div>

            {interviewLoading && (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <div style={{
                  width: "48px", height: "48px", border: "3px solid rgba(251,113,133,0.2)", borderTopColor: "#fb7185",
                  borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite"
                }} />
                <p style={{ color: "var(--text-secondary)" }}>Generating interview questions tailored to your gaps…</p>
              </div>
            )}

            {interviewQs && interviewQs.map((q, i) => (
              <div key={i} className="q-card" onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                style={{ ...S.card, marginBottom: "14px", cursor: "pointer", transition: "all 0.3s" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
                    background: "linear-gradient(135deg,#fb7185,#c084fc)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 800, color: "#fff"
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                        background: `${difficultyColor[q.difficulty] || "#fbbf24"}18`,
                        color: difficultyColor[q.difficulty] || "#fbbf24",
                        border: `1px solid ${difficultyColor[q.difficulty] || "#fbbf24"}40`
                      }}>{q.difficulty}</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                        background: `${typeColor[q.type] || "#38bdf8"}18`, color: typeColor[q.type] || "#38bdf8",
                        border: `1px solid ${typeColor[q.type] || "#38bdf8"}40`
                      }}>{q.type}</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                        background: "rgba(192,132,252,0.1)", color: "#c084fc",
                        border: "1px solid rgba(192,132,252,0.3)"
                      }}>🎯 {q.skill}</span>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>
                      {q.question}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                      {expandedQ === i ? "▲ Hide answer guide" : "▼ Show answer framework"}
                    </p>
                  </div>
                </div>

                {expandedQ === i && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{
                        padding: "14px", borderRadius: "12px",
                        background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)"
                      }}>
                        <div style={{
                          fontSize: "11px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase",
                          letterSpacing: "1px", marginBottom: "8px"
                        }}>✅ Answer Framework</div>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6 }}>
                          {q.answerFramework}
                        </p>
                      </div>
                      <div style={{
                        padding: "14px", borderRadius: "12px",
                        background: "rgba(251,113,133,0.06)", border: "1px solid rgba(251,113,133,0.2)"
                      }}>
                        <div style={{
                          fontSize: "11px", fontWeight: 700, color: "#fb7185", textTransform: "uppercase",
                          letterSpacing: "1px", marginBottom: "8px"
                        }}>⚠️ Red Flags to Avoid</div>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6 }}>
                          {q.redFlags}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 90-DAY SPRINT TAB ── */}
        {data && activeTab === "sprint" && (
          <div className="tab-pane" style={{ width: "100%", maxWidth: "900px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 800, margin: "0 0 8px" }}>
                🗓️ Your <span style={{ color: "#38bdf8" }}>90-Day</span> Skill Sprint
              </h2>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Personalized week-by-week plan to close your skill gaps · Progress saved locally</p>
            </div>

            {sprintLoading && (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <div style={{
                  width: "48px", height: "48px", border: "3px solid rgba(56,189,248,0.2)", borderTopColor: "#38bdf8",
                  borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite"
                }} />
                <p style={{ color: "var(--text-secondary)" }}>Building your personalized 90-day sprint plan…</p>
              </div>
            )}

            {sprintPlan && (
              <>
                {/* Summary Bar */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
                  {[
                    { label: "Total Weeks", value: sprintPlan.weeks?.length || 13, color: "#38bdf8" },
                    { label: "Daily Hours", value: sprintPlan.dailyHours || 2, color: "#fbbf24" },
                    { label: "Completed", value: Object.values(completedWeeks).filter(Boolean).length, color: "#34d399" },
                  ].map(s => (
                    <div key={s.label} style={{
                      flex: 1, minWidth: "120px", padding: "16px", borderRadius: "14px",
                      background: `${s.color}10`, border: `1px solid ${s.color}30`, textAlign: "center"
                    }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                    </div>
                  ))}
                  {/* Progress bar */}
                  <div style={{
                    flex: 3, minWidth: "200px", padding: "16px", borderRadius: "14px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Overall Progress</span>
                      <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                        {Math.round((Object.values(completedWeeks).filter(Boolean).length / (sprintPlan.weeks?.length || 13)) * 100)}%
                      </span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }}>
                      <div className="intel-bar" style={{
                        height: "100%", borderRadius: "4px",
                        background: "linear-gradient(90deg,#34d399,#38bdf8)",
                        width: `${Math.round((Object.values(completedWeeks).filter(Boolean).length / (sprintPlan.weeks?.length || 13)) * 100)}%`
                      }} />
                    </div>
                  </div>
                </div>

                {sprintPlan.weeks?.map((w, i) => (
                  <div key={i} className="week-card" style={{
                    ...S.card, marginBottom: "12px", transition: "all 0.3s",
                    borderColor: completedWeeks[i] ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)",
                    background: completedWeeks[i] ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.04)"
                  }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      {/* Week number + checkbox */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "12px",
                          background: completedWeeks[i] ? "rgba(52,211,153,0.2)" : "rgba(56,189,248,0.1)",
                          border: `2px solid ${completedWeeks[i] ? "#34d399" : "#38bdf8"}50`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", fontWeight: 800, color: completedWeeks[i] ? "#34d399" : "#38bdf8"
                        }}>
                          {completedWeeks[i] ? "✓" : `W${w.week}`}
                        </div>
                        <button onClick={() => toggleWeek(i)} style={{
                          fontSize: "10px", padding: "3px 8px",
                          borderRadius: "6px", border: `1px solid ${completedWeeks[i] ? "#34d399" : "#38bdf8"}50`,
                          background: "transparent", color: completedWeeks[i] ? "#34d399" : "#38bdf8",
                          cursor: "pointer", fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap"
                        }}>
                          {completedWeeks[i] ? "Undo" : "Done"}
                        </button>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{w.theme}</span>
                          {w.skills?.map(s => <Pill key={s} label={s} type="neutral" />)}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                          <div>
                            <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>DAILY TASKS</div>
                            {w.dailyTasks?.map((t, j) => (
                              <div key={j} style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>· {t}</div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>MILESTONE</div>
                            <div style={{ fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.6 }}>{w.milestone}</div>
                            {w.resource && (() => {
                              const urlMatch = w.resource.match(/https?:\/\/[^\s]+/);
                              const url = urlMatch ? urlMatch[0] : null;
                              const label = w.resource.replace(/https?:\/\/[^\s]+/, "").trim() || w.resource;
                              return (
                                <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                  <span style={{ fontSize: "11px", color: "#c084fc" }}>📚</span>
                                  {url ? (
                                    <a href={url} target="_blank" rel="noopener noreferrer"
                                      style={{ fontSize: "11px", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", wordBreak: "break-all" }}>
                                      {label || url}
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: "11px", color: "#c084fc" }}>{w.resource}</span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── CAREER INTEL TAB ── */}
        {data && activeTab === "intel" && (
          <div className="tab-pane" style={{ width: "100%", maxWidth: "1000px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 800, margin: "0 0 8px" }}>
                💡 <span style={{ color: "#fbbf24" }}>Career Intelligence</span> Report
              </h2>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Market data, salary insights, and strategic recommendations for your profile</p>
            </div>

            {intelLoading && (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <div style={{
                  width: "48px", height: "48px", border: "3px solid rgba(251,191,36,0.2)", borderTopColor: "#fbbf24",
                  borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite"
                }} />
                <p style={{ color: "var(--text-secondary)" }}>Analyzing career market data…</p>
              </div>
            )}

            {careerIntel && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Top Metrics Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                  {/* Salary */}
                  <div style={{ ...S.card, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>💰 Salary Range</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#34d399" }}>₹{careerIntel.salaryRange?.min}–{careerIntel.salaryRange?.max}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>LPA · Based on your skill profile</div>
                    <div style={{ marginTop: "14px", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)" }}>
                      <div className="intel-bar" style={{
                        height: "100%", borderRadius: "3px",
                        background: "linear-gradient(90deg,#34d399,#38bdf8)",
                        width: `${careerIntel.negotiationPower || 60}%`
                      }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "5px" }}>
                      Negotiation Power: <span style={{ color: "#34d399", fontWeight: 700 }}>{careerIntel.negotiationPower || 60}/100</span>
                    </div>
                  </div>

                  {/* Time to Hire */}
                  <div style={{ ...S.card, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>⏱️ Time to Hire</div>
                    <div style={{ fontSize: "36px", fontWeight: 900, color: "#fbbf24" }}>{careerIntel.timeToHire?.weeks || "?"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>weeks estimated</div>
                    <p style={{ fontSize: "12px", color: "var(--text-primary)", marginTop: "12px", lineHeight: 1.5 }}>
                      {careerIntel.timeToHire?.message}
                    </p>
                  </div>

                  {/* Market Demand */}
                  <div style={{ ...S.card, background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.25)" }}>
                    <div style={{ fontSize: "11px", color: "#c084fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>📈 Market Demand</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#c084fc" }}>{careerIntel.marketDemand}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>for {data.targetRole}</div>
                    <div style={{ marginTop: "12px" }}>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>Top Hiring Companies:</div>
                      <div>{careerIntel.topCompaniesHiring?.map(c => <Pill key={c} label={c} type="purple" />)}</div>
                    </div>
                  </div>
                </div>

                {/* Priority Matrix */}
                <div style={S.card}>
                  <h3 style={{ ...S.secTitle, marginBottom: "16px" }}>🎯 Importance × Difficulty Matrix</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {[
                      { label: "⚡ Quick Wins", desc: "High importance, Easy to learn → Do FIRST", action: "Quick Win", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", color: "#34d399" },
                      { label: "📚 Study Now", desc: "High importance, Medium effort → Schedule immediately", action: "Study Now", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.25)", color: "#38bdf8" },
                      { label: "🔮 Long Term", desc: "Lower priority, harder → Plan for later", action: "Long Term", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" },
                    ].map(q => {
                      const skills = (careerIntel.skillPriorityMatrix || []).filter(s => s.action === q.action);
                      return (
                        <div key={q.label} style={{
                          padding: "16px", borderRadius: "14px",
                          background: q.bg, border: `1px solid ${q.border}`
                        }}>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: q.color, marginBottom: "4px" }}>{q.label}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>{q.desc}</div>
                          {skills.length ? skills.map(s => (
                            <div key={s.skill} style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "6px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", marginBottom: "5px"
                            }}>
                              <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 600 }}>{s.skill}</span>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <span style={{
                                  fontSize: "10px", padding: "2px 7px", borderRadius: "4px",
                                  background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)"
                                }}>{s.importance}</span>
                              </div>
                            </div>
                          )) : <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>None in this quadrant</div>}
                        </div>
                      );
                    })}
                    <div style={{
                      padding: "16px", borderRadius: "14px",
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>💬 Market Insight</div>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6 }}>
                        {careerIntel.competitorInsight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", background: "var(--bg-dark)", color: "var(--text-primary)", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflowX: "hidden" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" },
  orb: { position: "fixed", width: "440px", height: "440px", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 50px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(13,8,33,0.88)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  back: { display: "flex", alignItems: "center", gap: "5px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" },
  logo: { fontSize: "18px", fontWeight: 800, cursor: "pointer", color: "var(--text-primary)" },
  avatar: { width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#fb7185,#c084fc)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 12px rgba(251,113,133,0.4)" },
  drop: { position: "absolute", right: 0, top: "50px", background: "rgba(20,10,50,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", borderRadius: "12px", width: "155px", boxShadow: "0 20px 40px rgba(0,0,0,0.7)", padding: "8px 0", zIndex: 200 },
  dropItem: { padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" },
  main: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 40px 80px", position: "relative", zIndex: 1 },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "18px", padding: "20px", backdropFilter: "blur(20px)" },
  btn: { padding: "14px 32px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#fb7185,#c084fc)", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(251,113,133,0.35)" },
  secTitle: { margin: "0 0 14px", fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" },
};