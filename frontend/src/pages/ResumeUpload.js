import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";
const ROLES = ["SDE", "Frontend Developer", "Full Stack Developer", "Backend Developer", "Data Scientist", "DevOps Engineer"];

function Pill({ label, type }) {
  const c = {
    match: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#22c55e" },
    missing: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
    neutral: { bg: "rgba(91,140,255,0.1)", border: "rgba(91,140,255,0.3)", text: "#5b8cff" },
  }[type] || { bg: "rgba(91,140,255,0.1)", border: "rgba(91,140,255,0.3)", text: "#5b8cff" };
  return (
    <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: "30px", fontSize: "12px", fontWeight: 600, background: c.bg, border: `1px solid ${c.border}`, color: c.text, margin: "3px" }}>
      {label}
    </span>
  );
}

function ScoreCircle({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", width: "130px", height: "130px", margin: "0 auto 20px" }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.4s ease", filter: `drop-shadow(0 0 8px ${color})` }}
          transform="rotate(-90 65 65)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: 800, color: "#f8fafc", lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px" }}>Readiness</span>
      </div>
    </div>
  );
}

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState("SDE");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!name.trim() || !email.trim()) { setError("Please enter your name and email."); return; }
    if (!file) { setError("Please select a PDF file."); return; }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("targetRole", targetRole);

      const res = await fetch(`${API}/api/users/upload-pdf`, {
        method: "POST",
        body: formData, // no Content-Type header — browser sets it with boundary
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("analysisData", JSON.stringify(data));
        setResults(data);
        setShowResults(true);
      } else {
        setError(data.message || "Analysis failed.");
      }
    } catch (e) {
      setError("Cannot reach server. Is the backend running on port 5000?");
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; }
        input,select { font-family:inherit; color:#f8fafc !important; }
        input::placeholder { color:#475569 !important; }
        input:focus,select:focus { outline:none; }
        select option { background:#111827; color:#f8fafc; }
      `}</style>

      <div style={S.grid} />
      <div style={{ ...S.orb, top: "-80px", left: "5%", background: "rgba(91,140,255,0.14)" }} />
      <div style={{ ...S.orb, bottom: "-80px", right: "5%", background: "rgba(168,85,247,0.11)", width: "360px", height: "360px" }} />

      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div style={S.back} onClick={() => navigate("/")}
            onMouseEnter={e => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.transform = "translateX(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = "translateX(0)"; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </div>
          <span style={S.logo} onClick={() => navigate("/")}><span style={{ color: "#5b8cff" }}>AI</span> Skill Gap</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={S.avatar} onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >DK</div>
          {showProfile && (
            <div style={S.drop}>
              <div style={S.dropItem}>View Profile</div>
              <div style={S.dropItem}>Edit Profile</div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
              <div style={{ ...S.dropItem, color: "#ef4444" }}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      <main style={S.main}>
        {!showResults ? (
          /* ════ UPLOAD FORM ════ */
          <div style={{ ...S.card, maxWidth: "580px", animation: "fadeInUp 0.4s ease" }}>
            <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Analyze Your Resume
            </h1>
            <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "13px" }}>
              Upload your PDF resume — we'll extract your skills and generate your AI readiness report instantly.
            </p>

            {/* Identity row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={S.field}>
                <label style={S.lbl}>Your Name</label>
                <input placeholder="Diksha" value={name} onChange={e => setName(e.target.value)} style={S.input}
                  onFocus={e => (e.target.style.borderColor = "rgba(91,140,255,0.55)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
              </div>
              <div style={S.field}>
                <label style={S.lbl}>Email</label>
                <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={S.input}
                  onFocus={e => (e.target.style.borderColor = "rgba(91,140,255,0.55)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
              </div>
              <div style={S.field}>
                <label style={S.lbl}>Target Role</label>
                <input
                  list="roles"
                  placeholder="e.g. Frontend Developer"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  style={S.input}
                  onFocus={e => (e.target.style.borderColor = "rgba(91,140,255,0.55)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <datalist id="roles">
                  {ROLES.map(r => <option key={r} value={r} />)}
                </datalist>
              </div>
            </div>

            {/* PDF Drop Zone */}
            <div style={S.field}>
              <label style={S.lbl}>Resume PDF</label>
              <label
                style={{
                  ...S.dropzone,
                  borderColor: file ? "rgba(91,140,255,0.55)" : "rgba(255,255,255,0.1)",
                  background: file ? "rgba(91,140,255,0.07)" : "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(91,140,255,0.4)"; e.currentTarget.style.background = "rgba(91,140,255,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = file ? "rgba(91,140,255,0.55)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.background = file ? "rgba(91,140,255,0.07)" : "rgba(255,255,255,0.02)"; }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(91,140,255,0.7)"; }}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type === "application/pdf") { setFile(f); setError(""); } else { setError("Please drop a PDF file."); } }}
              >
                <input type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
                  onChange={e => { setFile(e.target.files[0]); setError(""); }} />
                {file ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#f1f5f9", fontSize: "14px" }}>{file.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#5b8cff" }}>Click to change file</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "36px", marginBottom: "12px" }}>📂</div>
                    <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#e2e8f0", fontSize: "14px" }}>Click to Upload PDF</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>or drag & drop · PDF files only</p>
                  </div>
                )}
              </label>
            </div>

            {error && <div style={S.errBox}>{error}</div>}

            <button onClick={handleAnalyze} disabled={loading} style={{ ...S.btn, marginTop: "20px", opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 14px 32px rgba(91,140,255,0.45)"; }}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(91,140,255,0.2)")}
            >
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Analyzing...
                </span>
                : "Analyze Resume →"}
            </button>
          </div>
        ) : (
          /* ════ RESULTS ════ */
          <div style={{ maxWidth: "720px", width: "100%", animation: "fadeInUp 0.4s ease" }}>
            {/* Score */}
            <div style={{ ...S.card, textAlign: "center", marginBottom: "14px" }}>
              <ScoreCircle score={results.readinessScore} />
              <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800 }}>
                {results.name}'s Readiness Score
              </h2>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 14px" }}>
                Role: <span style={{ color: "#5b8cff", fontWeight: 700 }}>{results.targetRole}</span>
                &nbsp;·&nbsp;{results.matchedSkills.length}/{results.totalRequired} required skills matched
              </p>
              <div style={S.feedback}>💡 {results.feedback}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div style={S.card}>
                <h3 style={{ ...S.secHead, color: "#22c55e" }}>✅ Matched Skills ({results.matchedSkills.length})</h3>
                {results.matchedSkills.length > 0
                  ? results.matchedSkills.map((s, i) => <Pill key={i} label={s} type="match" />)
                  : <p style={S.empty}>No matching skills found. Try uploading a more detailed resume.</p>}
              </div>
              <div style={S.card}>
                <h3 style={{ ...S.secHead, color: "#ef4444" }}>⚠️ Missing Skills ({results.missingSkills.length})</h3>
                {results.missingSkills.length > 0
                  ? results.missingSkills.map((s, i) => <Pill key={i} label={s} type="missing" />)
                  : <p style={{ color: "#22c55e", fontSize: "13px", margin: 0, fontWeight: 600 }}>🎉 You have all required skills!</p>}
              </div>
            </div>

            <div style={{ ...S.card, marginBottom: "14px" }}>
              <h3 style={S.secHead}>🔍 All Extracted Skills ({results.extractedSkills.length})</h3>
              {results.extractedSkills.length > 0
                ? results.extractedSkills.map((s, i) => <Pill key={i} label={s} type="neutral" />)
                : <p style={S.empty}>No skills detected. Your PDF may be image-based (scanned).</p>}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexDirection: "row-reverse" }}>
              <button onClick={() => navigate("/analysis")} style={{ ...S.btn, flex: 1 }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 14px 32px rgba(91,140,255,0.45)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(91,140,255,0.2)")}
              >View Full Analysis →</button>
              <button onClick={() => { setShowResults(false); setFile(null); setResults(null); }} style={S.secBtn}>
                Analyze Another
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
  main: { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "44px 40px 80px", position: "relative", zIndex: 1 },
  card: { background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: "22px", padding: "30px", backdropFilter: "blur(16px)", boxShadow: "0 28px 55px rgba(0,0,0,0.45)", width: "100%" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  lbl: { fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.7px" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "11px", padding: "12px 14px", fontSize: "13px", width: "100%", transition: "border-color 0.2s", color: "#f8fafc" },
  dropzone: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 20px", borderRadius: "16px", border: "2px dashed", cursor: "pointer", transition: "all 0.25s ease", width: "100%", minHeight: "160px" },
  btn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#5b8cff,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(91,140,255,0.2)", transition: "all 0.3s" },
  secBtn: { padding: "14px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  errBox: { color: "#ef4444", fontSize: "13px", padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)", marginTop: "12px" },
  feedback: { background: "rgba(91,140,255,0.07)", border: "1px solid rgba(91,140,255,0.15)", borderRadius: "12px", padding: "13px 16px", fontSize: "13px", color: "#94a3b8", lineHeight: "1.7", textAlign: "left" },
  secHead: { fontSize: "13px", fontWeight: 700, margin: "0 0 10px" },
  empty: { fontSize: "13px", color: "#475569", margin: 0, fontStyle: "italic" },
};