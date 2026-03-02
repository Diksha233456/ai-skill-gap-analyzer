import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, Eye, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { logout } from "../services/auth";

const API = "http://localhost:5000";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    privateProfile: false,
    showInSearch: true,
    animations: true
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user && data.user.settings) {
          setSettings({
            notifications: data.user.settings.notifications ?? true,
            autoSave: data.user.settings.autoSave ?? true,
            privateProfile: data.user.settings.privateProfile ?? false,
            showInSearch: data.user.settings.showInSearch ?? true,
            animations: data.user.settings.animations ?? true
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
      setLoading(false);
    })();
  }, [token]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setMessage(""); // Clear message on change
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings saved successfully! ✅");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings: " + data.message);
      }
    } catch (error) {
      setMessage("Server error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#0d0821", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading settings...</div>;
  }

  return (
    <div style={styles.container}>
      <style>{`
        :root {
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --accent-blue: #5b8cff;
          --accent-red: #fb7185;
        }
        .outfit { font-family: 'Outfit', sans-serif; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .slider:before {
          position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 3px;
          background-color: white; transition: .3s; border-radius: 50%;
        }
        .toggle input:checked + .slider {
          background-color: var(--accent-blue);
          border-color: var(--accent-blue);
        }
        .toggle input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>

      {/* Background */}
      <div style={styles.background} />

      <div style={styles.innerContainer}>
        {/* Sidebar */}
        <Sidebar showSettings={true} onSettingsClick={() => { }} />

        {/* Main Content */}
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 className="outfit" style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Manage your account and preferences</p>
          </div>

          {message && (
            <div style={{ ...styles.messageBox, background: message.includes("success") ? "rgba(52, 211, 153, 0.1)" : "rgba(251, 113, 133, 0.1)", color: message.includes("success") ? "#34d399" : "#fb7185", border: `1px solid ${message.includes("success") ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 113, 133, 0.3)"}` }}>
              {message}
            </div>
          )}

          <div style={styles.tabContainer}>
            <div style={styles.tabs}>
              {[
                { id: "general", label: "General", icon: <Bell size={16} /> },
                { id: "privacy", label: "Privacy", icon: <Lock size={16} /> },
                { id: "display", label: "Display", icon: <Eye size={16} /> },
              ].map((tab) => (
                <div
                  key={tab.id}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
              {/* General Tab */}
              {activeTab === "general" && (
                <div style={styles.settingGroup}>
                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Email Notifications</div>
                      <div style={styles.settingDescription}>
                        Receive updates about your skill gaps and career progress
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={() => handleToggle('notifications')}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Resume Auto-Save</div>
                      <div style={styles.settingDescription}>
                        Automatically save your resume when you make changes
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={() => handleToggle('autoSave')}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div style={styles.settingGroup}>
                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Private Profile</div>
                      <div style={styles.settingDescription}>
                        Hide your profile from other users
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.privateProfile}
                        onChange={() => handleToggle('privateProfile')}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Show Resume in Search</div>
                      <div style={styles.settingDescription}>
                        Allow your resume to be visible in search results
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.showInSearch}
                        onChange={() => handleToggle('showInSearch')}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.buttonGroup}>
                    <button style={styles.dangerButton} onClick={() => {
                      if (window.confirm("Are you sure you want to log out? (Delete Account isn't implemented yet)")) {
                        logout();
                      }
                    }}>
                      <LogOut size={16} /> Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Display Tab */}
              {activeTab === "display" && (
                <div style={styles.settingGroup}>
                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Dark Mode</div>
                      <div style={styles.settingDescription}>
                        Automatically enabled. Light mode coming soon!
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input type="checkbox" checked disabled />
                      <span style={styles.slider}></span>
                    </label>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.settingItem}>
                    <div>
                      <div style={styles.settingLabel}>Animations</div>
                      <div style={styles.settingDescription}>
                        Enable smooth transitions and animations
                      </div>
                    </div>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.animations}
                        onChange={() => handleToggle('animations')}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              )}

              <button
                style={{ ...styles.saveButton, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },

  background: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #0d0821 0%, #1a0f2e 50%, #0d1b2a 100%)",
    zIndex: -1,
  },

  innerContainer: {
    display: "flex",
    gap: "30px",
    padding: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  header: {
    marginBottom: "40px",
  },

  title: {
    fontSize: "42px",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: "0 0 12px",
    letterSpacing: "-1px",
  },

  subtitle: {
    fontSize: "16px",
    color: "var(--text-secondary)",
    margin: 0,
  },

  messageBox: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "var(--text-primary)",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: 500,
  },

  tabContainer: {
    background: "rgba(20, 10, 50, 0.4)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    overflow: "hidden",
  },

  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    gap: 0,
  },

  tab: {
    flex: 1,
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.2s ease",
    borderBottom: "2px solid transparent",
    fontFamily: "Outfit, sans-serif",
  },

  tabActive: {
    color: "var(--accent-blue)",
    borderBottomColor: "var(--accent-blue)",
  },

  tabContent: {
    padding: "30px",
  },

  settingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "4px",
  },

  settingLabel: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "4px",
    fontFamily: "Outfit, sans-serif",
  },

  settingDescription: {
    fontSize: "13px",
    color: "var(--text-secondary)",
  },

  divider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.06)",
    margin: "8px 0",
  },

  toggle: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
  },

  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    transition: "0.3s",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  },

  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },

  saveButton: {
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, var(--accent-blue) 0%, #a78bfa 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    transition: "all 0.3s ease",
    marginTop: "30px",
    fontFamily: "Outfit, sans-serif",
  },

  dangerButton: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(251, 113, 133, 0.1)",
    border: "1px solid rgba(251, 113, 133, 0.3)",
    borderRadius: "10px",
    color: "#fb7185",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "Outfit, sans-serif",
  },
};
