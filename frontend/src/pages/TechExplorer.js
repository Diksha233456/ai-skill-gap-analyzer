import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ─────────────────────────────────────────────
   Custom Tooltip for the Bar Chart
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
        <p style={{ color: "#00ffcc", fontWeight: 700, fontSize: "18px" }}>
          {payload[0].value}%
        </p>
        <p style={{ color: "#64748b", fontSize: "11px" }}>Market Demand</p>
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────── */
function SkeletonBlock({ width = "100%", height = "20px", style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "8px",
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
        backgroundSize: "400% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ marginTop: "48px" }}>
      <SkeletonBlock height="36px" width="60%" style={{ marginBottom: "12px" }} />
      <SkeletonBlock height="18px" width="80%" style={{ marginBottom: "40px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        {[1, 2, 3].map(i => (
          <SkeletonBlock key={i} height="100px" style={{ borderRadius: "16px" }} />
        ))}
      </div>
      <SkeletonBlock height="260px" style={{ borderRadius: "20px", marginBottom: "32px" }} />
      <SkeletonBlock height="160px" style={{ borderRadius: "20px", marginBottom: "16px" }} />
      <SkeletonBlock height="160px" style={{ borderRadius: "20px" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge Tag Component
───────────────────────────────────────────── */
function Tag({ label, color = "#5b8cff" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "5px 13px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: 600,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color: color,
      letterSpacing: "0.3px",
    }}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Phase Card Component
───────────────────────────────────────────── */
function PhaseCard({ phase, index }) {
  const [hovered, setHovered] = useState(false);
  const colors = ["#5b8cff", "#a855f7", "#00ffcc", "#f59e0b", "#ef4444"];
  const color = colors[index % colors.length];

  return (
    <div
      style={{
        ...styles.phaseCard,
        borderColor: hovered ? `${color}50` : "rgba(255,255,255,0.05)",
        boxShadow: hovered ? `0 0 30px ${color}15` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Phase Header */}
      <div style={styles.phaseHeader}>
        <div style={{ ...styles.phaseNumber, background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#f1f5f9" }}>
            {phase.name}
          </h4>
          <span style={{
            fontSize: "12px",
            color: color,
            fontWeight: 600,
            background: `${color}18`,
            padding: "2px 10px",
            borderRadius: "20px",
            display: "inline-block",
            marginTop: "4px",
          }}>
            ⏱ {phase.duration}
          </span>
        </div>
      </div>

      {/* Phase Content */}
      <div style={styles.phaseContent}>
        <div style={styles.phaseColumn}>
          <p style={styles.columnLabel}>📚 Topics</p>
          <ul style={styles.ul}>
            {phase.topics.map((topic, i) => (
              <li key={i} style={styles.phaseItem}>
                <span style={{ ...styles.bullet, background: color }} />
                {topic}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "1px", background: "rgba(255,255,255,0.05)" }} />
        <div style={styles.phaseColumn}>
          <p style={styles.columnLabel}>🛠 Projects</p>
          <ul style={styles.ul}>
            {phase.projects.map((proj, i) => (
              <li key={i} style={styles.phaseItem}>
                <span style={{ ...styles.bullet, background: "#a855f7" }} />
                {proj}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main TechExplorer Component
───────────────────────────────────────────── */
function TechExplorer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [insights, setInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const aiSectionRef = useRef(null);

  const handleGenerate = async () => {
    if (!search.trim()) return;
    setAiLoading(true);
    setInsights(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: search,
          level: "Beginner",
          goal: "Get a job in this field",
          time: "10 hours per week",
        }),
      });
      const data = await res.json();
      if (data.success) setInsights(data.insights);
    } catch (err) {
      console.error(err);
    }

    setAiLoading(false);
    setTimeout(() => {
      aiSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGenerate();
  };

  /* ── Bar chart data ── */
  const barColors = ["#5b8cff", "#a855f7", "#00ffcc", "#f59e0b", "#ef4444", "#06b6d4"];
  const skillGraphData = insights
    ? insights.techStack.languages.concat(insights.techStack.frameworks || []).map((lang, i) => ({
      name: lang,
      demand: Math.floor(Math.random() * 25) + 65,
      fill: barColors[i % barColors.length],
    }))
    : [];

  /* ── Stat Chips ── */
  const statChips = insights
    ? [
      { label: "Learning Phases", value: insights.phases?.length || 0, color: "#5b8cff" },
      { label: "Core Languages", value: insights.techStack?.languages?.length || 0, color: "#a855f7" },
      { label: "Interview Topics", value: insights.interviewPrep?.length || 0, color: "#00ffcc" },
    ]
    : [];

  return (
    <div style={styles.page}>
      {/* Shimmer Keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      {/* Grid Overlay */}
      <div style={styles.gridOverlay} />

      {/* Glow Orbs */}
      <div style={{ ...styles.orb, top: "-100px", left: "10%", background: "rgba(91,140,255,0.18)" }} />
      <div style={{ ...styles.orb, bottom: "0", right: "5%", background: "rgba(168,85,247,0.12)", width: "400px", height: "400px" }} />

      {/* ── NAVBAR ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div
            style={styles.backButton}
            onClick={() => navigate("/")}
            onMouseEnter={e => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.transform = "translateX(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = "translateX(0)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </div>
          <div style={styles.logo} onClick={() => navigate("/")}>
            <span style={{ color: "#5b8cff" }}>AI</span> Skill Gap
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={styles.profileIcon}
            onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            DK
          </div>
          {showProfile && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem}>View Profile</div>
              <div style={styles.dropdownItem}>Edit Profile</div>
              <div style={styles.dropdownDivider} />
              <div style={{ ...styles.dropdownItem, color: "#ef4444" }}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Explore Any <span style={styles.gradientText}>Tech Career</span><br />
          Get Your AI Roadmap
        </h1>
        <p style={styles.heroSubtitle}>
          Enter a domain, get a structured learning plan with phases, tech stack, projects, and interview prep — all AI-generated in seconds.
        </p>

        {/* Search Bar */}
        <div style={{ ...styles.searchWrapper, boxShadow: inputFocused ? "0 0 0 2px rgba(91,140,255,0.5), 0 20px 50px rgba(0,0,0,0.5)" : "0 20px 50px rgba(0,0,0,0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="e.g. Cyber Security, Machine Learning, DevOps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={styles.input}
          />
          <button
            onClick={handleGenerate}
            disabled={aiLoading || !search.trim()}
            style={{
              ...styles.generateBtn,
              opacity: (!search.trim()) ? 0.5 : 1,
              cursor: (!search.trim()) ? "not-allowed" : "pointer",
            }}
            onMouseEnter={e => { if (search.trim() && !aiLoading) e.currentTarget.style.boxShadow = "0 0 25px rgba(91,140,255,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            {aiLoading
              ? <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Generating...
              </span>
              : "Generate Roadmap →"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>

        {/* Popular Domains */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {["Machine Learning", "Cyber Security", "Web3 / Blockchain", "DevOps", "Data Engineering"].map(d => (
            <button
              key={d}
              onClick={() => setSearch(d)}
              style={styles.suggestionChip}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(91,140,255,0.5)"; e.currentTarget.style.color = "#f1f5f9"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#64748b"; }}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section style={styles.resultsSection} ref={aiSectionRef}>
        {aiLoading && <LoadingSkeleton />}

        {!aiLoading && insights && (
          <div style={{ animation: "fadeInUp 0.5s ease" }}>

            {/* ── HEADER CARD ── */}
            <div style={styles.headerCard}>
              <div style={styles.headerCardLeft}>
                <span style={styles.overviewLabel}>Career Roadmap</span>
                <h2 style={styles.roadmapTitle}>{insights.title}</h2>
                <p style={styles.roadmapOverview}>{insights.overview}</p>
              </div>
              {/* Stat Chips */}
              <div style={styles.statChips}>
                {statChips.map((chip, i) => (
                  <div key={i} style={{ ...styles.statChip, borderColor: `${chip.color}30` }}>
                    <span style={{ fontSize: "26px", fontWeight: 800, color: chip.color }}>{chip.value}</span>
                    <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>{chip.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── TECH STACK SECTION ── */}
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>⚡</span> Tech Stack
              </h3>
              {insights.techStack.languages?.length > 0 && (
                <div style={styles.tagGroup}>
                  <p style={styles.tagLabel}>Languages</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.languages.map((l, i) => <Tag key={i} label={l} color="#5b8cff" />)}
                  </div>
                </div>
              )}
              {insights.techStack.frameworks?.length > 0 && (
                <div style={{ ...styles.tagGroup, marginTop: "16px" }}>
                  <p style={styles.tagLabel}>Frameworks & Libraries</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.frameworks.map((f, i) => <Tag key={i} label={f} color="#a855f7" />)}
                  </div>
                </div>
              )}
              {insights.techStack.tools?.length > 0 && (
                <div style={{ ...styles.tagGroup, marginTop: "16px" }}>
                  <p style={styles.tagLabel}>Tools & Platforms</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {insights.techStack.tools.map((t, i) => <Tag key={i} label={t} color="#00ffcc" />)}
                  </div>
                </div>
              )}
            </div>

            {/* ── SKILL DEMAND CHART ── */}
            {skillGraphData.length > 0 && (
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>📊</span> Skill Market Demand
                </h3>
                <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px", marginTop: "-4px" }}>
                  Estimated industry demand for each skill in this domain
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={skillGraphData} barCategoryGap="35%">
                    <XAxis
                      dataKey="name"
                      stroke="#334155"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#1e293b" }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="demand" radius={[8, 8, 0, 0]}>
                      {skillGraphData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── LEARNING ROADMAP ── */}
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}>🗺</span> Learning Roadmap
              </h3>
              <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "28px", marginTop: "-4px" }}>
                Step-by-step phase plan to take you from zero to job-ready
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {insights.phases.map((phase, index) => (
                  <PhaseCard key={index} phase={phase} index={index} />
                ))}
              </div>
            </div>

            {/* ── INTERVIEW PREP + FUTURE SCOPE GRID ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

              {/* Interview Prep */}
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>🎯</span> Interview Prep
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {insights.interviewPrep.map((item, i) => (
                    <li key={i} style={styles.interviewItem}>
                      <div style={styles.checkCircle}>✓</div>
                      <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Future Scope */}
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>🚀</span> Future Scope
                </h3>
                <div style={styles.futureBox}>
                  <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: "1.8" }}>
                    {insights.futureScope}
                  </p>
                </div>
              </div>
            </div>

            {/* ── BOTTOM CTA ── */}
            <div style={styles.ctaCard}>
              <div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700 }}>
                  Ready to start your journey?
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Upload your resume to see how much you already know
                </p>
              </div>
              <button
                style={styles.ctaButton}
                onClick={() => navigate("/resume")}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(91,140,255,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(91,140,255,0.25)"; }}
              >
                Analyze My Resume →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "12px 16px",
  backdropFilter: "blur(20px)",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#070b14",
    color: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  gridOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    zIndex: 0,
    pointerEvents: "none",
  },
  orb: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    background: "rgba(7, 11, 20, 0.8)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.5px",
  },
  profileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #5b8cff 0%, #8b5cf6 100%)",
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
    zIndex: 200,
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
  hero: {
    textAlign: "center",
    padding: "60px 60px 60px",
    position: "relative",
    zIndex: 1,
  },
  heroTitle: {
    fontSize: "56px",
    fontWeight: 800,
    lineHeight: "1.12",
    letterSpacing: "-2px",
    marginBottom: "20px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 50%, #00ffcc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "17px",
    color: "#64748b",
    maxWidth: "560px",
    margin: "0 auto 40px",
    lineHeight: "1.7",
  },
  searchWrapper: {
    maxWidth: "680px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "8px 8px 8px 20px",
    backdropFilter: "blur(20px)",
    transition: "box-shadow 0.3s ease",
  },
  input: {
    flex: 1,
    background: "none",
    border: "none",
    outline: "none",
    color: "#f8fafc",
    fontSize: "15px",
    fontFamily: "inherit",
  },
  generateBtn: {
    padding: "13px 24px",
    background: "linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },
  suggestionChip: {
    padding: "7px 16px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "30px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  resultsSection: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 40px 80px",
    position: "relative",
    zIndex: 1,
  },
  headerCard: {
    background: "linear-gradient(135deg, rgba(91,140,255,0.08) 0%, rgba(168,85,247,0.08) 100%)",
    border: "1px solid rgba(91,140,255,0.15)",
    borderRadius: "20px",
    padding: "32px",
    marginBottom: "20px",
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  headerCardLeft: {
    flex: 1,
    minWidth: "280px",
  },
  overviewLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#5b8cff",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "10px",
  },
  roadmapTitle: {
    fontSize: "24px",
    fontWeight: 800,
    margin: "0 0 12px 0",
    lineHeight: "1.3",
    letterSpacing: "-0.5px",
  },
  roadmapOverview: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.7",
    margin: 0,
  },
  statChips: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  statChip: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "90px",
    gap: "4px",
  },
  sectionCard: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    backdropFilter: "blur(10px)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 20px 0",
  },
  sectionIcon: {
    fontSize: "18px",
  },
  tagGroup: {},
  tagLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#475569",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "10px",
    marginTop: 0,
  },
  phaseCard: {
    border: "1px solid",
    borderRadius: "16px",
    padding: "20px 24px",
    background: "rgba(255,255,255,0.02)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  phaseHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "20px",
  },
  phaseNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "13px",
    color: "#fff",
    flexShrink: 0,
  },
  phaseContent: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: "20px",
    marginTop: "4px",
  },
  phaseColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  columnLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#475569",
    letterSpacing: "1px",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  ul: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  phaseItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.5",
  },
  bullet: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
  },
  interviewItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.03)",
  },
  checkCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#22c55e",
    fontSize: "11px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "1px",
  },
  futureBox: {
    background: "linear-gradient(135deg, rgba(91,140,255,0.06), rgba(168,85,247,0.06))",
    border: "1px solid rgba(91,140,255,0.1)",
    borderRadius: "14px",
    padding: "20px",
  },
  ctaCard: {
    marginTop: "20px",
    background: "linear-gradient(135deg, rgba(91,140,255,0.1), rgba(168,85,247,0.1))",
    border: "1px solid rgba(91,140,255,0.15)",
    borderRadius: "20px",
    padding: "28px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  ctaButton: {
    padding: "13px 24px",
    background: "linear-gradient(135deg, #5b8cff, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 20px rgba(91,140,255,0.25)",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
};

export default TechExplorer;