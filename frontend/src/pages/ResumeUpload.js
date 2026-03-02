import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getInitials, logout } from "../services/auth";

// ─── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 130, color }) {
  const r = size / 2 - 12, circ = 2 * Math.PI * r;
  const c = color || (score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#fb7185");
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 10px ${c})` }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)" }}>{score}%</span>
      </div>
    </div>
  );
}

// ─── Verdict Badge ───────────────────────────────────────────────────────────
function VerdictBadge({ value }) {
  const map = {
    "Highly Recommended": { color: "#34d399", bg: "rgba(52,211,153,0.12)", icon: "🏆" },
    "Good Match": { color: "#38bdf8", bg: "rgba(56,189,248,0.12)", icon: "✅" },
    "Partial Match": { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", icon: "📈" },
    "Not a Match": { color: "#fb7185", bg: "rgba(251,113,133,0.12)", icon: "⚠️" },
    "Strong Candidate": { color: "#34d399", bg: "rgba(52,211,153,0.12)", icon: "🏆" },
    "Needs Improvement": { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", icon: "📈" },
    "Not Ready": { color: "#fb7185", bg: "rgba(251,113,133,0.12)", icon: "⚠️" },
  };
  const s = map[value] || map["Partial Match"];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px",
      background: s.bg, border: `1px solid ${s.color}50`, color: s.color, fontWeight: 700, fontSize: "14px"
    }}>
      {s.icon} {value}
    </div>
  );
}

// ─── Pill ────────────────────────────────────────────────────────────────────
function Pill({ label, type }) {
  const c = {
    match: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)", text: "#34d399" },
    missing: { bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.35)", text: "#fb7185" },
    neutral: { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)", text: "#38bdf8" },
    ghost: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.4)", text: "#fbbf24" },
  }[type] || { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)", text: "#38bdf8" };
  return (
    <span style={{
      display: "inline-block", padding: "5px 13px", borderRadius: "30px", fontSize: "12px",
      fontWeight: 600, background: c.bg, border: `1px solid ${c.border}`, color: c.text, margin: "3px"
    }}>
      {label}
    </span>
  );
}

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [activeMode, setActiveMode] = useState("standard");
  const fileRef = useRef();
  const authUser = getAuthUser();
  const initials = getInitials(authUser?.name);

  // Standard mode — pre-fill from logged-in user
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [targetRole, setTargetRole] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  // JD mode
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdLoading, setJdLoading] = useState(false);
  const [jdError, setJdError] = useState("");
  const [jdResults, setJdResults] = useState(null);
  const [ghostSkills, setGhostSkills] = useState(null);
  const [ghostLoading, setGhostLoading] = useState(false);
  const [bullets, setBullets] = useState("");
  const [rewrites, setRewrites] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);

  /* ── Standard Analysis ── */
  const handleAnalyze = async () => {
    if (!name.trim() || !email.trim()) { setError("Please enter your name and email."); return; }
    if (!file) { setError("Please upload your resume PDF."); return; }
    setLoading(true); setError("");
    const fd = new FormData();
    fd.append("resume", file); fd.append("name", name);
    fd.append("email", email); fd.append("targetRole", targetRole);
    try {
      const r = await fetch("http://localhost:5000/api/users/upload-pdf", { method: "POST", body: fd });
      const d = await r.json();
      if (!d.success) { setError(d.message || "Analysis failed"); setLoading(false); return; }
      sessionStorage.setItem("analysisData", JSON.stringify(d));
      setResults(d);
    } catch { setError("Cannot reach server. Is backend running on port 5000?"); }
    setLoading(false);
  };

  /* ── JD Match ── */
  const handleJDMatch = async () => {
    if (!jdFile) { setJdError("Please upload your resume PDF."); return; }
    if (!jdText.trim() || jdText.trim().length < 50) { setJdError("Please paste the full job description (min 50 characters)."); return; }
    setJdLoading(true); setJdError(""); setJdResults(null);
    const fd = new FormData();
    fd.append("resume", jdFile); fd.append("jdText", jdText);
    try {
      const r = await fetch("http://localhost:5000/api/ai/jd-match", { method: "POST", body: fd });
      const d = await r.json();
      if (!d.success) { setJdError(d.message || "JD match failed"); } else { setJdResults(d); }
    } catch { setJdError("Cannot reach server."); }
    setJdLoading(false);
  };

  /* ── Ghost Skills ── */
  const handleGhostSkills = async () => {
    const f = activeMode === "jd" ? jdFile : file;
    if (!f) { return; }
    setGhostLoading(true); setGhostSkills(null);
    const fd = new FormData(); fd.append("resume", f);
    try {
      const r = await fetch("http://localhost:5000/api/ai/ghost-skills", { method: "POST", body: fd });
      const d = await r.json();
      if (d.success) setGhostSkills(d.ghostSkills || []);
    } catch { }
    setGhostLoading(false);
  };

  /* ── Bullet Rewriter ── */
  const handleRewrite = async () => {
    const lines = bullets.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    setRewriteLoading(true); setRewrites(null);
    try {
      const r = await fetch("http://localhost:5000/api/ai/rewrite-bullets", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullets: lines, targetRole: targetRole || "Software Engineer" }),
      });
      const d = await r.json();
      if (d.success) setRewrites(d.rewrites || []);
    } catch { }
    setRewriteLoading(false);
  };

  const Spinner = ({ color = "#38bdf8" }) => (
    <div style={{
      width: "40px", height: "40px", border: `3px solid ${color}25`, borderTopColor: color,
      borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto"
    }} />
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
        *{box-sizing:border-box;}
        input,select,textarea{font-family:inherit;color:var(--text-primary)!important;}
        input::placeholder,textarea::placeholder{color:rgba(241,240,255,0.3)!important;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:rgba(56,189,248,0.5)!important;}
        select option{background:#1a0a3a;color:#f1f0ff;}
        .drop-zone:hover{border-color:rgba(56,189,248,0.6)!important;background:rgba(56,189,248,0.06)!important;}
        .mode-btn:hover{background:rgba(255,255,255,0.08)!important;}
      `}</style>

      {/* Aurora BG */}
      <div style={S.grid} />
      <div style={{ ...S.orb, top: "-20%", left: "-8%", background: "rgba(139,0,255,0.45)", width: "700px", height: "700px" }} />
      <div style={{ ...S.orb, top: "-5%", right: "-12%", background: "rgba(0,180,255,0.28)", width: "600px", height: "600px" }} />
      <div style={{ ...S.orb, bottom: "0%", left: "30%", background: "rgba(0,230,170,0.14)", width: "550px", height: "550px" }} />
      <div style={{ ...S.orb, bottom: "-8%", right: "5%", background: "rgba(255,80,180,0.18)", width: "500px", height: "500px" }} />

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
          <span style={S.logo}>AI<span style={{ color: "#38bdf8" }}>SkillGap</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {results && <button onClick={() => navigate("/analysis")} style={S.viewBtn}>View Full Analysis →</button>}
          <div style={{ position: "relative" }}>
            <div style={S.avatar} onClick={() => setShowProfile(p => !p)}>{initials}</div>
            {showProfile && (
              <div style={S.drop}>
                <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{authUser?.name || "User"}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{authUser?.email || ""}</div>
                </div>
                <div style={S.dropItem} onClick={() => navigate("/")}>🏠 Dashboard</div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
                <div style={{ ...S.dropItem, color: "#fb7185" }} onClick={logout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ padding: "32px 50px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: "linear-gradient(135deg,#38bdf8,#c084fc)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px"
          }}>🔬</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>
              AI Resume <span style={{ color: "#38bdf8" }}>Intelligence Lab</span>
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
              ATS scoring · JD matching · Ghost skills · Bullet rewriter
            </p>
          </div>
        </div>

        {/* MODE SWITCHER */}
        <div style={{ display: "flex", gap: "8px", marginTop: "24px", marginBottom: "0" }}>
          {[
            { id: "standard", icon: "📄", label: "Standard Analysis", desc: "Upload PDF + target role" },
            { id: "jd", icon: "🎯", label: "JD Match Mode", desc: "Compare vs real job description" },
          ].map(m => (
            <button key={m.id} className="mode-btn" onClick={() => setActiveMode(m.id)} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px",
              borderRadius: "14px", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s",
              background: activeMode === m.id ? "linear-gradient(135deg,rgba(56,189,248,0.15),rgba(192,132,252,0.15))" : "rgba(255,255,255,0.04)",
              boxShadow: activeMode === m.id ? "inset 0 0 0 1.5px rgba(56,189,248,0.5)" : "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}>
              <span style={{ fontSize: "20px" }}>{m.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: activeMode === m.id ? "#38bdf8" : "var(--text-primary)" }}>{m.label}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <main style={S.main}>
        {/* ────────── STANDARD MODE ────────── */}
        {activeMode === "standard" && !results && (
          <div style={{ ...S.card, maxWidth: "600px", animation: "fadeInUp 0.4s ease" }}>
            <h2 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: 800 }}>Analyze Your Resume</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={S.field}>
                <label style={S.lbl}>Your Name</label>
                <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="Diksha" />
              </div>
              <div style={S.field}>
                <label style={S.lbl}>Email</label>
                <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
            </div>
            <div style={{ ...S.field, marginBottom: "16px" }}>
              <label style={S.lbl}>Target Role / Domain</label>
              <input
                list="role-suggestions"
                style={S.input}
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. ML Engineer, Blockchain Dev, Cyber Security..."
              />
              <datalist id="role-suggestions">
                {["SDE", "Frontend Developer", "Backend Developer", "Full Stack Developer", "ML Engineer", "Data Scientist", "DevOps Engineer", "Cloud Architect", "Cyber Security Analyst", "AI/ML Research Engineer", "Blockchain Developer", "Mobile App Developer", "iOS Developer", "Android Developer", "UI/UX Designer", "Product Manager", "Data Engineer", "Database Administrator", "Site Reliability Engineer", "Game Developer", "Embedded Systems Engineer", "Quantum Computing Researcher"].map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Type anything — or pick a suggestion</span>
            </div>
            <div style={{ ...S.field, marginBottom: "20px" }}>
              <label style={S.lbl}>Resume PDF</label>
              <div className="drop-zone" onClick={() => fileRef.current?.click()} style={S.dropzone}>
                <input ref={fileRef} type="file" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])} />
                <span style={{ fontSize: "32px", marginBottom: "8px" }}>{file ? "✅" : "📁"}</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: file ? "#34d399" : "var(--text-primary)" }}>
                  {file ? file.name : "Click to Upload PDF"}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Drag & drop · PDF files only</span>
              </div>
            </div>
            {error && <div style={S.errBox}>{error}</div>}
            <button onClick={handleAnalyze} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Analyzing with AI…" : "🔬 Analyze Resume →"}
            </button>
          </div>
        )}

        {/* Standard Results */}
        {activeMode === "standard" && results && (
          <div style={{ maxWidth: "900px", width: "100%", animation: "fadeInUp 0.4s ease" }}>
            {/* Hero score row */}
            <div style={{
              ...S.card, display: "flex", gap: "32px", alignItems: "center", marginBottom: "20px",
              background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)"
            }}>
              <ScoreRing score={results.readinessScore || 0} size={140} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "12px" }}><VerdictBadge value={results.hirability || "Needs Improvement"} /></div>
                <h2 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 800 }}>
                  {results.name} · <span style={{ color: "#38bdf8" }}>{results.targetRole}</span>
                </h2>
                <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", fontSize: "13px" }}>{results.feedback}</p>
                {results.topSkillToLearn && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px",
                    borderRadius: "10px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)"
                  }}>
                    <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px" }}>🚀 Top Skill to Learn</span>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 600 }}>{results.topSkillToLearn}</span>
                  </div>
                )}
              </div>
              {/* Multi-bar metrics */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "200px" }}>
                {[
                  { label: "Readiness", val: results.readinessScore, color: "#38bdf8" },
                  { label: "Skills Matched", val: Math.round(((results.matchedSkills?.length || 0) / Math.max(1, (results.matchedSkills?.length || 0) + (results.missingSkills?.length || 0))) * 100), color: "#34d399" },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>{m.label}</span>
                      <span style={{ fontSize: "11px", color: m.color, fontWeight: 700 }}>{m.val}%</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)" }}>
                      <div style={{
                        height: "100%", borderRadius: "3px", background: m.color, width: `${m.val}%`,
                        transition: "width 1.2s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${m.color}60`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={S.card}>
                <h3 style={S.secTitle}>✅ Matched Skills</h3>
                {(results.matchedSkills || []).map(s => <Pill key={s} label={s} type="match" />)}
              </div>
              <div style={S.card}>
                <h3 style={S.secTitle}>🔴 Missing Skills</h3>
                {(results.missingSkills || []).map(s => <Pill key={s} label={s} type="missing" />)}
              </div>
            </div>

            {/* Ghost Skills section */}
            <div style={{ ...S.card, marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ ...S.secTitle, margin: 0 }}>👻 Ghost Skills Detector</h3>
                {!ghostSkills && <button onClick={handleGhostSkills} disabled={ghostLoading}
                  style={{ ...S.smBtn, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24" }}>
                  {ghostLoading ? "Scanning…" : "🔍 Scan My Resume"}
                </button>}
              </div>
              {ghostLoading && <div style={{ padding: "20px" }}><Spinner color="#fbbf24" /></div>}
              {ghostSkills && ghostSkills.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    Found {ghostSkills.length} skills you have but didn't explicitly list:
                  </p>
                  {ghostSkills.map((g, i) => (
                    <div key={i} style={{
                      padding: "12px 16px", borderRadius: "12px",
                      background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24" }}>👻 {g.skill}</span>
                        <span style={{
                          fontSize: "10px", padding: "2px 8px", borderRadius: "5px",
                          background: g.confidence === "High" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)",
                          color: g.confidence === "High" ? "#34d399" : "#fbbf24",
                          border: `1px solid ${g.confidence === "High" ? "rgba(52,211,153,0.4)" : "rgba(251,191,36,0.4)"}`,
                          fontWeight: 600
                        }}>{g.confidence} Confidence</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>{g.evidence}</p>
                    </div>
                  ))}
                </div>
              )}
              {ghostSkills && ghostSkills.length === 0 && (
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>No ghost skills found — your resume seems comprehensive!</p>
              )}
            </div>

            {/* Bullet Rewriter */}
            <div style={S.card}>
              <h3 style={S.secTitle}>✍️ AI Bullet Point Rewriter</h3>
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                Paste your weak resume bullet points (one per line) → AI rewrites them with action verbs + metrics
              </p>
              <textarea value={bullets} onChange={e => setBullets(e.target.value)}
                placeholder={"worked on frontend features\nhelped backend team with APIs\ndid database optimization"}
                style={{ ...S.input, height: "100px", resize: "vertical", marginBottom: "12px" }} />
              <button onClick={handleRewrite} disabled={rewriteLoading || !bullets.trim()} style={S.smBtn}>
                {rewriteLoading ? "Rewriting…" : "✨ Rewrite Bullets"}
              </button>
              {rewriteLoading && <div style={{ marginTop: "20px" }}><Spinner color="#38bdf8" /></div>}
              {rewrites && rewrites.map((rw, i) => (
                <div key={i} style={{
                  marginTop: "12px", borderRadius: "14px", overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ padding: "12px 16px", background: "rgba(251,113,133,0.08)" }}>
                    <div style={{ fontSize: "11px", color: "#fb7185", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>ORIGINAL</div>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>{rw.original}</div>
                  </div>
                  <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)" }}>
                    <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px" }}>REWRITTEN</div>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{rw.rewritten}</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "rgba(56,189,248,0.05)" }}>
                    <span style={{ fontSize: "11px", color: "#38bdf8" }}>💡 {rw.improvement}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button onClick={() => navigate("/analysis")} style={S.btn}>View Full Career Intelligence →</button>
            </div>
          </div>
        )}

        {/* ────────── JD MATCH MODE ────────── */}
        {activeMode === "jd" && !jdResults && (
          <div style={{ maxWidth: "700px", width: "100%", animation: "fadeInUp 0.4s ease" }}>
            <div style={S.card}>
              <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 800 }}>🎯 JD Match Analysis</h2>
              <p style={{ margin: "0 0 24px", color: "var(--text-secondary)", fontSize: "13px" }}>
                Upload your resume + paste a real job description → get a precision match score
              </p>

              <div style={{ ...S.field, marginBottom: "16px" }}>
                <label style={S.lbl}>Resume PDF</label>
                <div className="drop-zone" onClick={() => document.getElementById("jd-file-input")?.click()} style={S.dropzone}>
                  <input id="jd-file-input" type="file" accept=".pdf" hidden onChange={e => setJdFile(e.target.files[0])} />
                  <span style={{ fontSize: "28px", marginBottom: "6px" }}>{jdFile ? "✅" : "📁"}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: jdFile ? "#34d399" : "var(--text-primary)" }}>
                    {jdFile ? jdFile.name : "Upload Resume PDF"}
                  </span>
                </div>
              </div>

              <div style={{ ...S.field, marginBottom: "20px" }}>
                <label style={S.lbl}>Paste Job Description</label>
                <textarea value={jdText} onChange={e => setJdText(e.target.value)}
                  placeholder={"Paste the full job description here…\n\nWe are looking for a Senior Software Engineer with 3+ years of experience in React, Node.js, and cloud technologies…"}
                  style={{ ...S.input, height: "180px", resize: "vertical" }} />
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {jdText.length} characters · Min 50 required
                </span>
              </div>

              {jdError && <div style={S.errBox}>{jdError}</div>}
              <button onClick={handleJDMatch} disabled={jdLoading} style={{ ...S.btn, opacity: jdLoading ? 0.7 : 1 }}>
                {jdLoading ? "🔍 Matching against JD…" : "🎯 Match My Resume to JD"}
              </button>
            </div>
          </div>
        )}

        {/* JD Results */}
        {activeMode === "jd" && jdResults && (
          <div style={{ maxWidth: "900px", width: "100%", animation: "fadeInUp 0.4s ease" }}>
            {/* Hero Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" }}>
              {[
                { label: "JD Match", value: jdResults.jdMatchScore, color: "#38bdf8" },
                { label: "ATS Score", value: jdResults.atsScore, color: "#34d399" },
                { label: "Technical Fit", value: jdResults.technicalFit, color: "#c084fc" },
                { label: "Keyword Density", value: jdResults.keywordDensity, color: "#fbbf24" },
              ].map(m => (
                <div key={m.label} style={{ ...S.card, textAlign: "center" }}>
                  <ScoreRing score={m.value || 0} size={100} color={m.color} />
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div style={{ ...S.card, marginBottom: "16px", textAlign: "center" }}>
              <VerdictBadge value={jdResults.verdict || "Partial Match"} />
              <p style={{ margin: "14px 0 0", fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.7 }}>
                {jdResults.summaryFeedback}
              </p>
            </div>

            {/* Keywords */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={S.card}>
                <h3 style={S.secTitle}>✅ Matched Keywords</h3>
                {(jdResults.jdMatchedKeywords || []).map(k => <Pill key={k} label={k} type="match" />)}
              </div>
              <div style={S.card}>
                <h3 style={S.secTitle}>🔴 Missing JD Keywords</h3>
                {(jdResults.jdMissingKeywords || []).map(k => <Pill key={k} label={k} type="missing" />)}
              </div>
            </div>

            {/* ATS Issues + Recommendations */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={S.card}>
                <h3 style={S.secTitle}>⚠️ ATS Issues</h3>
                {(jdResults.atsIssues || []).map((i, idx) => (
                  <div key={idx} style={{
                    padding: "10px 14px", borderRadius: "10px", marginBottom: "8px",
                    background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.2)"
                  }}>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>⚠️ {i}</span>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <h3 style={S.secTitle}>💡 Top Recommendations</h3>
                {(jdResults.topRecommendations || []).map((r, idx) => (
                  <div key={idx} style={{
                    padding: "10px 14px", borderRadius: "10px", marginBottom: "8px",
                    background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.2)"
                  }}>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>→ {r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => { setJdResults(null); setGhostSkills(null); }} style={S.smBtn}>← New Analysis</button>
              <button onClick={() => { setActiveMode("standard"); }} style={S.smBtn}>Switch to Standard Mode</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", backgroundImage: "url('/resume-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "var(--text-primary)", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflowX: "hidden" },
  grid: { position: "fixed", inset: 0, background: "rgba(5,2,20,0.76)", backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" },
  orb: { position: "fixed", width: "440px", height: "440px", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 50px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(13,8,33,0.88)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  back: { display: "flex", alignItems: "center", gap: "5px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" },
  logo: { fontSize: "18px", fontWeight: 800, cursor: "pointer", color: "var(--text-primary)" },
  avatar: { width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#38bdf8,#c084fc)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", cursor: "pointer" },
  drop: { position: "absolute", right: 0, top: "50px", background: "rgba(20,10,50,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", borderRadius: "12px", width: "155px", boxShadow: "0 20px 40px rgba(0,0,0,0.7)", padding: "8px 0", zIndex: 200 },
  dropItem: { padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" },
  viewBtn: { padding: "8px 18px", borderRadius: "10px", border: "1px solid rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.1)", color: "#38bdf8", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  main: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 40px 80px", position: "relative", zIndex: 1 },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderTop: "1px solid rgba(255,255,255,0.14)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(20px)" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  lbl: { fontSize: "11px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "11px", padding: "12px 14px", fontSize: "13px", width: "100%", transition: "border-color 0.2s", color: "var(--text-primary)" },
  dropzone: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 20px", borderRadius: "14px", border: "2px dashed rgba(56,189,248,0.35)", cursor: "pointer", transition: "all 0.25s ease", width: "100%", minHeight: "130px", background: "rgba(56,189,248,0.03)" },
  btn: { width: "100%", padding: "15px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#38bdf8,#c084fc)", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(56,189,248,0.25)", transition: "all 0.3s", letterSpacing: "0.3px" },
  smBtn: { padding: "10px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" },
  errBox: { color: "#fb7185", fontSize: "13px", padding: "10px 14px", background: "rgba(251,113,133,0.08)", borderRadius: "10px", border: "1px solid rgba(251,113,133,0.2)", marginBottom: "12px" },
  secTitle: { margin: "0 0 12px", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" },
};