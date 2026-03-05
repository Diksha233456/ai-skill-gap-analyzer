// src/config.js

// Centralized API configuration
// Render sets REACT_APP_* environment variables at build time.
// If not set, it defaults to the known backend URL.
export const API_URL = process.env.REACT_APP_API_URL || "https://ai-skill-gap-analyzer-1-2p7n.onrender.com";
