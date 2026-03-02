const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
            return res.status(200).json({ success: true, token, user: { id: existing._id, name: existing.name, email: existing.email, settings: existing.settings } });
        }

        if (existing)
            return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });

        const user = await User.create({ name, email, password, targetRole: "" });
        const token = sign(user);
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, settings: user.settings } });
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
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, settings: user.settings } });
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
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, targetRole: user.targetRole, skills: user.skills, readinessScore: user.readinessScore, settings: user.settings } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
