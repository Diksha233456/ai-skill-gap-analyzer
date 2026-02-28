const User = require("../models/User");
const extractSkills = require("../services/skillExtractor");
const roleSkills = require("../services/roleSkills");
const generateFeedback = require("../services/feedbackEngine");
const pdfParse = require("pdf-parse");

exports.createUser = async (req, res) => {
  try {
    const { name, email, targetRole } = req.body;

    // If user already exists, return them (allow re-use)
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing,
        message: "User already exists — continuing with existing profile"
      });
    }

    const user = await User.create({ name, email, targetRole });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── Upload resume as text (legacy) ─── */
exports.uploadResume = async (req, res) => {
  try {
    const { email, resumeText } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const skills = extractSkills(resumeText);
    const requiredSkills = roleSkills[user.targetRole] || [];
    const matchedSkills = skills.filter(s => requiredSkills.includes(s));
    const missingSkills = requiredSkills.filter(s => !skills.includes(s));
    const readiness = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0;

    user.skills = skills;
    user.readinessScore = readiness;
    await user.save();

    const feedback = generateFeedback({ readinessScore: readiness, missingSkills, targetRole: user.targetRole });

    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      extractedSkills: skills,
      matchedSkills,
      missingSkills,
      readinessScore: readiness,
      totalRequired: requiredSkills.length,
      feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── Upload PDF — AI-powered via Groq ─── */
exports.uploadPDF = async (req, res) => {
  try {
    const { email, name, targetRole } = req.body || {};

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded." });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Upsert — ALWAYS update targetRole to the one they just selected (fixes the SDE bug)
    let user = await User.findOne({ email });
    if (!user) {
      if (!name || !targetRole) {
        return res.status(400).json({ success: false, message: "Name and target role required for new users." });
      }
      user = await User.create({ name, email, targetRole });
    } else {
      if (targetRole) user.targetRole = targetRole; // KEY FIX
      if (name) user.name = name;
    }

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from this PDF. It may be image-based (scanned)."
      });
    }

    // 🔥 AI-powered dynamic analysis via Groq
    const { analyzeResumeWithAI } = require("../services/llmService");
    const ai = await analyzeResumeWithAI(resumeText, user.targetRole);

    // Save to user
    user.skills = ai.allExtractedSkills || ai.matchedSkills || [];
    user.readinessScore = ai.readinessScore || 0;
    await user.save();

    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      readinessScore: ai.readinessScore,
      matchedSkills: ai.matchedSkills || [],
      missingSkills: ai.missingSkills || [],
      extractedSkills: ai.allExtractedSkills || [],
      strengths: ai.strengths || [],
      skillGaps: ai.skillGaps || [],
      actionPlan: ai.actionPlan || [],
      feedback: ai.feedback || "",
      hirability: ai.hirability || "Needs Improvement",
      topSkillToLearn: ai.topSkillToLearn || "",
      totalRequired: (ai.matchedSkills || []).length + (ai.missingSkills || []).length,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
