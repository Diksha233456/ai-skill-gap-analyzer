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

/* ── Field OUTSIDE component so it's never recreated on re-render ── */
function Field({ label, value, onChange, type = "text", placeholder, action }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5b8cff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={type} value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: "100%", padding: "13px 16px", paddingRight: action ? "48px" : "16px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px", fontSize: "14px", color: "#f1f5f9", transition: "all 0.2s"
                    }}
                />
                {action && (
                    <button type="button" onClick={action.fn}
                        style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#64748b" }}>
                        {action.icon}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) { setError("Please fill in both fields."); return; }
        setError(""); setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.message || "Login failed."); setLoading(false); return; }

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
                { top: "-20%", left: "-10%", bg: "rgba(91,140,255,0.4)", size: "600px" },
                { top: "-10%", right: "-15%", bg: "rgba(168,85,247,0.3)", size: "500px" },
                { bottom: "-15%", left: "20%", bg: "rgba(0,255,204,0.12)", size: "500px" },
            ].map((o, i) => (
                <div key={i} style={{ position: "fixed", width: o.size, height: o.size, borderRadius: "50%", background: o.bg, filter: "blur(100px)", zIndex: 0, pointerEvents: "none", ...o }} />
            ))}
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", margin: "20px", animation: "fadeInUp 0.5s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "18px", margin: "0 auto 16px", background: "linear-gradient(135deg,#5b8cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 12px 30px rgba(91,140,255,0.35)", animation: "float 3s ease-in-out infinite" }}>🧠</div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 800, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.5px" }}>Welcome Back</h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Sign in to your AI Skill Gap account</p>
                </div>

                <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
                    <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
                    <Field label="Password" value={password} onChange={setPassword}
                        type={showPwd ? "text" : "password"} placeholder="Your password"
                        action={{ fn: () => setShowPwd(p => !p), icon: showPwd ? "🙈" : "👁" }} />

                    {error && (
                        <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "10px", color: "#fb7185", fontSize: "13px", marginBottom: "16px" }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#5b8cff,#a855f7)", color: "#fff", fontWeight: 800, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(91,140,255,0.35)", transition: "all 0.3s", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        {loading ? (
                            <><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Signing in…</>
                        ) : "Sign In →"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "13px" }}>
                        Don't have an account?{" "}
                        <Link to="/signup" className="auth-link">Create one free →</Link>
                    </p>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", color: "#334155", fontSize: "12px" }}>
                    🔒 Secured with JWT · Your data stays private
                </p>
            </div>
        </div>
    );
}
