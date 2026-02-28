import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pill({ label, type }) {
  const c = {
    match: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#22c55e" },
    missing: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
    neutral: { bg: "rgba(91,140,255,0.12)", border: "rgba(91,140,255,0.3)", text: "#5b8cff" },
    purple: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)", text: "#a855f7" },
  }[type] || { bg: "rgba(91,140,255,0.12)", border: "rgba(91,140,255,0.3)", text: "#5b8cff" };
  return (
    <span style={{ display: "inline-block", padding: "5px 13px", borderRadius: "30px", fontSize: "12px", fontWeight: 600, background: c.bg, border: `1px solid ${c.border}`, color: c.text, margin: "3px" }}>
      {label}
    </span>
  );
}

function ScoreRing({ score, size = 160 }) {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Strong Candidate" : score >= 40 ? "Needs Improvement" : "Not Ready";
  useEffect(() => { const t = setTimeout(() => setAnim(score), 200); return () => clearTimeout(t); }, [score]);
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
        <span style={{ fontSize: "32px", fontWeight: 900, color: "#f8fafc", lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: "9px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", marginTop: "4px" }}>Readiness</span>
      </div>
    </div>
  );
}

function HirabilityBadge({ value }) {
  const map = {
    "Strong Candidate": { color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: "🏆" },
    "Needs Improvement": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "📈" },
    "Not Ready": { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "⚠️" },
  };
  const s = map[value] || map["Needs Improvement"];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "30px", background: s.bg, border: `1px solid ${s.color}40`, color: s.color, fontWeight: 700, fontSize: "14px" }}>
      {s.icon} {value}
    </div>
  );
}

