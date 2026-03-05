import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../config";

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

function Field({ label, value, onChange, type, placeholder, action }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#5b8cff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={type} value={value}
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
        </div>
    );
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) setError("Invalid reset link. Please request a new one.");
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirm) { setError("Please fill in both fields."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        if (!token) { setError("Invalid reset link. Please request a new one."); return; }

        setError(""); setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.message || "Reset failed."); setLoading(false); return; }
            setSuccess(true);
            // Redirect to login after 2.5 seconds
            setTimeout(() => navigate("/login"), 2500);
        } catch {
            setError("Cannot reach server. Is backend running?");
        }
        setLoading(false);
    };

    const orbs = [
        { top: "-20%", left: "-10%", bg: "rgba(91,140,255,0.4)", size: "600px" },
        { top: "-10%", right: "-15%", bg: "rgba(168,85,247,0.3)", size: "500px" },
        { bottom: "-15%", left: "20%", bg: "rgba(0,255,204,0.12)", size: "500px" },
    ];

    return (
        <div style={{ minHeight: "100vh", backgroundImage: "url('/ai-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "fixed", inset: 0, background: "rgba(5,2,20,0.75)", zIndex: 0, pointerEvents: "none" }} />
            <style>{CSS}</style>

            {orbs.map((o, i) => (
                <div key={i} style={{ position: "fixed", width: o.size, height: o.size, borderRadius: "50%", background: o.bg, filter: "blur(100px)", zIndex: 0, pointerEvents: "none", ...o }} />
            ))}
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", margin: "20px", animation: "fadeInUp 0.5s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "18px", margin: "0 auto 16px", background: "linear-gradient(135deg,#5b8cff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 12px 30px rgba(91,140,255,0.35)", animation: "float 3s ease-in-out infinite" }}>🔐</div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 800, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.5px" }}>Reset Password</h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Enter your new password below.</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>

                    {success ? (
                        /* ── Success State ── */
                        <div style={{ textAlign: "center", padding: "12px 0" }}>
                            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎉</div>
                            <h2 style={{ color: "#f1f5f9", fontFamily: "'Outfit',sans-serif", marginTop: 0 }}>Password Reset!</h2>
                            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>
                                Your password has been updated successfully. Redirecting you to sign in…
                            </p>
                            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                                <span style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#5b8cff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                            </div>
                        </div>
                    ) : (
                        /* ── Form State ── */
                        <form onSubmit={handleSubmit}>
                            <Field label="New Password" value={password} onChange={setPassword}
                                type={showPwd ? "text" : "password"} placeholder="Min. 6 characters"
                                action={{ fn: () => setShowPwd(p => !p), icon: showPwd ? "🙈" : "👁" }} />
                            <Field label="Confirm Password" value={confirm} onChange={setConfirm}
                                type={showConfirm ? "text" : "password"} placeholder="Repeat your password"
                                action={{ fn: () => setShowConfirm(p => !p), icon: showConfirm ? "🙈" : "👁" }} />

                            {/* Password match indicator */}
                            {confirm && (
                                <div style={{ marginBottom: "16px", fontSize: "12px", color: password === confirm ? "#34d399" : "#fb7185", display: "flex", alignItems: "center", gap: "6px" }}>
                                    {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                                </div>
                            )}

                            {error && (
                                <div style={{ padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", borderRadius: "10px", color: "#fb7185", fontSize: "13px", marginBottom: "16px" }}>
                                    ⚠ {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading || !token}
                                style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#5b8cff,#a855f7)", color: "#fff", fontWeight: 800, fontSize: "15px", cursor: (loading || !token) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(91,140,255,0.35)", transition: "all 0.3s", opacity: (loading || !token) ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                {loading ? (
                                    <><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Resetting…</>
                                ) : "Reset Password →"}
                            </button>

                            <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "13px" }}>
                                <Link to="/forgot-password" className="auth-link">← Request a new link</Link>
                            </p>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: "center", marginTop: "20px", color: "#334155", fontSize: "12px" }}>
                    🔒 Secured with JWT · Your data stays private
                </p>
            </div>
        </div>
    );
}
