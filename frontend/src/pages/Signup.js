import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const CSS = `
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
*{box-sizing:border-box}
input{font-family:inherit;color:#f1f5f9!important}
input::placeholder{color:rgba(255,255,255,0.25)!important}
input:focus{outline:none;border-color:rgba(91,140,255,0.6)!important;box-shadow:0 0 0 3px rgba(91,140,255,0.12)!important}
.auth-link{color:#5b8cff;font-weight:600;text-decoration:none}
.auth-link:hover{text-decoration:underline}
`;

/* ── StrengthMeter & Field outside component — never recreated on re-render ── */
function StrengthMeter({ password }) {
    const tests = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
    const score = tests.filter(Boolean).length;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "#ef4444", "#f59e0b", "#38bdf8", "#34d399"];
    if (!password) return null;
    return (
        <div style={{ marginTop: "6px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= score ? colors[score] : "rgba(255,255,255,0.08)", transition: "background 0.3s ease" }} />
                ))}
            </div>
            <span style={{ fontSize: "10px", color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
        </div>
    );
}

function Field({ label, value, onChange, type = "text", placeholder, hint, action, children }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5b8cff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
            <div style={{ position: "relative" }}>
                <input type={type} value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "13px 16px", paddingRight: action ? "48px" : "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", fontSize: "14px", color: "#f1f5f9", transition: "all 0.2s" }}
                />
                {action && (
                    <button type="button" onClick={action.fn}
                        style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#64748b" }}>
                        {action.icon}
                    </button>
                )}
            </div>
            {hint && <p style={{ margin: "4px 0 0", fontSize: "11px", color: hint.startsWith("⚠") ? "#fb7185" : "#34d399" }}>{hint}</p>}
            {children}
        </div>
    );
}

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password) { setError("Please fill in all fields."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        setError(""); setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.message || "Registration failed."); setLoading(false); return; }
            localStorage.setItem("token", data.token);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            sessionStorage.removeItem("analysisData");
            navigate("/");
        } catch { setError("Cannot reach server. Is backend running?"); }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0d0821", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
            <style>{CSS}</style>

            {[
                { top: "-20%", left: "-10%", bg: "rgba(168,85,247,0.35)", size: "600px" },
                { top: "-5%", right: "-15%", bg: "rgba(91,140,255,0.28)", size: "500px" },
                { bottom: "-15%", right: "20%", bg: "rgba(0,255,204,0.12)", size: "500px" },
            ].map((o, i) => (
                <div key={i} style={{ position: "fixed", width: o.size, height: o.size, borderRadius: "50%", background: o.bg, filter: "blur(100px)", zIndex: 0, pointerEvents: "none", ...o }} />
            ))}
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "460px", margin: "20px", animation: "fadeInUp 0.5s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "18px", margin: "0 auto 16px", background: "linear-gradient(135deg,#a855f7,#5b8cff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 12px 30px rgba(168,85,247,0.35)", animation: "float 3s ease-in-out infinite" }}>🚀</div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 800, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.5px" }}>Create Account</h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Start your AI career intelligence journey</p>
                </div>

                <form onSubmit={handleSignup} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
                    <Field label="Full Name" value={name} onChange={setName} placeholder="Diksha" />
                    <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
                    <Field label="Password" value={password} onChange={setPassword}
                        type={showPwd ? "text" : "password"} placeholder="Min. 6 characters"
                        action={{ fn: () => setShowPwd(p => !p), icon: showPwd ? "🙈" : "👁" }}>
                        <StrengthMeter password={password} />
                    </Field>
                    <Field label="Confirm Password" value={confirm} onChange={setConfirm}
                        type={showConfirm ? "text" : "password"} placeholder="Repeat your password"
                        action={{ fn: () => setShowConfirm(p => !p), icon: showConfirm ? "🙈" : "👁" }}
                        hint={confirm && confirm !== password ? "⚠ Passwords do not match" : confirm && confirm === password ? "✓ Passwords match" : ""} />

                    {error && (
                        <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "10px", color: "#fb7185", fontSize: "13px", marginBottom: "16px" }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#a855f7,#5b8cff)", color: "#fff", fontWeight: 800, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(168,85,247,0.35)", transition: "all 0.3s", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        {loading ? (
                            <><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Creating account…</>
                        ) : "Create Account →"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "13px" }}>
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">Sign in →</Link>
                    </p>
                </form>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                    {["🔬 AI Resume Analysis", "🎯 Interview Coach", "🗓 90-Day Sprint", "💡 Career Intel"].map(f => (
                        <span key={f} style={{ fontSize: "11px", color: "#475569", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "4px 12px" }}>{f}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
