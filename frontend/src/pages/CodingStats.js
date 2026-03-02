import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Target, Zap, Brain, Activity,
  Sparkles, Search, Code, ArrowLeft,
  CheckCircle, XCircle,
  ShieldCheck, ShieldAlert, ShieldQuestion
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getAuthUser, getToken } from "../services/auth";

/* ---------------- BELT SYSTEM ---------------- */

const BELT_LEVELS = [
  { name: "White Belt", min: 0, color: "#f8fafc", glow: "rgba(248,250,252,0.4)" },
  { name: "Blue Belt", min: 50, color: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
  { name: "Purple Belt", min: 150, color: "#a855f7", glow: "rgba(168,85,247,0.4)" },
  { name: "Brown Belt", min: 300, color: "#92400e", glow: "rgba(146,64,14,0.4)" },
  { name: "Black Belt", min: 500, color: "#1e293b", glow: "rgba(30,41,59,0.6)" },
  { name: "FAANG Master", min: 1000, color: "#fbbf24", glow: "rgba(251,191,36,0.6)" }
];

/* ---------------- COMPONENT ---------------- */

function CodingStats() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [stats, setStats] = useState({
    easy: authUser?.codingStats?.easy || "",
    medium: authUser?.codingStats?.medium || "",
    hard: authUser?.codingStats?.hard || ""
  });

  const [loading, setLoading] = useState(false);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleResult, setOracleResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [heatmapData, setHeatmapData] = useState([]);

  /* ---------------- STREAK + HEATMAP ---------------- */

  useEffect(() => {
    if (!authUser?.codingHistory) return;

    const history = authUser.codingHistory;

    const formattedData = history.map(h => ({
      date: new Date(h.date).toISOString().split("T")[0],
      count: h.total > 10 ? 4 : h.total > 5 ? 3 : h.total > 0 ? 2 : 1
    }));

    setHeatmapData(formattedData);

    const dates = history.map(h => new Date(h.date).toDateString());
    const uniqueDates = [...new Set(dates)]
      .map(d => new Date(d))
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = today;
    const hasToday = uniqueDates.some(d => d.getTime() === checkDate.getTime());

    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let d of uniqueDates) {
      if (d.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    setStreak(currentStreak);
  }, [authUser]);

  const total =
    (Number(stats.easy) || 0) +
    (Number(stats.medium) || 0) +
    (Number(stats.hard) || 0);

  const currentBelt = BELT_LEVELS.reduce(
    (prev, belt) => (total >= belt.min ? belt : prev),
    BELT_LEVELS[0]
  );

  const chartData = [
    { name: "Easy", value: Number(stats.easy) || 0, color: "#22c55e" },
    { name: "Medium", value: Number(stats.medium) || 0, color: "#f59e0b" },
    { name: "Hard", value: Number(stats.hard) || 0, color: "#ef4444" }
  ].filter(d => d.value > 0);

  /* ---------------- SAVE STATS ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/coding-stats",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(stats)
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to save stats");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ORACLE ---------------- */

  const consultOracle = async () => {
    setOracleLoading(true);
    setOracleResult(null);

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai/coding-oracle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            codingStats: stats,
            resumeSkills: authUser?.skills || [],
            targetRole: authUser?.targetRole || "Software Engineer"
          })
        }
      );

      const data = await res.json();
      if (data.success) setOracleResult(data);

    } catch (err) {
      alert("Oracle offline");
    } finally {
      setOracleLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.page}>
      <div style={styles.gridOverlay} />

      <div style={styles.contentLayout}>
        <main style={styles.mainContent}>
          <button onClick={() => navigate("/")} style={styles.backBtn}>
            <ArrowLeft size={16} />
            Return to Dashboard
          </button>

          <h1 style={styles.title}>
            Algorithmic <span style={styles.gradient}>Readiness</span>
          </h1>

          <div style={styles.card}>
            <h3>Current Rank: {currentBelt.name}</h3>
            <p>Total Solved: {total}</p>
          </div>

          <button onClick={consultOracle} style={styles.oracleBtn}>
            {oracleLoading ? "Analyzing..." : "Run AI Technical Audit"}
          </button>

          {oracleResult && (
            <div style={styles.card}>
              <h3>Readiness Score: {oracleResult.readinessScore}%</h3>
              <p>{oracleResult.verdict}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "url('/coding-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    position: "relative"
  },
  gridOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(5,2,20,0.78)",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px"
  },
  contentLayout: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    position: "relative",
    zIndex: 1
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  title: {
    fontSize: "42px",
    fontWeight: 800
  },
  gradient: {
    background: "linear-gradient(135deg,#38bdf8,#c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "20px"
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  },
  oracleBtn: {
    background: "#a855f7",
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700
  }
};

export default CodingStats;