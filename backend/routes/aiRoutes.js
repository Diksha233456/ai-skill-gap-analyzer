const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const {
  generateDomainInsights,
  analyzeResumeVsJD,
  detectGhostSkills,
  rewriteBullets,
  generateInterviewQuestions,
  generateSprintPlan,
  generateCareerIntel,
  compareCareerPaths,
  whatIfSimulator,
} = require("../services/llmService");

const upload = multer({ storage: multer.memoryStorage() });

/* ─── Existing: Domain Roadmap ─── */
router.post("/roadmap", async (req, res) => {
  try {
    const { domain, level, goal, time } = req.body;
    if (!domain) return res.status(400).json({ success: false, message: "Domain required" });
    const insights = await generateDomainInsights(domain, { level, goal, time });
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: JD Match (resume PDF + job description text) ─── */
router.post("/jd-match", upload.single("resume"), async (req, res) => {
  try {
    const { jdText, targetRole } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Resume PDF required" });
    if (!jdText) return res.status(400).json({ success: false, message: "Job description required" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    if (resumeText.trim().length < 20)
      return res.status(400).json({ success: false, message: "Could not extract text from this PDF." });

    const result = await analyzeResumeVsJD(resumeText, jdText);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: Ghost Skills ─── */
router.post("/ghost-skills", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Resume PDF required" });
    const pdfData = await pdfParse(req.file.buffer);
    const result = await detectGhostSkills(pdfData.text);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: Bullet Rewriter ─── */
router.post("/rewrite-bullets", async (req, res) => {
  try {
    const { bullets, targetRole } = req.body;
    if (!bullets || !bullets.length) return res.status(400).json({ success: false, message: "Bullets required" });
    const result = await rewriteBullets(bullets, targetRole || "Software Engineer");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: Interview Questions ─── */
router.post("/interview-questions", async (req, res) => {
  try {
    const { missingSkills, targetRole } = req.body;
    if (!missingSkills || !missingSkills.length)
      return res.status(400).json({ success: false, message: "Missing skills required" });
    const result = await generateInterviewQuestions(missingSkills, targetRole || "Software Engineer");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: 90-Day Sprint Plan ─── */
router.post("/sprint-plan", async (req, res) => {
  try {
    const { missingSkills, targetRole } = req.body;
    if (!missingSkills || !missingSkills.length)
      return res.status(400).json({ success: false, message: "Missing skills required" });
    const result = await generateSprintPlan(missingSkills, targetRole || "Software Engineer");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: Career Intel ─── */
router.post("/career-intel", async (req, res) => {
  try {
    const { matchedSkills, missingSkills, targetRole } = req.body;
    const result = await generateCareerIntel(matchedSkills || [], missingSkills || [], targetRole || "SDE");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: Path Battle ─── */
router.post("/compare-paths", async (req, res) => {
  try {
    const { path1, path2 } = req.body;
    if (!path1 || !path2) return res.status(400).json({ success: false, message: "Both paths required" });
    const result = await compareCareerPaths(path1, path2);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── NEW: What-If Simulator ─── */
router.post("/what-if", async (req, res) => {
  try {
    const { currentSkills, newSkill } = req.body;
    if (!newSkill) return res.status(400).json({ success: false, message: "New skill required" });
    const result = await whatIfSimulator(currentSkills || [], newSkill);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;