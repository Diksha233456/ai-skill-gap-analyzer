const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const sign = (user) =>
    jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ─── REGISTER ─── */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "Name, email and password are required." });
        if (password.length < 6)
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

        const existing = await User.findOne({ email }).select("+password");

        // If user exists but has NO password (old account from before auth was added),
        // allow them to set a password now (account upgrade)
        if (existing && !existing.password) {
            existing.name = name;
            existing.password = password; // will be hashed by pre-save hook
            await existing.save();
            const token = sign(existing);
            return res.status(200).json({ success: true, token, user: { id: existing._id, name: existing.name, email: existing.email, settings: existing.settings, codingStats: existing.codingStats } });
        }

        if (existing)
            return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });

        const user = await User.create({ name, email, password, targetRole: "" });
        const token = sign(user);
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, settings: user.settings, codingStats: user.codingStats } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ─── LOGIN ─── */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: "Email and password are required." });

        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res.status(401).json({ success: false, message: "No account found with this email." });

        // Old account without password — prompt to register
        if (!user.password)
            return res.status(401).json({ success: false, message: "This account was created without a password. Please go to Sign Up to set one." });

        const valid = await user.comparePassword(password);
        if (!valid)
            return res.status(401).json({ success: false, message: "Incorrect password." });

        const token = sign(user);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, settings: user.settings, codingStats: user.codingStats } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ─── GET PROFILE ─── */
router.get("/profile", async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ success: false, message: "No token." });
        const decoded = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        res.json({ success: true, user });
    } catch {
        res.status(401).json({ success: false, message: "Invalid token." });
    }
});

/* ─── UPDATE PROFILE ─── */
router.put("/profile", async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ success: false, message: "No token." });
        const decoded = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("+password");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const { name, targetRole, currentPassword, newPassword, settings } = req.body;

        if (name && name.trim()) user.name = name.trim();
        if (targetRole !== undefined) user.targetRole = targetRole;
        if (settings) {
            user.settings = { ...user.settings, ...settings };
        }

        // Change password flow
        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ success: false, message: "Current password is required to set a new one." });
            if (user.password) {
                const valid = await user.comparePassword(currentPassword);
                if (!valid) return res.status(400).json({ success: false, message: "Current password is incorrect." });
            }
            if (newPassword.length < 6) return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
            user.password = newPassword; // hashed by pre-save
        }

        await user.save();
        // Update token with new name
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, targetRole: user.targetRole, skills: user.skills, readinessScore: user.readinessScore, settings: user.settings, codingStats: user.codingStats } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ─── UPDATE CODING STATS ─── */
router.put("/coding-stats", async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ success: false, message: "No token." });
        const decoded = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const { easy, medium, hard } = req.body;
        const nEasy = Number(easy) || 0;
        const nMedium = Number(medium) || 0;
        const nHard = Number(hard) || 0;
        const total = nEasy + nMedium + nHard;

        user.codingStats = {
            easy: nEasy,
            medium: nMedium,
            hard: nHard,
            lastUpdated: new Date()
        };

        // Add to history
        user.codingHistory.push({
            date: new Date(),
            easy: nEasy,
            medium: nMedium,
            hard: nHard,
            total
        });

        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ─── FORGOT PASSWORD ─── */
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required." });

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+resetToken +resetTokenExpiry");
        // Always respond with success to prevent email enumeration
        if (!user) return res.json({ success: true, message: "If this email is registered, a reset link has been sent." });

        // Generate a secure random token
        const rawToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Return reset link directly (dev/demo mode — no email needed)
        const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;

        res.json({ success: true, message: "Reset link generated!", resetUrl });
    } catch (err) {
        console.error("Forgot password error:", err.message);
        res.status(500).json({ success: false, message: "Failed to send reset email. Please try again." });
    }
});

/* ─── RESET PASSWORD ─── */
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ success: false, message: "Token and new password are required." });
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() },
        }).select("+password +resetToken +resetTokenExpiry");

        if (!user) return res.status(400).json({ success: false, message: "Reset link is invalid or has expired." });

        user.password = newPassword; // hashed by pre-save hook
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully! You can now log in." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
