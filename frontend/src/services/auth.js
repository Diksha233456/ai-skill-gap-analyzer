// Shared auth utilities — used across all pages

export function getAuthUser() {
    try {
        const u = localStorage.getItem("authUser");
        return u ? JSON.parse(u) : null;
    } catch { return null; }
}

export function getToken() {
    return localStorage.getItem("token") || null;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("analysisData");
    window.location.href = "/login";
}

export function getInitials(name) {
    if (!name) return "US";
    return name.trim().split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}
