import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getInitials, logout } from "../services/auth";
import { API_URL } from "../config";

/* ─── Animated SVG Score Ring ─── */
function ScoreRing({ score, size = 160, stroke = 14, color = "#5b8cff" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnim(score), 100);
    return () => clearTimeout(timer);
  }, [score]);
  const offset = circ - (anim / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}

/* ─── Difficulty Bar ─── */
function DiffBar({ label, value, max, color, glow }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(Math.min(100, max > 0 ? (value / max) * 100 : 0)), 200); return () => clearTimeout(t); }, [value, max]);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "99px",
          background: color, boxShadow: `0 0 8px ${glow}`,
          width: `${w}%`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)"
        }} />
      </div>
    </div>
  );
}

/* ─── Priority Badge ─── */
const priorityColors = { High: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "rgba(239,68,68,0.3)" }, Medium: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" }, Low: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", border: "rgba(34,197,94,0.3)" } };
function PriorityChip({ label, priority }) {
  const c = priorityColors[priority] || priorityColors.Medium;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "8px" }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", flex: 1 }}>{label}</span>
      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{priority}</span>
    </div>
  );
}

/* ─── Level Badge ─── */
const levelConfig = {
  Beginner: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", icon: "🌱" },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚡" },
  Advanced: { color: "#5b8cff", bg: "rgba(91,140,255,0.12)", icon: "🚀" },
  Expert: { color: "#a855f7", bg: "rgba(168,85,247,0.12)", icon: "💎" },
};

