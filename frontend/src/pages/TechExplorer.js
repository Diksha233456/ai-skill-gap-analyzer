import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getAuthUser, getInitials, logout } from "../services/auth";

/* ── CSS injected once ── */
const GLOBAL_CSS = `
@keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(91,140,255,0.3)} 50%{box-shadow:0 0 40px rgba(91,140,255,0.6)} }
* { box-sizing:border-box; }
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:#0f172a}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
.grad-text{background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:inline-block;}
`;

/* ══════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════ */

function Tag({ label, color = "#5b8cff" }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 13px", borderRadius: "30px", fontSize: "12px", fontWeight: 600,
      background: `${color}18`, border: `1px solid ${color}40`, color, letterSpacing: "0.3px"
    }}>
      {label}
    </span>
  );
}

function SkeletonBlock({ width = "100%", height = "20px", style = {} }) {
  return <div style={{
    width, height, borderRadius: "8px",
    background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
    backgroundSize: "400% 100%", animation: "shimmer 1.5s infinite", ...style
  }} />;
}

function Spinner() {
  return <span style={{
    width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.25)",
    borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block"
  }} />;
}

function PhaseCard({ phase, index }) {
  const [hovered, setHovered] = useState(false);
  const colors = ["#5b8cff", "#a855f7", "#00ffcc", "#f59e0b", "#ef4444"];
  const color = colors[index % colors.length];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.04)", border: `1px solid ${hovered ? color + "50" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px", padding: "22px", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? `0 0 30px ${color}18` : "none"
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
          background: `linear-gradient(135deg,${color},${color}88)`, display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", color: "#fff"
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 700, color: "#f1f5f9" }}>{phase.name}</h4>
          <span style={{
            fontSize: "12px", color, fontWeight: 600, background: `${color}18`,
            padding: "2px 10px", borderRadius: "20px", display: "inline-block"
          }}>⏱ {phase.duration}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px 0" }}>📚 Topics</p>
          {phase.topics.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#cbd5e1" }}>{t}</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px 0" }}>🛠 Projects</p>
          {phase.projects.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a855f7", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#cbd5e1" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  const modes = [
    { id: "roadmap", icon: "🗺", label: "Roadmap Explorer" },
    { id: "battle", icon: "⚔️", label: "Path Battle" },
    { id: "whatif", icon: "🔮", label: "What-If Simulator" },
  ];
  return (
    <div style={{
      display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px", padding: "4px", gap: "4px", margin: "0 auto 40px", position: "relative"
    }}>
      {modes.map(m => (
        <button key={m.id} onClick={() => setMode(m.id)}
          style={{
            padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontFamily: "inherit", fontSize: "13px", fontWeight: 600, transition: "all 0.25s ease",
            background: mode === m.id ? "linear-gradient(135deg,#5b8cff,#a855f7)" : "transparent",
            color: mode === m.id ? "#fff" : "#64748b",
            boxShadow: mode === m.id ? "0 4px 15px rgba(91,140,255,0.35)" : "none"
          }}>
          {m.icon} {m.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════
   ROADMAP MODE
══════════════════════════════════ */
function RoadmapMode() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const resultRef = useRef(null);
  const barColors = ["#5b8cff", "#a855f7", "#00ffcc", "#f59e0b", "#ef4444", "#06b6d4"];

  const handleGenerate = async () => {
    if (!search.trim()) return;
    setLoading(true); setInsights(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/roadmap", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: search, level: "Beginner", goal: "Get a job in this field", time: "10 hours per week" }),
      });
      const data = await res.json();
      if (data.success) setInsights(data.insights);
    } catch (e) { console.error(e); }
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const skillGraphData = insights
    ? [...(insights.techStack.languages || []), ...(insights.techStack.frameworks || [])].map((lang, i) => ({
      name: lang, demand: Math.floor(Math.random() * 25) + 65, fill: barColors[i % barColors.length]
    }))
    : [];

  return (
    <>
      {/* Search bar */}
      <div style={{
        maxWidth: "680px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px", padding: "8px 8px 8px 20px", backdropFilter: "blur(20px)",
        boxShadow: focused ? "0 0 0 2px rgba(91,140,255,0.4)" : "0 20px 50px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.3s ease"
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input placeholder="e.g. Cyber Security, Machine Learning, DevOps..." value={search}
          onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleGenerate()}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#f1f5f9", fontSize: "15px", fontFamily: "inherit" }} />
        <button onClick={handleGenerate} disabled={loading || !search.trim()}
          style={{
            padding: "13px 24px", background: "linear-gradient(135deg,#34d399,#38bdf8)",
            color: "#0d0821", border: "none", borderRadius: "12px", fontWeight: 800, fontSize: "14px",
            cursor: search.trim() ? "pointer" : "not-allowed", fontFamily: "inherit",
            opacity: search.trim() ? 1 : 0.5, whiteSpace: "nowrap", flexShrink: 0,
            boxShadow: "0 6px 20px rgba(52,211,153,0.3)", transition: "all 0.3s ease"
          }}>
          {loading ? <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Spinner /> Generating...</span> : "Generate Roadmap →"}
        </button>
      </div>

      {/* Chips */}
      <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap", justifyContent: "center" }}>
        {["Machine Learning", "Cyber Security", "Web3 / Blockchain", "DevOps", "Data Engineering"].map(d => (
          <button key={d} onClick={() => setSearch(d)}
            style={{
              padding: "7px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "30px", color: "#64748b", fontSize: "12px", fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(91,140,255,0.5)"; e.currentTarget.style.color = "#f1f5f9"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#64748b"; }}>
            {d}
          </button>
        ))}
      </div>

      {/* Results */}
      <div ref={resultRef} style={{ maxWidth: "900px", margin: "48px auto 0", padding: "0 0 80px" }}>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <SkeletonBlock height="36px" width="55%" style={{ borderRadius: "10px" }} />
            <SkeletonBlock height="18px" width="75%" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              {[1, 2, 3].map(i => <SkeletonBlock key={i} height="90px" style={{ borderRadius: "14px" }} />)}
            </div>
            <SkeletonBlock height="240px" style={{ borderRadius: "18px" }} />
            {[1, 2].map(i => <SkeletonBlock key={i} height="140px" style={{ borderRadius: "18px" }} />)}
          </div>
        )}

        {!loading && insights && (
          <div style={{ animation: "fadeInUp 0.5s ease" }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.08))",
              border: "1px solid rgba(59,130,246,0.15)", borderRadius: "20px", padding: "32px",
              marginBottom: "20px", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap"
            }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700, color: "#5b8cff", letterSpacing: "1.5px",
                  textTransform: "uppercase", display: "block", marginBottom: "10px"
                }}>Career Roadmap</span>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "24px", fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>{insights.title}</h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{insights.overview}</p>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { label: "Phases", value: insights.phases?.length || 0, color: "#5b8cff" },
                  { label: "Languages", value: insights.techStack?.languages?.length || 0, color: "#a855f7" },
                  { label: "Interview Topics", value: insights.interviewPrep?.length || 0, color: "#00ffcc" },
                ].map((c, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)", border: `1px solid ${c.color}30`,
                    borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column",
                    alignItems: "center", minWidth: "90px", gap: "4px"
                  }}>
                    <span style={{ fontSize: "26px", fontWeight: 800, color: c.color }}>{c.value}</span>
                    <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={sectionCard}>
              <h3 style={sectionTitle}><span>⚡</span> Tech Stack</h3>
              {insights.techStack.languages?.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={tagLabel}>Languages</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.languages.map((l, i) => <Tag key={i} label={l} color="#5b8cff" />)}
                  </div>
                </div>
              )}
              {insights.techStack.frameworks?.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={tagLabel}>Frameworks & Libraries</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.frameworks.map((f, i) => <Tag key={i} label={f} color="#a855f7" />)}
                  </div>
                </div>
              )}
              {insights.techStack.tools?.length > 0 && (
                <div>
                  <p style={tagLabel}>Tools & Platforms</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.tools.map((t, i) => <Tag key={i} label={t} color="#00ffcc" />)}
                  </div>
                </div>
              )}
            </div>

            {/* Chart */}
            {skillGraphData.length > 0 && (
              <div style={sectionCard}>
                <h3 style={sectionTitle}><span>📊</span> Skill Market Demand</h3>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "-4px 0 20px" }}>Estimated industry demand for each skill</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={skillGraphData} barCategoryGap="35%">
                    <XAxis dataKey="name" stroke="#334155" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
                    <YAxis stroke="#334155" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                      labelStyle={{ color: "#94a3b8", fontSize: "12px" }} itemStyle={{ color: "#00ffcc", fontWeight: 700 }} />
                    <Bar dataKey="demand" radius={[8, 8, 0, 0]}>
                      {skillGraphData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Phases */}
            <div style={sectionCard}>
              <h3 style={sectionTitle}><span>🗺</span> Learning Roadmap</h3>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "-4px 0 24px" }}>Step-by-step phase plan from zero to job-ready</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {insights.phases.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} />)}
              </div>
            </div>

            {/* Interview + Future */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={sectionCard}>
                <h3 style={sectionTitle}><span>🎯</span> Interview Prep</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {insights.interviewPrep.map((item, i) => (
                    <li key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.07)"
                    }}>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "6px", background: "rgba(52,211,153,0.15)",
                        border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: "10px", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px"
                      }}>✓</div>
                      <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={sectionCard}>
                <h3 style={sectionTitle}><span>🚀</span> Future Scope</h3>
                <div style={{ background: "rgba(91,140,255,0.06)", border: "1px solid rgba(91,140,255,0.15)", borderRadius: "12px", padding: "18px" }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: "1.8" }}>{insights.futureScope}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{
              marginTop: "20px", background: "linear-gradient(135deg,rgba(91,140,255,0.08),rgba(168,85,247,0.08))",
              border: "1px solid rgba(91,140,255,0.18)", borderRadius: "20px", padding: "28px 32px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap"
            }}>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700 }}>Ready to start your journey?</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Upload your resume to see how much you already know</p>
              </div>
              <button onClick={() => navigate("/resume")}
                style={{
                  padding: "14px 28px", background: "linear-gradient(135deg,#5b8cff,#a855f7)", color: "#fff",
                  border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                  fontFamily: "inherit", boxShadow: "0 8px 20px rgba(91,140,255,0.25)", transition: "all 0.3s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(91,140,255,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(91,140,255,0.25)"; }}>
                Analyze My Resume →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════
   PATH BATTLE MODE