export default function Analysis() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisData");
    if (stored) {
      try { setData(JSON.parse(stored)); }
      catch { setNoData(true); }
    } else {
      setNoData(true);
    }
  }, []);

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeInUp { from {opacity:0;transform:translateY(18px);} to {opacity:1;transform:translateY(0);} }
        @keyframes spin { to {transform:rotate(360deg);} }
        * { box-sizing:border-box; }
      `}</style>
      <div style={S.grid} />
      <div style={{ ...S.orb, top: "-80px", left: "5%", background: "rgba(91,140,255,0.13)" }} />
      <div style={{ ...S.orb, bottom: "-60px", right: "5%", background: "rgba(168,85,247,0.1)", width: "380px", height: "380px" }} />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={S.back} onClick={() => navigate("/")}
            onMouseEnter={e => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.transform = "translateX(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = "translateX(0)"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </div>
          <span style={S.logo} onClick={() => navigate("/")}><span style={{ color: "#5b8cff" }}>AI</span> Skill Gap</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={S.avatar} onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >DK</div>
          {showProfile && (
            <div style={S.drop}>
              <div style={S.dropItem}>View Profile</div>
              <div style={{ ...S.dropItem, color: "#ef4444" }}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      <main style={S.main}>
        {/* ── No Data ── */}
        {noData && (
          <div style={{ ...S.card, maxWidth: "460px", textAlign: "center", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📋</div>
            <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: 800 }}>No Analysis Yet</h2>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", margin: "0 0 24px" }}>
              Upload your resume first to get your AI-powered skill gap analysis with personalized feedback.
            </p>
            <button onClick={() => navigate("/resume")} style={S.btn}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 14px 32px rgba(91,140,255,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(91,140,255,0.2)"}>
              Upload Resume →
            </button>
          </div>
        )}

        {/* ── Full Analysis ── */}
        {data && (
          <div style={{ maxWidth: "860px", width: "100%", animation: "fadeInUp 0.4s ease" }}>

            {/* Hero Row */}
            <div style={{ ...S.card, marginBottom: "16px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "center" }}>
              <ScoreRing score={data.readinessScore || 0} size={160} />
              <div>
                <div style={{ marginBottom: "12px" }}>
                  <HirabilityBadge value={data.hirability || "Needs Improvement"} />
                </div>
                <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" }}>
                  {data.name}'s <span style={{ background: "linear-gradient(135deg,#5b8cff,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analysis Report</span>
                </h1>
                <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "14px" }}>
                  Target Role: <span style={{ color: "#5b8cff", fontWeight: 700 }}>{data.targetRole}</span>
                  &nbsp;·&nbsp; {(data.matchedSkills || []).length} of {data.totalRequired} required skills matched
                </p>
                <div style={S.feedback}>
                  <span style={{ marginRight: "8px" }}>💡</span>{data.feedback}
                </div>
                {data.topSkillToLearn && (
                  <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                    <span style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", padding: "4px 12px", borderRadius: "20px", fontWeight: 600 }}>
                      🎯 Top skill to learn: {data.topSkillToLearn}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div style={S.card}>
                <h3 style={{ ...S.sec, color: "#22c55e" }}>✅ Matched Skills ({(data.matchedSkills || []).length})</h3>
                {(data.matchedSkills || []).length > 0
                  ? (data.matchedSkills || []).map((s, i) => <Pill key={i} label={s} type="match" />)
                  : <p style={S.empty}>No matching skills found.</p>}
              </div>
              <div style={S.card}>
                <h3 style={{ ...S.sec, color: "#ef4444" }}>⚠️ Missing Skills ({(data.missingSkills || []).length})</h3>
                {(data.missingSkills || []).length > 0
                  ? (data.missingSkills || []).map((s, i) => <Pill key={i} label={s} type="missing" />)
                  : <p style={{ color: "#22c55e", fontSize: "13px", margin: 0, fontWeight: 600 }}>🎉 You have all required skills!</p>}
              </div>
            </div>

            {/* Strengths + Gaps */}
            {((data.strengths || []).length > 0 || (data.skillGaps || []).length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                {(data.strengths || []).length > 0 && (
                  <div style={S.card}>
                    <h3 style={{ ...S.sec, color: "#5b8cff" }}>🌟 AI-Identified Strengths</h3>
                    {data.strengths.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ color: "#5b8cff", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>▸</span>
                        <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {(data.skillGaps || []).length > 0 && (
                  <div style={S.card}>
                    <h3 style={{ ...S.sec, color: "#f59e0b" }}>🎯 Critical Skill Gaps</h3>
                    {data.skillGaps.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ color: "#f59e0b", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>▸</span>
                        <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Plan */}
            {(data.actionPlan || []).length > 0 && (
              <div style={{ ...S.card, marginBottom: "14px" }}>
                <h3 style={{ ...S.sec, color: "#a855f7" }}>🚀 Your AI Action Plan</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                  {data.actionPlan.map((step, i) => (
                    <div key={i} style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: "14px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#5b8cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Skills */}
            {(data.extractedSkills || []).length > 0 && (
              <div style={{ ...S.card, marginBottom: "14px" }}>
                <h3 style={S.sec}>🔍 All Extracted Skills ({(data.extractedSkills || []).length})</h3>
                {data.extractedSkills.map((s, i) => <Pill key={i} label={s} type="neutral" />)}
              </div>
            )}

            {/* CTA */}
            <div style={{ display: "flex", gap: "12px", flexDirection: "row-reverse" }}>
              <button onClick={() => navigate("/resume")} style={{ ...S.btn, flex: 1 }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 14px 32px rgba(91,140,255,0.4)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(91,140,255,0.2)"}>
                Re-analyze Resume →
              </button>
              <button onClick={() => navigate("/")} style={S.secBtn}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", background: "#070b14", color: "#f8fafc", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflowX: "hidden" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "40px 40px", zIndex: 0, pointerEvents: "none" },
  orb: { position: "fixed", width: "440px", height: "440px", borderRadius: "50%", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 50px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(7,11,20,0.82)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  back: { display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" },
  logo: { fontSize: "19px", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.5px" },
  avatar: { width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg,#5b8cff,#8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(91,140,255,0.3)", transition: "transform 0.2s" },
  drop: { position: "absolute", right: 0, top: "52px", background: "rgba(15,23,42,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: "12px", width: "155px", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", padding: "8px 0", zIndex: 200 },
  dropItem: { padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#e2e8f0" },
  main: { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 40px 80px", position: "relative", zIndex: 1 },
  card: { background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: "22px", padding: "26px", backdropFilter: "blur(16px)", boxShadow: "0 28px 55px rgba(0,0,0,0.4)", width: "100%" },
  feedback: { background: "rgba(91,140,255,0.07)", border: "1px solid rgba(91,140,255,0.15)", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" },
  btn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#5b8cff,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(91,140,255,0.2)", transition: "all 0.3s" },
  secBtn: { padding: "14px 22px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  sec: { fontSize: "13px", fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" },
  empty: { fontSize: "13px", color: "#475569", margin: 0, fontStyle: "italic" },
};