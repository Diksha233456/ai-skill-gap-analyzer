import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuthUser, getInitials, logout } from "../services/auth";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:5000";

const CSS = `
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
*{box-sizing:border-box}
input,textarea{font-family:inherit}
input:focus,textarea:focus{outline:none}
.prof-input{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:12px;font-size:14px;color:#f1f5f9;font-family:inherit;transition:all 0.2s}
.prof-input:focus{border-color:rgba(91,140,255,0.6);box-shadow:0 0 0 3px rgba(91,140,255,0.12)}
.prof-input::placeholder{color:rgba(255,255,255,0.25)}
.skill-pill{display:inline-flex;align-items:center;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);color:#34d399;margin:3px}
.nav-link{color:#64748b;font-size:13px;font-weight:600;text-decoration:none;transition:color 0.2s}
.nav-link:hover{color:#f1f5f9}
.tab-btn{padding:8px 20px;border-radius:10px;border:1px solid transparent;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.25s}
.tab-btn.active{background:rgba(91,140,255,0.15);border-color:rgba(91,140,255,0.4);color:#5b8cff}
.tab-btn:not(.active){background:transparent;color:#64748b}
.tab-btn:not(.active):hover{color:#94a3b8;border-color:rgba(255,255,255,0.08)}
`;

function Spinner() {
    return <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />;
}

function Label({ children }) {
    return <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5b8cff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{children}</label>;
}