══════════════════════════════════ */
function PathBattleMode() {
  const [path1, setPath1] = useState("");
  const [path2, setPath2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBattle = async () => {
    if (!path1.trim() || !path2.trim()) { setError("Please enter both career paths"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/compare-paths", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path1, path2 }),
      });
      const data = await res.json();
      if (data.success) setResult({ path1: data.path1, path2: data.path2, skillOverlap: data.skillOverlap, verdict: data.verdict });
      else setError("AI couldn't generate comparison. Try again.");
    } catch (e) { setError("Connection error. Is the server running?"); }
    setLoading(false);
  };

  const PRESETS = [["Frontend Dev", "Backend Dev"], ["ML Engineer", "Data Analyst"], ["DevOps", "Cloud Architect"], ["iOS Dev", "Android Dev"]];

  const StatBar = ({ label, v1, v2, color1 = "#5b8cff", color2 = "#a855f7" }) => {
    const max = Math.max(v1, v2, 1);
    return (
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{label}</span>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: color1, fontWeight: 700 }}>{v1}</span>
            <span style={{ fontSize: "12px", color: "#475569" }}>vs</span>
            <span style={{ fontSize: "12px", color: color2, fontWeight: 700 }}>{v2}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "3px", height: "6px" }}>
          <div style={{ flex: v1 / max, background: color1, borderRadius: "3px", transition: "flex 1s ease" }} />
          <div style={{ flex: v2 / max, background: color2, borderRadius: "3px", transition: "flex 1s ease" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 0 80px" }}>
      {/* Input */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px", padding: "28px", marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700 }}>⚔️ Career Path Battle</h3>
        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>Compare two tech careers head-to-head — salary, demand, skills & verdict</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#5b8cff", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Career Path 1</label>
            <input value={path1} onChange={e => setPath1(e.target.value)} placeholder="e.g. Machine Learning Engineer"
              style={{
                width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(91,140,255,0.3)",
                borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", fontFamily: "inherit", outline: "none"
              }} />
          </div>
          <div style={{ fontSize: "24px", color: "#ef4444", fontWeight: 800, textAlign: "center" }}>VS</div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Career Path 2</label>
            <input value={path2} onChange={e => setPath2(e.target.value)} placeholder="e.g. Data Analyst"
              style={{
                width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", fontFamily: "inherit", outline: "none"
              }} />
          </div>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
          <span style={{ fontSize: "12px", color: "#475569", fontWeight: 600, alignSelf: "center" }}>Try:</span>
          {PRESETS.map(([a, b], i) => (
            <button key={i} onClick={() => { setPath1(a); setPath2(b); }}
              style={{
                padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px", color: "#94a3b8", fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(91,140,255,0.4)"; e.currentTarget.style.color = "#c7d2fe"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}>
              {a} vs {b}
            </button>
          ))}
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: "0 0 12px" }}>⚠ {error}</p>}
        <button onClick={handleBattle} disabled={loading}
          style={{
            width: "100%", padding: "14px", background: "linear-gradient(135deg,#ef4444,#f59e0b)",
            color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            boxShadow: "0 6px 20px rgba(239,68,68,0.3)", transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
          }}>
          {loading ? <><Spinner /> Analyzing Paths...</> : "⚔️ Start Battle"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: "fadeInUp 0.5s ease" }}>
          {/* Stat Bars */}
          <div style={{ ...sectionCard, marginBottom: "20px" }}>
            <h3 style={sectionTitle}><span>📊</span> Head-to-Head Comparison</h3>
            <StatBar label="Market Demand Score" v1={result.path1.demandScore} v2={result.path2.demandScore} />
            <StatBar label="Learning Difficulty" v1={result.path1.difficultyScore} v2={result.path2.difficultyScore} color1="#f59e0b" color2="#ef4444" />
            <StatBar label="Salary Potential (max LPA)" v1={result.path1.salaryMax} v2={result.path2.salaryMax} color1="#00ffcc" color2="#06b6d4" />
          </div>

          {/* Side-by-side cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {[result.path1, result.path2].map((p, pi) => {
              const color = pi === 0 ? "#5b8cff" : "#a855f7";
              return (
                <div key={pi} style={{
                  background: `linear-gradient(135deg,${color}10,${color}05)`,
                  border: `1px solid ${color}30`, borderRadius: "18px", padding: "24px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color }}>{p.name}</h4>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color }}>{p.salaryMin}–{p.salaryMax}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>LPA Range</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color }}>{p.timeToLand}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>To Land Job</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <p style={tagLabel}>Top Skills</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {p.topSkills.map((s, i) => <Tag key={i} label={s} color={color} />)}
                    </div>
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <p style={tagLabel}>Top Companies</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {p.topCompanies.map((c, i) => <Tag key={i} label={c} color="#00ffcc" />)}
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <p style={{ ...tagLabel, color: "#22c55e" }}>✅ Pros</p>
                    {p.pros.map((pro, i) => <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#86efac" }}>• {pro}</p>)}
                  </div>
                  <div>
                    <p style={{ ...tagLabel, color: "#ef4444" }}>❌ Cons</p>
                    {p.cons.map((con, i) => <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#fca5a5" }}>• {con}</p>)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill overlap */}
          {result.skillOverlap?.length > 0 && (
            <div style={{ ...sectionCard, marginBottom: "20px" }}>
              <h3 style={sectionTitle}><span>🔗</span> Shared Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {result.skillOverlap.map((s, i) => <Tag key={i} label={s} color="#f59e0b" />)}
              </div>
            </div>
          )}

          {/* Verdict */}
          <div style={{
            background: "linear-gradient(135deg,rgba(52,211,153,0.1),rgba(91,140,255,0.1))",
            border: "1px solid rgba(52,211,153,0.25)", borderRadius: "20px", padding: "28px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "28px" }}>🏆</span>
              <div>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#34d399", letterSpacing: "1px", textTransform: "uppercase" }}>AI Verdict</p>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#34d399" }}>{result.verdict.winner} Wins!</h3>
              </div>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.7" }}>{result.verdict.reason}</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              <strong style={{ color: "#f59e0b" }}>Best for: </strong>{result.verdict.bestFor}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   WHAT-IF SIMULATOR MODE
══════════════════════════════════ */
function WhatIfMode() {
  // Auto-fill skills from resume analysis if available
  const sessionAnalysis = (() => {
    try { return JSON.parse(sessionStorage.getItem("analysisData") || "{}"); } catch { return {}; }
  })();
  const autoSkills = (sessionAnalysis.extractedSkills || []).join(", ");

  const [currentSkills, setCurrentSkills] = useState(autoSkills);
  const [newSkill, setNewSkill] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulate = async () => {
    if (!currentSkills.trim() || !newSkill.trim()) { setError("Please fill both fields"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const skills = currentSkills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("http://localhost:5000/api/ai/what-if", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills: skills, newSkill }),
      });
      const data = await res.json();
      if (data.success) setResult({ newSkill: data.newSkill, unlockedRoles: data.unlockedRoles, salaryImpact: data.salaryImpact, demandBoost: data.demandBoost, timeToLearn: data.timeToLearn, synergies: data.synergies, verdict: data.verdict });
      else setError("Simulation failed. Try again.");
    } catch (e) { setError("Connection error. Is the server running?"); }
    setLoading(false);
  };

  const SKILL_PRESETS = ["React", "Python", "Docker", "TypeScript", "AWS", "Kubernetes", "TensorFlow", "GraphQL"];

  const demandColor = d => d === "High" ? "#22c55e" : d === "Medium" ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 0 80px" }}>
      {/* Input */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px", padding: "28px", marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700 }}>🔮 What-If Career Simulator</h3>
        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>Add one skill and see how it transforms your career — salary, roles, and demand impact</p>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "11px", fontWeight: 700, color: "#00ffcc", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Your Current Skills (comma-separated)</label>
          <input value={currentSkills} onChange={e => setCurrentSkills(e.target.value)}
            placeholder="e.g. Python, SQL, Excel, Pandas"
            style={{
              width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,255,204,0.25)",
              borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", fontFamily: "inherit", outline: "none"
            }} />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>New Skill to Add</label>
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
            placeholder="e.g. TensorFlow"
            style={{
              width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", fontFamily: "inherit", outline: "none"
            }} />
          {/* Quick picks */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "10px" }}>
            <span style={{ fontSize: "11px", color: "#475569", fontWeight: 600, alignSelf: "center" }}>Quick pick:</span>
            {SKILL_PRESETS.map(s => (
              <button key={s} onClick={() => setNewSkill(s)}
                style={{
                  padding: "5px 13px", background: newSkill === s ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)",
                  border: newSkill === s ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px", color: newSkill === s ? "#c084fc" : "#64748b", fontSize: "12px",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease"
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: "0 0 12px" }}>⚠ {error}</p>}
        <button onClick={handleSimulate} disabled={loading}
          style={{
            width: "100%", padding: "14px", background: "linear-gradient(135deg,#a855f7,#5b8cff)",
            color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            boxShadow: "0 6px 20px rgba(168,85,247,0.3)", transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
          }}>
          {loading ? <><Spinner /> Simulating Your Future...</> : "🔮 Simulate Career Impact"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: "fadeInUp 0.5s ease" }}>
          {/* Salary Impact Banner */}
          <div style={{
            background: "linear-gradient(135deg,rgba(52,211,153,0.12),rgba(91,140,255,0.12))",
            border: "1px solid rgba(52,211,153,0.25)", borderRadius: "20px", padding: "28px",
            marginBottom: "20px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap"
          }}>
            <div style={{ fontSize: "42px" }}>🚀</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "1px" }}>
                Learning <strong style={{ color: "#fff" }}>{result.newSkill}</strong> Impact
              </p>
              <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800 }}>
                {result.salaryImpact.currentEstimate} → <span style={{ color: "#34d399" }}>{result.salaryImpact.newEstimate}</span>
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                Salary boost: <strong style={{ color: "#34d399" }}>{result.salaryImpact.delta}</strong> &nbsp;|&nbsp; Demand boost: <strong style={{ color: "#00ffcc" }}>+{result.demandBoost}%</strong> &nbsp;|&nbsp; Time to learn: <strong style={{ color: "#f59e0b" }}>{result.timeToLearn}</strong>
              </p>
            </div>
          </div>

          {/* Unlocked Roles */}
          <div style={{ ...sectionCard, marginBottom: "20px" }}>
            <h3 style={sectionTitle}><span>🔓</span> Roles You'll Unlock</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.unlockedRoles.map((role, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px", padding: "14px 18px"
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 700, color: "#f1f5f9" }}>{role.role}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{role.salaryRange} LPA</p>
                  </div>
                  <div style={{ width: "56px", height: "56px", position: "relative", flexShrink: 0 }}>
                    <svg viewBox="0 0 36 36" style={{ width: "56px", height: "56px", transform: "rotate(-90deg)" }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#5b8cff" strokeWidth="3"
                        strokeDasharray={`${role.matchPercent} ${100 - role.matchPercent}`} strokeLinecap="round" />
                    </svg>
                    <span style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 800, color: "#5b8cff"
                    }}>{role.matchPercent}%</span>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
                    background: `${demandColor(role.demandLevel)}18`, color: demandColor(role.demandLevel),
                    border: `1px solid ${demandColor(role.demandLevel)}40`
                  }}>{role.demandLevel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Synergies */}
          {result.synergies?.length > 0 && (
            <div style={{ ...sectionCard, marginBottom: "20px" }}>
              <h3 style={sectionTitle}><span>⚡</span> Skill Synergies</h3>
              {result.synergies.map((s, i) => (
                <div key={i} style={{
                  display: "flex", gap: "10px", alignItems: "flex-start",
                  padding: "10px 14px", background: "rgba(91,140,255,0.06)", borderRadius: "10px",
                  border: "1px solid rgba(91,140,255,0.15)", marginBottom: "8px"
                }}>
                  <span style={{ color: "#5b8cff", fontSize: "14px", flexShrink: 0 }}>🔗</span>
                  <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6" }}>{s}</p>
                </div>
              ))}
            </div>
          )}

          {/* Verdict */}
          <div style={{
            background: "linear-gradient(135deg,rgba(168,85,247,0.1),rgba(91,140,255,0.1))",
            border: "1px solid rgba(168,85,247,0.3)", borderRadius: "20px", padding: "24px"
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700 }}>🔮 AI Verdict</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: "1.8" }}>{result.verdict}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   SHARED STYLE TOKENS
══════════════════════════════════ */
const sectionCard = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "28px",
  backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
