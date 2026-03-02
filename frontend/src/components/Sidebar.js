import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, LogOut, Home, FileText, Code, LineChart, Compass, User } from "lucide-react";
import { getAuthUser, getInitials, logout } from "../services/auth";

export default function Sidebar({ showSettings = false, onSettingsClick = () => {} }) {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const initials = getInitials(authUser?.name);

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Resume", icon: FileText, path: "/resume" },
    { label: "Coding Stats", icon: Code, path: "/coding" },
    { label: "Analysis", icon: LineChart, path: "/analysis" },
    { label: "Explore", icon: Compass, path: "/explore" },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Back Button */}
      <div style={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </div>

      {/* Profile Section */}
      <div style={styles.profileSection}>
        <div style={styles.profileIcon}>{initials}</div>
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>{authUser?.name || "User"}</div>
          <div style={styles.profileEmail}>{authUser?.email || "user@email.com"}</div>
        </div>
        <button
          style={styles.profileButton}
          onClick={() => navigate("/profile")}
          title="Go to Profile"
        >
          <User size={16} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={styles.navContainer}>
        <div style={styles.navLabel}>Navigation</div>
        {navItems.map((item) => (
          <div
            key={item.path}
            style={styles.navItem}
            onClick={() => navigate(item.path)}
            onMouseEnter={(e) => (e.currentTarget.style.background = styles.navItemHover.background)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <item.icon size={18} style={{ color: "var(--accent-blue)" }} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Settings Section */}
      {showSettings && (
        <div style={styles.settingsSection}>
          <div style={styles.settingsLabel}>Settings</div>
          <div
            style={styles.settingItem}
            onClick={onSettingsClick}
            onMouseEnter={(e) => (e.currentTarget.style.background = styles.settingItemHover.background)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Settings size={16} />
            <span>Preferences</span>
          </div>
        </div>
      )}

      {/* Logout */}
      <div
        style={styles.logoutButton}
        onClick={logout}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251, 113, 133, 0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "280px",
    background: "rgba(20, 10, 50, 0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    position: "sticky",
    top: "20px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: "rgba(91, 140, 255, 0.1)",
    border: "1px solid rgba(91, 140, 255, 0.2)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.25s ease",
    fontFamily: "Outfit, sans-serif",
  },

  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "rgba(91, 140, 255, 0.08)",
    border: "1px solid rgba(91, 140, 255, 0.15)",
    borderRadius: "12px",
  },

  profileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "14px",
    flexShrink: 0,
  },

  profileInfo: {
    flex: 1,
    overflow: "hidden",
  },

  profileName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  profileEmail: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: "2px",
  },

  profileButton: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(91, 140, 255, 0.15)",
    border: "1px solid rgba(91, 140, 255, 0.2)",
    color: "var(--accent-blue)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },

  navContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    paddingLeft: "4px",
    marginBottom: "4px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    fontFamily: "Outfit, sans-serif",
  },

  navItemHover: {
    background: "rgba(56, 189, 248, 0.1)",
  },

  settingsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "12px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  },

  settingsLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    paddingLeft: "4px",
    marginBottom: "4px",
  },

  settingItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    fontFamily: "Outfit, sans-serif",
  },

  settingItemHover: {
    background: "rgba(251, 191, 36, 0.1)",
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#fb7185",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    fontFamily: "Outfit, sans-serif",
    marginTop: "auto",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    paddingTop: "16px",
  },
};