export default function Profile() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview"); // overview | edit | password
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit fields
    const [editName, setEditName] = useState("");
    const [editRole, setEditRole] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" }); // success | error

    // Password fields
    const [curPwd, setCurPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confPwd, setConfPwd] = useState("");
    const [pwdSaving, setPwdSaving] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    setEditName(data.user.name || "");
                    setEditRole(data.user.targetRole || "");
                } else navigate("/login");
            } catch { navigate("/login"); }
            setLoading(false);
        })();
    }, []);

    const showMsg = (text, type = "success") => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3500);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!editName.trim()) { showMsg("Name cannot be empty.", "error"); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/auth/profile`, {
                method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: editName, targetRole: editRole }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("authUser", JSON.stringify(data.user));
                if (data.token) localStorage.setItem("token", data.token);
                setUser(prev => ({ ...prev, name: data.user.name, targetRole: data.user.targetRole }));
                showMsg("Profile updated successfully! ✅");
            } else showMsg(data.message, "error");
        } catch { showMsg("Server error. Try again.", "error"); }
        setSaving(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPwd || newPwd.length < 6) { showMsg("New password must be at least 6 characters.", "error"); return; }
        if (newPwd !== confPwd) { showMsg("Passwords do not match.", "error"); return; }
        setPwdSaving(true);
        try {
            const res = await fetch(`${API}/api/auth/profile`, {
                method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
            });
            const data = await res.json();
            if (data.success) {
                if (data.token) localStorage.setItem("token", data.token);
                setCurPwd(""); setNewPwd(""); setConfPwd("");
                showMsg("Password changed successfully! 🔐");
            } else showMsg(data.message, "error");
        } catch { showMsg("Server error. Try again.", "error"); }
        setPwdSaving(false);
    };

    const initials = getInitials(user?.name);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0d0821", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <style>{CSS}</style>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <Spinner />
                <p style={{ color: "#64748b", fontSize: "14px" }}>Loading your profile…</p>
            </div>
        </div>
    );

    const score = user?.readinessScore || 0;
    const scoreColor = score >= 70 ? "#34d399" : score >= 40 ? "#f59e0b" : "#fb7185";
    const analysis = (() => { try { return JSON.parse(sessionStorage.getItem("analysisData") || "{}"); } catch { return {}; } })();
    const skills = user?.skills?.length ? user.skills : (analysis.extractedSkills || []);

    return (
        <div style={{ minHeight: "100vh", background: "#0d0821", color: "#f1f5f9", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflowX: "hidden" }}>
            <style>{CSS}</style>

            {/* Orbs */}
            {[
                { top: "-15%", left: "-8%", bg: "rgba(91,140,255,0.3)", size: "600px" },
                { top: "-5%", right: "-10%", bg: "rgba(168,85,247,0.25)", size: "500px" },
                { bottom: "-10%", left: "20%", bg: "rgba(0,255,204,0.1)", size: "400px" },
            ].map((o, i) => (
                <div key={i} style={{ position: "fixed", width: o.size, height: o.size, borderRadius: "50%", background: o.bg, filter: "blur(100px)", zIndex: 0, pointerEvents: "none", ...o }} />
            ))}
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />


            <div style={{ display: "flex", gap: "30px", padding: "40px 60px", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 10 }}>
                {/* Sidebar */}
                <Sidebar showSettings={true} onSettingsClick={() => navigate("/settings")} />

                {/* Main Content */}
                <main style={{ flex: 1, minWidth: 0 }}>

                    {/* Profile Hero */}
                    <div style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "36px", padding: "32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", backdropFilter: "blur(20px)" }}>
                        {/* Avatar */}
                        <div style={{ width: "90px", height: "90px", borderRadius: "24px", background: "linear-gradient(135deg,#5b8cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", fontWeight: 800, color: "#fff", boxShadow: "0 12px 30px rgba(91,140,255,0.4)", flexShrink: 0, animation: "float 3s ease-in-out infinite" }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>{user?.name}</h1>
                            <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: "14px" }}>{user?.email}</p>
                            {user?.targetRole && <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(91,140,255,0.12)", border: "1px solid rgba(91,140,255,0.3)", color: "#5b8cff" }}>🎯 {user.targetRole}</span>}
                        </div>
                        {/* Score ring */}
                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                            <svg width="80" height="80" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                                    strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round"
                                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
                            </svg>
                            <div style={{ marginTop: "-58px", height: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "18px", fontWeight: 800, color: scoreColor }}>{score}%</span>
                            </div>
                            <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Readiness</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                        {[["overview", "👤 Overview"], ["edit", "✏️ Edit Profile"], ["password", "🔐 Change Password"]].map(([id, label]) => (
                            <button key={id} className={`tab-btn${tab === id ? " active" : ""}`} onClick={() => { setTab(id); setMsg({ text: "", type: "" }); }}>{label}</button>
                        ))}
                    </div>

                    {/* Toast */}
                    {msg.text && (
                        <div style={{
                            padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px", fontWeight: 600,
                            background: msg.type === "error" ? "rgba(251,113,133,0.1)" : "rgba(52,211,153,0.1)",
                            border: `1px solid ${msg.type === "error" ? "rgba(251,113,133,0.3)" : "rgba(52,211,153,0.3)"}`,
                            color: msg.type === "error" ? "#fb7185" : "#34d399"
                        }}>
                            {msg.text}
                        </div>
                    )}

                    {/* ─── OVERVIEW TAB ─── */}
                    {tab === "overview" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {/* Stats */}
                            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                                <h3 style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>📊 Stats</h3>
                                {[
                                    { label: "Readiness Score", value: `${score}%`, color: scoreColor },
                                    { label: "Skills Found", value: skills.length, color: "#38bdf8" },
                                    { label: "Target Role", value: user?.targetRole || "Not set", color: "#a855f7" },
                                    { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—", color: "#64748b" },
                                ].map(s => (
                                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: "13px", color: "#94a3b8" }}>{s.label}</span>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: s.color }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                                <h3 style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>🧠 Your Skills</h3>
                                {skills.length > 0 ? (
                                    <div>{skills.slice(0, 18).map(s => <span key={s} className="skill-pill">{s}</span>)}</div>
                                ) : (
                                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                                        <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 12px" }}>No skills detected yet.</p>
                                        <button onClick={() => navigate("/resume")} style={{ padding: "8px 18px", borderRadius: "10px", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34d399", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                            Upload Resume →
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Quick links */}
                            <div style={{ gridColumn: "1/-1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
                                <h3 style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>🚀 Quick Actions</h3>
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                    {[
                                        { label: "Upload New Resume", path: "/resume", color: "#34d399" },
                                        { label: "View Analysis", path: "/analysis", color: "#fb7185" },
                                        { label: "90-Day Sprint", path: "/analysis", color: "#38bdf8" },
                                        { label: "Explore Domains", path: "/explore", color: "#a855f7" },
                                    ].map(a => (
                                        <button key={a.label} onClick={() => navigate(a.path)}
                                            style={{ padding: "9px 18px", borderRadius: "10px", border: `1px solid ${a.color}30`, background: `${a.color}0d`, color: a.color, fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── EDIT PROFILE TAB ─── */}
                    {tab === "edit" && (
                        <form onSubmit={handleSaveProfile} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
                            <h3 style={{ margin: "0 0 24px", fontSize: "16px", fontWeight: 700 }}>✏️ Edit Your Profile</h3>
                            <div style={{ marginBottom: "18px" }}>
                                <Label>Full Name</Label>
                                <input className="prof-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" />
                            </div>
                            <div style={{ marginBottom: "18px" }}>
                                <Label>Email Address</Label>
                                <input className="prof-input" value={user?.email || ""} disabled
                                    style={{ opacity: 0.5, cursor: "not-allowed", width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "14px", color: "#64748b" }} />
                                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#475569" }}>Email cannot be changed.</p>
                            </div>
                            <div style={{ marginBottom: "28px" }}>
                                <Label>Target Role / Domain</Label>
                                <input className="prof-input" value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="e.g. Full Stack Developer, Data Scientist…" />
                            </div>
                            <button type="submit" disabled={saving}
                                style={{ padding: "13px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#5b8cff,#a855f7)", color: "#fff", fontWeight: 800, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px", opacity: saving ? 0.7 : 1 }}>
                                {saving ? <><Spinner /> Saving…</> : "Save Changes →"}
                            </button>
                        </form>
                    )}

                    {/* ─── CHANGE PASSWORD TAB ─── */}
                    {tab === "password" && (
                        <form onSubmit={handleChangePassword} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
                            <h3 style={{ margin: "0 0 24px", fontSize: "16px", fontWeight: 700 }}>🔐 Change Password</h3>
                            <div style={{ marginBottom: "18px" }}>
                                <Label>Current Password</Label>
                                <input className="prof-input" type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="Your current password" />
                            </div>
                            <div style={{ marginBottom: "18px" }}>
                                <Label>New Password</Label>
                                <input className="prof-input" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min. 6 characters" />
                            </div>
                            <div style={{ marginBottom: "28px" }}>
                                <Label>Confirm New Password</Label>
                                <input className="prof-input" type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} placeholder="Repeat new password" />
                                {confPwd && confPwd !== newPwd && <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#fb7185" }}>⚠ Passwords do not match</p>}
                                {confPwd && confPwd === newPwd && <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#34d399" }}>✓ Passwords match</p>}
                            </div>
                            <button type="submit" disabled={pwdSaving}
                                style={{ padding: "13px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#a855f7,#5b8cff)", color: "#fff", fontWeight: 800, fontSize: "14px", cursor: pwdSaving ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px", opacity: pwdSaving ? 0.7 : 1 }}>
                                {pwdSaving ? <><Spinner /> Updating…</> : "Update Password →"}
                            </button>

                            {/* Danger zone */}
                            <div style={{ marginTop: "40px", padding: "20px", borderRadius: "14px", border: "1px solid rgba(251,113,133,0.2)", background: "rgba(251,113,133,0.04)" }}>
                                <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#fb7185" }}>⚠ Danger Zone</h4>
                                <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>This will end your current session and redirect you to the login page.</p>
                                <button type="button" onClick={logout}
                                    style={{ padding: "9px 20px", borderRadius: "10px", border: "1px solid rgba(251,113,133,0.4)", background: "rgba(251,113,133,0.1)", color: "#fb7185", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                    🚪 Logout Now
                                </button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
}