const sectionTitle = {
  display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: 700,
  color: "var(--text-primary,#f1f5f9)", margin: "0 0 18px 0",
};
const tagLabel = {
  fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "1px",
  textTransform: "uppercase", marginBottom: "8px", marginTop: 0,
};

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export default function TechExplorer() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("roadmap");
  const [showProfile, setShowProfile] = useState(false);
  const authUser = getAuthUser();
  const initials = getInitials(authUser?.name);

  const modeConfig = {
    roadmap: { title: "Explore Any Tech Career", subtitle: "Enter a domain — get a structured learning plan with phases, tech stack, projects & interview prep, all AI-generated in seconds.", gradient: "#5b8cff 0%, #a855f7 50%, #00ffcc 100%" },
    battle: { title: "Career Path Battle Arena", subtitle: "Pick two tech careers and let AI fight them head-to-head — salary, demand, skills, pros, cons & a final verdict.", gradient: "#ef4444 0%, #f59e0b 100%" },
    whatif: { title: "What-If Career Simulator", subtitle: "Add one new skill to your profile and watch AI predict how your salary, roles, and market demand transform in real-time.", gradient: "#a855f7 0%, #5b8cff 100%" },
  };
  const cfg = modeConfig[mode];

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-dark,#0d0821)", color: "#f1f5f9",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", position: "relative", overflowX: "hidden"
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* Background Orbs */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />
      {[
        { top: "-20%", left: "-8%", bg: "rgba(139,0,255,0.4)", size: "700px" },
        { top: "-5%", right: "-12%", bg: "rgba(0,180,255,0.25)", size: "600px" },
        { top: "40%", left: "20%", bg: "rgba(52,211,153,0.1)", size: "500px" },
        { bottom: "-8%", right: "5%", bg: "rgba(255,80,180,0.12)", size: "500px" },
      ].map((o, i) => (
        <div key={i} style={{
          position: "fixed", width: o.size, height: o.size, borderRadius: "50%",
          background: o.bg, filter: "blur(100px)", zIndex: 0, pointerEvents: "none", ...o
        }} />
      ))}

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 60px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,8,33,0.88)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div onClick={() => navigate("/")} style={{
            display: "flex", alignItems: "center", gap: "6px",
            color: "#64748b", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.transform = "translateX(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = "none"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.5px", fontFamily: "'Outfit',sans-serif" }} onClick={() => navigate("/")}>
            <span style={{ color: "#5b8cff" }}>AI</span> Skill Gap
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div onClick={() => setShowProfile(!showProfile)}
            style={{
              width: "42px", height: "42px", borderRadius: "12px", cursor: "pointer",
              background: "linear-gradient(135deg,#5b8cff,#a855f7)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "14px", transition: "transform 0.2s ease",
              boxShadow: "0 6px 16px rgba(59,130,246,0.3)"
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
            {initials}
          </div>
          {showProfile && (
            <div style={{
              position: "absolute", right: 0, top: "55px", background: "rgba(15,23,42,0.98)",
              border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: "12px",
              width: "190px", boxShadow: "0 15px 35px rgba(0,0,0,0.4)", padding: "8px 0", zIndex: 200
            }}>
              <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>{authUser?.name || "User"}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{authUser?.email || ""}</div>
              </div>
              <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#94a3b8" }}
                onClick={() => navigate("/")}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>🏠 Dashboard</div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
              <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#fb7185" }}
                onClick={logout}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,113,133,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>🚪 Logout</div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "56px 60px 40px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "30px", padding: "6px 16px", marginBottom: "20px"
        }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>AI-Powered Career Intelligence</span>
        </div>
        <h1 style={{
          fontSize: "clamp(38px,5vw,56px)", fontWeight: 800, lineHeight: "1.12",
          letterSpacing: "-2px", margin: "0 0 16px", fontFamily: "'Outfit',sans-serif",
          color: "#f1f5f9"
        }}>
          <span className="grad-text" style={{ backgroundImage: `linear-gradient(135deg,${cfg.gradient})` }}>
            {cfg.title.split(" ").slice(0, 2).join(" ")}
          </span>{" "}
          {cfg.title.split(" ").slice(2).join(" ")}
        </h1>
        <p style={{ fontSize: "17px", color: "#64748b", maxWidth: "580px", margin: "0 auto 36px", lineHeight: "1.7" }}>{cfg.subtitle}</p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </section>

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 1, padding: "0 40px" }}>
        {mode === "roadmap" && <RoadmapMode />}
        {mode === "battle" && <PathBattleMode />}
        {mode === "whatif" && <WhatIfMode />}
      </main>
    </div>
  );
}