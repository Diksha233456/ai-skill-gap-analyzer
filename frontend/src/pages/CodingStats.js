import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Brain,
  Activity,
  Sparkles,
  Search,
  AlertCircle,
  Code,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { getAuthUser, getToken } from "../services/auth";

const BELT_LEVELS = [
  { name: "White Belt", min: 0, color: "#f8fafc", glow: "rgba(248, 250, 252, 0.4)" },
  { name: "Blue Belt", min: 50, color: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },
  { name: "Purple Belt", min: 150, color: "#a855f7", glow: "rgba(168, 85, 247, 0.4)" },
  { name: "Brown Belt", min: 300, color: "#92400e", glow: "rgba(146, 64, 14, 0.4)" },
  { name: "Black Belt", min: 500, color: "#1e293b", glow: "rgba(30, 41, 59, 0.6)" },
  { name: "FAANG Master", min: 1000, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)" },
];

function CodingStats() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [stats, setStats] = useState({
    easy: authUser?.codingStats?.easy || "",
    medium: authUser?.codingStats?.medium || "",
    hard: authUser?.codingStats?.hard || "",
  });
  const [loading, setLoading] = useState(false);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleResult, setOracleResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    if (authUser?.codingHistory) {
      // 1. Calculate Heatmap Data
      const history = authUser.codingHistory;
      const formattedData = history.map(h => ({
        date: new Date(h.date).toISOString().split('T')[0],
        count: h.total > 10 ? 4 : h.total > 5 ? 3 : h.total > 0 ? 2 : 1
      }));
      setHeatmapData(formattedData);

      // 2. Calculate Real Streak
      const dates = history.map(h => new Date(h.date).toDateString());
      const uniqueDates = [...new Set(dates)].map(d => new Date(d)).sort((a, b) => b - a);

      let currentStreak = 0;
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = today;

      // If no entry for today, check yesterday
      const hasToday = uniqueDates.some(d => d.getTime() === checkDate.getTime());
      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      for (let i = 0; i < uniqueDates.length; i++) {
        const d = uniqueDates[i];
        if (d.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }
  }, [authUser]);

  const total = (Number(stats.easy) || 0) + (Number(stats.medium) || 0) + (Number(stats.hard) || 0);

  const getBelt = (total) => {
    let currentBelt = BELT_LEVELS[0];
    for (const belt of BELT_LEVELS) {
      if (total >= belt.min) currentBelt = belt;
    }
    return currentBelt;
  };

  const currentBelt = getBelt(total);

  const chartData = [
    { name: 'Easy', value: Number(stats.easy) || 0, color: '#22c55e' },
    { name: 'Medium', value: Number(stats.medium) || 0, color: '#f59e0b' },
    { name: 'Hard', value: Number(stats.hard) || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const handleChange = (e) => {
    let val = e.target.value;
    if (val !== "") {
      val = parseInt(val, 10);
      if (isNaN(val) || val < 0) val = 0;
    }
    setStats({ ...stats, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/coding-stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(stats),
      });
      const data = await res.json();
      if (data.success) {
        // Update local storage too so streak/heatmap updates immediately
        const updatedUser = data.user; // Use the returned user which has new codingHistory
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
        // Force a re-render of the history-dependent variables by simulating a state change
        // In a real app we'd use Context, but here we can just reload the page for a quick refresh
        // since the state is currently tied to the initial getAuthUser() call.
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to save stats: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const consultOracle = async () => {
    setOracleLoading(true);
    setOracleResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/coding-oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          codingStats: stats,
          resumeSkills: authUser?.skills || [],
          targetRole: authUser?.targetRole || "Software Engineer"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOracleResult(data);
      }
    } catch (err) {
      alert("Oracle is currently offline: " + err.message);
    } finally {
      setOracleLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gridOverlay} />

      <div style={styles.contentLayout}>
        <main style={styles.mainContent}>
          <nav style={styles.nav}>
            <button onClick={() => navigate("/")} style={styles.backBtn}>
              <ArrowLeft size={16} />
              Return to Dashboard
            </button>
          </nav>
          {/* Header Section */}
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.badge}
              >
                <Code size={14} style={{ color: "var(--accent-blue)" }} />
                <span>CODING STATS 2.0</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={styles.title}
              >
                Algorithmic <span style={styles.gradientText}>Readiness</span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={styles.streakCard}
            >
              <Flame size={20} style={{ color: "#f97316" }} />
              <div>
                <div style={styles.streakValue}>{streak} Day Streak</div>
                <div style={styles.streakLabel}>Consistency is Key</div>
              </div>
            </motion.div>
          </header>

          <div style={styles.dashboardGrid}>
            {/* LEFT: Input & Gamification */}
            <div style={styles.columnLeft}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={styles.card}
              >
                <div style={styles.cardHeader}>
                  <Trophy size={18} style={{ color: currentBelt.color }} />
                  <h3 style={styles.cardTitle}>Current Rank</h3>
                  <div style={{ ...styles.beltTag, background: currentBelt.color, boxShadow: `0 0 15px ${currentBelt.glow}` }}>
                    {currentBelt.name}
                  </div>
                </div>

                <div style={styles.statsDisplay}>
                  <div style={styles.ringChartContainer}>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={styles.emptyChart}>
                        <Activity size={40} style={{ opacity: 0.2 }} />
                      </div>
                    )}
                    <div style={styles.totalOverlay}>
                      <div style={styles.totalValue}>{total.toString()}</div>
                      <div style={styles.totalLabel}>Solved</div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} style={styles.statForm}>
                    <div style={styles.statInputs}>
                      <div style={styles.miniInputGroup}>
                        <label style={{ ...styles.miniLabel, color: "#22c55e" }}>Easy</label>
                        <input
                          type="number"
                          name="easy"
                          value={stats.easy}
                          placeholder="0"
                          onChange={handleChange}
                          style={styles.miniInput}
                        />
                      </div>
                      <div style={styles.miniInputGroup}>
                        <label style={{ ...styles.miniLabel, color: "#f59e0b" }}>Med</label>
                        <input
                          type="number"
                          name="medium"
                          value={stats.medium}
                          placeholder="0"
                          onChange={handleChange}
                          style={styles.miniInput}
                        />
                      </div>
                      <div style={styles.miniInputGroup}>
                        <label style={{ ...styles.miniLabel, color: "#ef4444" }}>Hard</label>
                        <input
                          type="number"
                          name="hard"
                          value={stats.hard}
                          placeholder="0"
                          onChange={handleChange}
                          style={styles.miniInput}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={styles.saveButton}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Log Progress Manually"}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Consistency Heatmap */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={styles.card}
              >
                <div style={styles.cardHeader}>
                  <Activity size={18} style={{ color: "var(--accent-blue)" }} />
                  <h3 style={styles.cardTitle}>Practice Momentum</h3>
                </div>
                <div style={styles.heatmapWrapper}>
                  <CalendarHeatmap
                    startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
                    endDate={new Date()}
                    values={heatmapData}
                    classForValue={(value) => {
                      if (!value) return 'color-empty';
                      return `color-scale-${value.count}`;
                    }}
                  />
                </div>
                <div style={styles.heatmapLegend}>
                  <span>Less</span>
                  <div style={{ ...styles.legendDot, background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ ...styles.legendDot, background: 'rgba(56, 189, 248, 0.3)' }} />
                  <div style={{ ...styles.legendDot, background: 'rgba(56, 189, 248, 0.6)' }} />
                  <div style={{ ...styles.legendDot, background: 'rgba(56, 189, 248, 1)' }} />
                  <span>More</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: AI Oracle */}
            <div style={styles.columnRight}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                style={styles.oracleCard}
              >
                <div style={styles.oracleHeader}>
                  <div style={styles.oracleTitleGroup}>
                    <Brain size={24} style={{ color: "#a855f7" }} />
                    <h2 style={styles.oracleTitle}>AI Technical Oracle</h2>
                  </div>
                  {!oracleResult && !oracleLoading && (
                    <button onClick={consultOracle} style={styles.oracleBtn}>
                      <Sparkles size={16} />
                      Simulate Technical Audit
                    </button>
                  )}
                </div>

                <div style={styles.oracleBody}>
                  {oracleLoading ? (
                    <div style={styles.oracleLoading}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap size={40} style={{ color: "#a855f7" }} />
                      </motion.div>
                      <p>Calculating Readiness Vectors...</p>
                    </div>
                  ) : oracleResult ? (
                    <div style={styles.oracleResult}>
                      <div style={styles.readinessHeader}>
                        <div style={styles.readinessScore}>
                          <div style={styles.scoreCircle}>
                            <svg viewBox="0 0 36 36" style={styles.svgCircle}>
                              <path
                                style={{ stroke: "rgba(168, 85, 247, 0.2)" }}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <motion.path
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: `${oracleResult.readinessScore}, 100` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{ stroke: "#a855f7" }}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div style={styles.scoreText}>{oracleResult.readinessScore}%</div>
                          </div>
                          <div style={styles.scoreInfo}>
                            <div style={styles.scoreLabel}>FAANG READINESS</div>
                            <div style={styles.beltBadge}>{oracleResult.beltRank}</div>
                          </div>
                        </div>
                        <div style={styles.verdictBadgeContainer}>
                          {oracleResult.interviewVerdict === "Passed" ? (
                            <div style={{ ...styles.verdictBadge, color: "#22c55e", background: "rgba(34, 197, 94, 0.1)" }}>
                              <ShieldCheck size={14} /> INTERVIEW PASSED
                            </div>
                          ) : oracleResult.interviewVerdict === "Marginal" ? (
                            <div style={{ ...styles.verdictBadge, color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
                              <ShieldQuestion size={14} /> MARGINAL FIT
                            </div>
                          ) : oracleResult.interviewVerdict === "Not Started" ? (
                            <div style={{ ...styles.verdictBadge, color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)" }}>
                              <ShieldQuestion size={14} /> NOT STARTED
                            </div>
                          ) : (
                            <div style={{ ...styles.verdictBadge, color: "#ef4444", background: "rgba(239, 68, 68, 0.1)" }}>
                              <ShieldAlert size={14} /> INTERVIEW FAILED
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={styles.matchSummaryBox}>
                        <Sparkles size={16} style={{ color: "#a855f7" }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0 }}>{oracleResult.matchSummary}</p>
                          <div style={styles.salaryIndicator}>
                            <Zap size={12} /> Predicted Salary Impact: <span style={{ color: "#22c55e" }}>{oracleResult.estimatedSalaryImpact}</span>
                          </div>
                        </div>
                      </div>

                      {/* NEW: Topic Mastery Radar */}
                      {oracleResult.topicMastery && oracleResult.topicMastery.length > 0 && (
                        <div style={styles.radarSection}>
                          <h5 style={styles.analysisTitle}>Algorithmic Fingerprint</h5>
                          <div style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={oracleResult.topicMastery}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="topic" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                  name="Mastery"
                                  dataKey="score"
                                  stroke="#a855f7"
                                  fill="#a855f7"
                                  fillOpacity={0.5}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <div style={styles.analysisGrid}>
                        <div style={styles.analysisColumn}>
                          <h5 style={styles.analysisTitle}>Technical Strengths</h5>
                          <ul style={styles.analysisList}>
                            {oracleResult.strengths.map((s, i) => (
                              <li key={i} style={styles.analysisItem}>
                                <CheckCircle size={12} style={{ color: "#22c55e" }} />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={styles.analysisColumn}>
                          <h5 style={styles.analysisTitle}>Critical Gaps</h5>
                          <ul style={styles.analysisList}>
                            {oracleResult.weaknesses.map((w, i) => (
                              <li key={i} style={styles.analysisItem}>
                                <XCircle size={12} style={{ color: "#ef4444" }} />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={styles.verdictBox}>
                        <Brain size={16} style={{ color: "#c084fc" }} />
                        <p style={styles.verdictText}>{oracleResult.verdict}</p>
                      </div>

                      <div style={styles.weaknessSection}>
                        <h4 style={styles.sectionTitle}>Precision Study Plan</h4>
                        <div style={styles.patternGrid}>
                          {oracleResult.recommendedPatterns.map((p, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * i }}
                              style={styles.patternCard}
                            >
                              <div style={styles.patternHeader}>
                                <Target size={14} />
                                <span>{p.pattern}</span>
                                <span style={{ ...styles.diffBadge, color: p.difficulty === 'Hard' ? '#ef4444' : p.difficulty === 'Medium' ? '#f59e0b' : '#22c55e' }}>
                                  {p.difficulty}
                                </span>
                              </div>
                              <p style={styles.patternReason}>{p.reason}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <button onClick={consultOracle} style={styles.reSimBtn}>
                        <Activity size={14} />
                        Sync Data & Run New Audit
                      </button>
                    </div>
                  ) : (
                    <div style={styles.oracleEmpty}>
                      <div style={styles.oracleIconBg}>
                        <Search size={30} style={{ color: "rgba(255,255,255,0.2)" }} />
                      </div>
                      <h3>Ready to audit your skills?</h3>
                      <p>Click the button above to let the AI analyze your LeetCode stats against target FAANG role requirements.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        /* Heatmap Styles */
        .react-calendar-heatmap .color-empty { fill: rgba(255, 255, 255, 0.05); }
        .react-calendar-heatmap .color-scale-1 { fill: rgba(56, 189, 248, 0.3); }
        .react-calendar-heatmap .color-scale-2 { fill: rgba(56, 189, 248, 0.6); }
        .react-calendar-heatmap .color-scale-3 { fill: rgba(56, 189, 248, 0.8); }
        .react-calendar-heatmap .color-scale-4 { fill: rgba(56, 189, 248, 1); }
        .react-calendar-heatmap rect { rx: 2px; ry: 2px; }
        
        /* Hide Number Input Arrows */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#08041a",
    color: "var(--text-primary)",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: "radial-gradient(circle at 50% 50%, rgba(91, 140, 255, 0.05) 0%, transparent 60%)",
    zIndex: 0,
    pointerEvents: "none",
  },
  contentLayout: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    position: "relative",
    zIndex: 1,
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  nav: {
    marginBottom: "10px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "8px 16px",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "10px",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    background: "rgba(91, 140, 255, 0.1)",
    border: "1px solid rgba(91, 140, 255, 0.2)",
    borderRadius: "100px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1px",
    marginBottom: "12px",
    width: "fit-content",
  },
  title: {
    fontSize: "42px",
    fontWeight: 800,
    margin: 0,
    fontFamily: "Outfit, sans-serif",
  },
  gradientText: {
    background: "linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  streakCard: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "12px 20px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  streakValue: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#fff",
  },
  streakLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "30px",
  },
  columnLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "24px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 700,
    margin: 0,
    flex: 1,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  beltTag: {
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 900,
    color: "#fff",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  statsDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  ringChartContainer: {
    width: "180px",
    height: "200px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  totalOverlay: {
    position: "absolute",
    textAlign: "center",
  },
  totalValue: {
    fontSize: "32px",
    fontWeight: 900,
    lineHeight: 1,
  },
  totalLabel: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
  },
  emptyChart: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px dashed rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  statInputs: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  miniInputGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.03)",
    padding: "8px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  miniLabel: {
    fontSize: "12px",
    fontWeight: 700,
  },
  miniInput: {
    width: "60px",
    background: "transparent",
    border: "none",
    color: "#fff",
    textAlign: "right",
    fontSize: "16px",
    fontWeight: 700,
    outline: "none",
  },
  saveButton: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#fff",
    color: "#08041a",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  heatmapWrapper: {
    padding: "10px 0",
  },
  heatmapLegend: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "2px",
  },
  oracleCard: {
    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
    border: "1px solid rgba(168, 85, 247, 0.15)",
    borderRadius: "32px",
    padding: "32px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    position: "relative",
    overflow: "hidden",
  },
  oracleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  oracleTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  oracleTitle: {
    fontSize: "20px",
    fontWeight: 800,
    margin: 0,
  },
  oracleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(168, 85, 247, 0.3)",
  },
  oracleBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  oracleLoading: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
  },
  oracleEmpty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px",
    gap: "10px",
  },
  oracleIconBg: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  },
  oracleResult: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  readinessHeader: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    padding: "20px",
    borderRadius: "20px",
  },
  readinessScore: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  scoreCircle: {
    width: "70px",
    height: "70px",
    position: "relative",
  },
  svgCircle: {
    width: "100%",
    height: "100%",
    fill: "none",
    strokeWidth: 3.5,
    strokeLinecap: "round",
    transform: "rotate(-90deg)",
    transformOrigin: "50% 50%",
  },
  scoreText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "18px",
    fontWeight: 900,
  },
  scoreInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  scoreLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "rgba(255,255,255,0.4)",
  },
  beltBadge: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#a855f7",
  },
  verdictBox: {
    display: "flex",
    gap: "12px",
    background: "rgba(255,255,255,0.03)",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(192, 132, 252, 0.2)",
    fontSize: "13px",
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.7)",
  },
  verdictText: {
    margin: 0,
    fontStyle: "italic",
  },
  verdictBadgeContainer: {
    marginLeft: "auto",
  },
  verdictBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.5px",
  },
  matchSummaryBox: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "rgba(168, 85, 247, 0.05)",
    padding: "14px 20px",
    borderRadius: "16px",
    border: "1px solid rgba(168, 85, 247, 0.1)",
    fontSize: "14px",
    fontWeight: 500,
    color: "#e2e8f0",
  },
  analysisGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  analysisColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  analysisTitle: {
    fontSize: "11px",
    fontWeight: 800,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    margin: 0,
    letterSpacing: "1px",
  },
  analysisList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  analysisItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
  },
  salaryIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    marginTop: "4px",
    fontWeight: 600,
  },
  radarSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "rgba(255,255,255,0.02)",
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  weaknessSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "rgba(255,255,255,0.4)",
    margin: 0,
  },
  patternGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
  },
  patternCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "16px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  patternHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
  },
  diffBadge: {
    marginLeft: "auto",
    fontSize: "10px",
    fontWeight: 800,
  },
  patternReason: {
    fontSize: "12px",
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.5)",
    margin: 0,
  },
  reSimBtn: {
    marginTop: "10px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.4)",
    padding: "10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  }
};

export default CodingStats;