export default function CodingStats() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({ easy: "", medium: "", hard: "", platform: "LeetCode", targetRole: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  const authUser = getAuthUser();
  const userName = getInitials(authUser?.name);

  /* ─── Load saved stats on mount ─── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setFetching(false); return; }
    fetch(`${API_URL}/api/coding-stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); } catch (e) { throw new Error("spinning_up"); }
      })
      .then(data => {
        if (data.success && data.codingStats) {
          const s = data.codingStats;
          setStats({
            easy: s.easy || "",
            medium: s.medium || "",
            hard: s.hard || "",
            platform: s.platform || "LeetCode",
            targetRole: s.targetRole || "",
          });
          if (s.lastAnalysis) setAnalysis(s.lastAnalysis);
        }
      })
      .catch(() => { })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "platform" || name === "targetRole") { setStats({ ...stats, [name]: value }); return; }
    const val = Math.max(0, Number(value));
    setStats({ ...stats, [name]: value === "" ? "" : val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) { setError("Please log in to analyze your coding stats."); return; }
    const total = (Number(stats.easy) || 0) + (Number(stats.medium) || 0) + (Number(stats.hard) || 0);
    if (total === 0) { setError("Please enter at least one problem count."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/coding-stats/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          easy: Number(stats.easy) || 0,
          medium: Number(stats.medium) || 0,
          hard: Number(stats.hard) || 0,
          platform: stats.platform,
          targetRole: stats.targetRole || "Software Engineer",
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("spinning_up"); }
      if (!data.success) throw new Error(data.message || "Analysis failed");
      setAnalysis(data.analysis);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err.message === "spinning_up" ? "Backend is spinning up (free tier). Please wait ~50s." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const level = analysis?.level || "Beginner";
  const lc = levelConfig[level] || levelConfig.Beginner;
  const total = (Number(stats.easy) || 0) + (Number(stats.medium) || 0) + (Number(stats.hard) || 0);
  const maxVal = Math.max(Number(stats.easy) || 0, Number(stats.medium) || 0, Number(stats.hard) || 0, 1);

  return (
    <div style={S.page}>
      {/* Background */}
      <div style={S.gridOverlay} />
      <div style={{ ...S.orb, top: "-20%", left: "-8%", background: "rgba(91,140,255,0.3)", width: "700px", height: "700px" }} />
      <div style={{ ...S.orb, top: "-5%", right: "-12%", background: "rgba(168,85,247,0.2)", width: "600px", height: "600px" }} />
      <div style={{ ...S.orb, bottom: "-8%", right: "5%", background: "rgba(255,80,180,0.12)", width: "500px", height: "500px" }} />

      {/* NAVBAR */}
      <nav style={S.navbar}>
        <div style={S.navLeft}>
          <div style={S.backButton} onClick={() => navigate(-1)}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = ""; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </div>
          <div style={S.logo} onClick={() => navigate("/")}>
            <span style={{ color: "var(--accent-blue, #5b8cff)" }}>AI</span> Skill Gap
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={S.profileIcon} onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
            {userName}
          </div>
          {showProfile && (
            <div style={S.dropdown}>
              <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "4px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>{authUser?.name || "User"}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{authUser?.email || ""}</div>
              </div>
              <div style={S.dropdownItem} onClick={() => navigate("/profile")}>View Profile</div>
              <div style={S.dropdownItem} onClick={() => navigate("/settings")}>Settings</div>
              <div style={S.dropdownDivider} />
              <div style={{ ...S.dropdownItem, color: "#ef4444" }} onClick={() => { logout(); }}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={S.main}>

        {/* ── HERO / INPUT SECTION ── */}
        <div style={S.hero}>
          {/* Left: headline */}
          <div style={S.heroLeft}>
            <div style={S.iconBadge}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h1 style={S.heading}>
              Visualize Your<br />
              <span style={S.gradientText}>Coding Journey</span>
            </h1>
            <p style={S.desc}>
              Log your algorithmic problem-solving progress. Our AI will analyze your session, score your readiness, and generate a targeted improvement roadmap.
            </p>

            {/* Quick stats pills */}
            {total > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" }}>
                {[
                  { label: "Easy", v: stats.easy, color: "#22c55e" },
                  { label: "Medium", v: stats.medium, color: "#f59e0b" },
                  { label: "Hard", v: stats.hard, color: "#ef4444" },
                ].map(item => (
                  <div key={item.label} style={{ padding: "6px 16px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: `1px solid ${item.color}40`, fontSize: "13px", fontWeight: 600 }}>
                    <span style={{ color: item.color }}>{item.v || 0}</span> {item.label}
                  </div>
                ))}
                <div style={{ padding: "6px 16px", borderRadius: "99px", background: "rgba(91,140,255,0.1)", border: "1px solid rgba(91,140,255,0.3)", fontSize: "13px", fontWeight: 700, color: "#5b8cff" }}>
                  {total} Total
                </div>
              </div>
            )}
          </div>

          {/* Right: form card */}
          <div style={S.card}>
            {fetching ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading saved stats…</div>
            ) : (
              <form onSubmit={handleSubmit} style={S.form}>
                <div style={S.formTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                  Problem Stats
                </div>

                {/* Platform */}
                <div style={S.inputGroup}>
                  <label style={S.label}>Platform</label>
                  <select name="platform" value={stats.platform} onChange={handleChange} style={{ ...S.input, cursor: "pointer" }}>
                    {["LeetCode", "HackerRank", "Codeforces", "CodeChef", "GeeksforGeeks"].map(p => (
                      <option key={p} value={p} style={{ background: "#0d0821" }}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Easy */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    <span style={{ ...S.dot, background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
                    Easy Problems
                  </label>
                  <input type="number" min="0" name="easy" placeholder="e.g., 80" value={stats.easy} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>

                {/* Medium */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    <span style={{ ...S.dot, background: "#f59e0b", boxShadow: "0 0 8px rgba(245,158,11,0.5)" }} />
                    Medium Problems
                  </label>
                  <input type="number" min="0" name="medium" placeholder="e.g., 45" value={stats.medium} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>

                {/* Hard */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    <span style={{ ...S.dot, background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.5)" }} />
                    Hard Problems
                  </label>
                  <input type="number" min="0" name="hard" placeholder="e.g., 12" value={stats.hard} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = "#ef4444"; e.target.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>

                {/* Target Role */}
                <div style={S.inputGroup}>
                  <label style={S.label}>
                    <span style={{ ...S.dot, background: "#5b8cff", boxShadow: "0 0 8px rgba(91,140,255,0.5)" }} />
                    Target Role
                  </label>
                  <input type="text" name="targetRole" placeholder="e.g., SDE-2 at Google" value={stats.targetRole} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = "#5b8cff"; e.target.style.boxShadow = "0 0 0 3px rgba(91,140,255,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>

                {error && (
                  <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "13px" }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{ ...S.button, opacity: loading ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 15px 35px rgba(91,140,255,0.45)"; e.currentTarget.style.transform = "scale(1.02)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(91,140,255,0.25)"; e.currentTarget.style.transform = ""; }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <span style={S.spinner} /> Analyzing with AI…
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                      Analyze My Progress
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── ANALYSIS RESULTS ── */}
        {analysis && (
          <div ref={resultsRef} style={S.resultsSection}>
            <div style={S.resultsHeader}>
              <h2 style={S.resultsTitle}>
                <span style={S.gradientText}>AI Analysis</span> Results
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginTop: "6px" }}>
                Powered by LLM — based on your {stats.platform} statistics
              </p>
            </div>

            {/* TOP ROW: Score Ring + Summary Cards */}
            <div style={S.topRow}>

              {/* Score Ring Card */}
              <div style={S.scoreCard}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "160px", height: "160px", margin: "0 auto 20px" }}>
                  <ScoreRing score={analysis.overallScore || 0} color={lc.color} />
                  <div style={{ position: "absolute", textAlign: "center" }}>
                    <div style={{ fontSize: "36px", fontWeight: 800, color: lc.color, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{analysis.overallScore}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: "2px" }}>/ 100</div>
                  </div>
                </div>
                <div style={{ ...S.levelBadge, background: lc.bg, color: lc.color, border: `1px solid ${lc.color}40` }}>
                  {lc.icon} {level}
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "12px", textAlign: "center" }}>Overall Score</p>
              </div>

              {/* Readiness + Distribution */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Interview Readiness */}
                <div style={S.innerCard}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Interview Readiness</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ flex: 1, height: "10px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <ReadinessBar val={analysis.estimatedReadiness || 0} />
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: "#5b8cff", fontFamily: "'Outfit', sans-serif", minWidth: "50px" }}>{analysis.estimatedReadiness}%</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>Estimated chance of passing coding rounds</p>
                </div>

                {/* Problem Distribution */}
                <div style={S.innerCard}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Problem Distribution</div>
                  <DiffBar label="Easy" value={Number(stats.easy) || 0} max={maxVal} color="#22c55e" glow="rgba(34,197,94,0.4)" />
                  <DiffBar label="Medium" value={Number(stats.medium) || 0} max={maxVal} color="#f59e0b" glow="rgba(245,158,11,0.4)" />
                  <DiffBar label="Hard" value={Number(stats.hard) || 0} max={maxVal} color="#ef4444" glow="rgba(239,68,68,0.4)" />
                  {analysis.problemDistributionFeedback && (
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px", lineHeight: "1.6" }}>{analysis.problemDistributionFeedback}</p>
                  )}
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: Strengths + Weaknesses */}
            <div style={S.midRow}>
              <div style={S.innerCard}>
                <div style={S.sectionLabel}>
                  <span style={{ color: "#22c55e", fontSize: "16px" }}>✓</span> Strengths
                </div>
                <ul style={S.list}>
                  {(analysis.strengths || []).map((s, i) => (
                    <li key={i} style={S.listItem}>
                      <span style={{ ...S.bullet, background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={S.innerCard}>
                <div style={S.sectionLabel}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>✗</span> Areas to Improve
                </div>
                <ul style={S.list}>
                  {(analysis.weaknesses || []).map((w, i) => (
                    <li key={i} style={S.listItem}>
                      <span style={{ ...S.bullet, background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.5)" }} />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BOTTOM ROW: Next Steps + Topics */}
            <div style={S.midRow}>
              {/* Next Steps */}
              <div style={S.innerCard}>
                <div style={S.sectionLabel}>
                  <span style={{ color: "#5b8cff", fontSize: "16px" }}>→</span> Next Steps
                </div>
                <ol style={{ ...S.list, paddingLeft: "0", listStyle: "none" }}>
                  {(analysis.nextSteps || []).map((step, i) => (
                    <li key={i} style={{ ...S.listItem, alignItems: "flex-start" }}>
                      <span style={{ minWidth: "24px", height: "24px", borderRadius: "8px", background: "rgba(91,140,255,0.15)", border: "1px solid rgba(91,140,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#5b8cff", flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.6" }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Topics to Study */}
              <div style={S.innerCard}>
                <div style={S.sectionLabel}>
                  <span style={{ color: "#a855f7", fontSize: "16px" }}>📚</span> Topics to Study
                </div>
                {(analysis.topicsToStudy || []).map((t, i) => (
                  <PriorityChip key={i} label={t.topic} priority={t.priority} />
                ))}
              </div>
            </div>

            {/* FEEDBACK */}
            {analysis.feedback && (
              <div style={S.feedbackCard}>
                <div style={S.sectionLabel}>
                  <span style={{ fontSize: "16px" }}>🤖</span> AI Feedback
                </div>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: "1.75", margin: 0 }}>{analysis.feedback}</p>
              </div>
            )}
          </div>
        )}
      </main>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

/* ─── Animated readiness bar ─── */
function ReadinessBar({ val }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(val), 300); return () => clearTimeout(t); }, [val]);
  const color = val >= 70 ? "#22c55e" : val >= 40 ? "#f59e0b" : "#ef4444";
  return <div style={{ height: "100%", borderRadius: "99px", background: color, width: `${w}%`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 8px ${color}80` }} />;
}

/* ─── STYLES ─── */
const S = {
  page: {
    minHeight: "100vh", backgroundColor: "#05020c",
    backgroundImage: "url('/coding-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex", flexDirection: "column", position: "relative", overflowX: "hidden",
  },
  orb: { position: "fixed", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none" },
  gridOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(5,2,20,0.82)",
    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none",
  },
  navbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 60px", borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(13,8,33,0.9)", backdropFilter: "blur(20px)", zIndex: 10,
  },
  navLeft: { display: "flex", alignItems: "center", gap: "28px" },
  backButton: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 500, transition: "all 0.2s ease" },
  logo: { fontSize: "22px", fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
  profileIcon: {
    width: "42px", height: "42px", borderRadius: "12px",
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    boxShadow: "0 6px 18px rgba(91,140,255,0.4)", transition: "transform 0.2s ease",
    fontFamily: "'Outfit', sans-serif",
  },
  dropdown: {
    position: "absolute", right: 0, top: "52px", background: "rgba(13,8,33,0.95)", backdropFilter: "blur(20px)",
    borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", padding: "8px", minWidth: "160px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)", zIndex: 100,
  },
  dropdownItem: { padding: "10px 14px", cursor: "pointer", fontSize: "14px", fontWeight: 500, borderRadius: "8px", color: "rgba(255,255,255,0.8)", transition: "background 0.15s" },
  dropdownDivider: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" },

  main: { flex: 1, position: "relative", zIndex: 1, padding: "0 60px 80px", maxWidth: "1300px", margin: "0 auto", width: "100%" },

  hero: { display: "flex", alignItems: "center", gap: "80px", padding: "80px 0 60px", flexWrap: "wrap" },
  heroLeft: { flex: 1, minWidth: "320px" },
  iconBadge: {
    width: "54px", height: "54px", borderRadius: "16px",
    background: "rgba(91,140,255,0.1)", border: "1px solid rgba(91,140,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px",
    boxShadow: "0 0 20px rgba(91,140,255,0.15)",
  },
  heading: { fontSize: "58px", fontWeight: 800, lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-1.5px", fontFamily: "'Outfit', sans-serif" },
  gradientText: { background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  desc: { fontSize: "17px", color: "rgba(255,255,255,0.5)", lineHeight: "1.75", fontWeight: 400 },

  card: {
    width: "100%", maxWidth: "440px",
    background: "linear-gradient(180deg, rgba(30,20,60,0.5) 0%, rgba(8,5,25,0.5) 100%)",
    border: "1px solid rgba(255,255,255,0.08)", borderTop: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px", padding: "36px", backdropFilter: "blur(24px)",
    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7)",
  },
  formTitle: { display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.55)" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "#fff", fontSize: "15px", outline: "none", transition: "all 0.2s ease",
    fontFamily: "inherit", boxSizing: "border-box",
  },
  button: {
    width: "100%", padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)",
    color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", boxShadow: "0 8px 28px rgba(91,140,255,0.25)",
    transition: "all 0.3s ease", letterSpacing: "0.2px",
  },
  spinner: {
    display: "inline-block", width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },

  resultsSection: { animation: "fadeSlideUp 0.6s ease forwards" },
  resultsHeader: { marginBottom: "40px" },
  resultsTitle: { fontSize: "38px", fontWeight: 800, fontFamily: "'Outfit', sans-serif" },

  topRow: { display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "24px" },
  midRow: { display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "24px" },

  scoreCard: {
    width: "220px", flexShrink: 0, padding: "32px 24px", borderRadius: "20px",
    background: "linear-gradient(180deg, rgba(30,20,60,0.5) 0%, rgba(8,5,25,0.5) 100%)",
    border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)",
  },
  levelBadge: { padding: "6px 16px", borderRadius: "99px", fontSize: "13px", fontWeight: 700 },

  innerCard: {
    flex: 1, minWidth: "260px", padding: "24px", borderRadius: "20px",
    background: "linear-gradient(180deg, rgba(30,20,60,0.4) 0%, rgba(8,5,25,0.4) 100%)",
    border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.4)",
  },
  sectionLabel: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" },
  list: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" },
  listItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.6" },
  bullet: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },

  feedbackCard: {
    padding: "28px 32px", borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(91,140,255,0.08) 0%, rgba(168,85,247,0.08) 100%)",
    border: "1px solid rgba(91,140,255,0.2)",
    backdropFilter: "blur(20px)",
  },
};
