const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ─── Helper: safe JSON parse with fence stripping ─── */
function safeJSON(raw) {
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}") + 1;
  try { return JSON.parse(s >= 0 ? raw.slice(s, e) : raw); }
  catch { throw new Error("Invalid AI JSON: " + raw.slice(0, 200)); }
}

/* ═══════════════════════════════════════════════════════
   1. DOMAIN ROADMAP  (existing — TechExplorer)
═══════════════════════════════════════════════════════ */
async function generateDomainInsights(domainName, options) {
  const { level, goal, time } = options;
  const prompt = `You are a senior tech mentor. Generate a structured career roadmap in JSON ONLY.
Domain: ${domainName} | Level: ${level} | Goal: ${goal} | Study Time: ${time}
Return ONLY valid JSON:
{
  "title": "",
  "overview": "",
  "phases": [{"name":"","duration":"","topics":[],"projects":[]}],
  "techStack": {"languages":[],"frameworks":[],"tools":[]},
  "interviewPrep": [],
  "futureScope": ""
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   2. RESUME ANALYSIS  (existing — ResumeUpload)
═══════════════════════════════════════════════════════ */
async function analyzeResumeWithAI(resumeText, targetRole) {
  const prompt = `You are a senior tech recruiter. Analyze this resume vs the target role. Return ONLY valid JSON.
TARGET ROLE: ${targetRole}
RESUME: ${resumeText.slice(0, 3000)}
Return:
{
  "readinessScore": <0-100>,
  "matchedSkills": [], "missingSkills": [], "allExtractedSkills": [],
  "strengths": [], "skillGaps": [], "actionPlan": [],
  "feedback": "2-3 sentence personalized feedback",
  "hirability": "Strong Candidate|Needs Improvement|Not Ready",
  "topSkillToLearn": ""
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.3,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   3. JD MATCH  (new — Resume Intelligence Lab)
═══════════════════════════════════════════════════════ */
async function analyzeResumeVsJD(resumeText, jdText) {
  const prompt = `You are a world-class ATS system and recruiter. Deeply compare this resume against this job description.
RESUME: ${resumeText.slice(0, 2500)}
JOB DESCRIPTION: ${jdText.slice(0, 2000)}
Return ONLY valid JSON:
{
  "jdMatchScore": <0-100 integer>,
  "atsScore": <0-100 integer>,
  "jdMatchedKeywords": ["kw1","kw2"],
  "jdMissingKeywords": ["kw1","kw2"],
  "technicalFit": <0-100>,
  "experienceFit": <0-100>,
  "keywordDensity": <0-100>,
  "atsIssues": ["issue1","issue2"],
  "topRecommendations": ["rec1","rec2","rec3"],
  "verdict": "Highly Recommended|Good Match|Partial Match|Not a Match",
  "summaryFeedback": "3-4 sentence specific feedback comparing resume to JD"
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.3,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   4. GHOST SKILLS  (new — Resume Intelligence Lab)
═══════════════════════════════════════════════════════ */
async function detectGhostSkills(resumeText) {
  const prompt = `You are a resume expert. Find skills that are CLEARLY demonstrated in the experience/projects sections but NOT explicitly listed in a skills section.
RESUME: ${resumeText.slice(0, 3000)}
Return ONLY valid JSON:
{
  "ghostSkills": [
    {"skill":"","evidence":"one sentence explaining where this skill is implied","confidence":"High|Medium"}
  ],
  "totalFound": <integer>
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.4,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   5. BULLET REWRITER  (new — Resume Intelligence Lab)
═══════════════════════════════════════════════════════ */
async function rewriteBullets(bullets, targetRole) {
  const prompt = `You are a professional resume writer. Rewrite these resume bullet points to be powerful, metric-driven, and action-verb-led for the role: ${targetRole}.
BULLETS: ${JSON.stringify(bullets)}
Return ONLY valid JSON:
{
  "rewrites": [
    {"original":"","rewritten":"","improvement":"what changed and why"}
  ]
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.5,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   6. INTERVIEW QUESTIONS  (new — Analysis Command Center)
═══════════════════════════════════════════════════════ */
async function generateInterviewQuestions(missingSkills, targetRole) {
  const prompt = `You are a FAANG interviewer. Generate 6 targeted interview questions based on these skill gaps for role: ${targetRole}.
SKILL GAPS: ${missingSkills.join(", ")}
Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "",
      "skill": "which gap skill this tests",
      "difficulty": "Easy|Medium|Hard",
      "type": "Technical|Behavioral|System Design",
      "answerFramework": "STAR method hint or key points to cover",
      "redFlags": "what a bad answer looks like"
    }
  ]
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.5,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   7. 90-DAY SPRINT PLAN  (new — Analysis Command Center)
═══════════════════════════════════════════════════════ */
async function generateSprintPlan(missingSkills, targetRole) {
  const prompt = `You are a career coach. Create a 90-day personalized learning sprint plan to close skill gaps for role: ${targetRole}.
MISSING SKILLS: ${missingSkills.slice(0, 8).join(", ")}
Return ONLY valid JSON. IMPORTANT: the "resource" field MUST be a real URL starting with https:// (e.g. https://freecodecamp.org, https://roadmap.sh, https://docs.python.org). Include the full URL, not just the site name.
{
  "totalDays": 90,
  "dailyHours": <1-3 number>,
  "weeks": [
    {
      "week": <1-13>,
      "theme": "Focus area",
      "skills": ["skill1"],
      "dailyTasks": ["task1","task2","task3"],
      "milestone": "What you can do/build by end of this week",
      "resource": "https://actual-url.com"
    }
  ]
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.4,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   8. CAREER INTEL  (new — Analysis Command Center)
═══════════════════════════════════════════════════════ */
async function generateCareerIntel(matchedSkills, missingSkills, targetRole) {
  const prompt = `You are a tech recruitment analyst. Provide career market intelligence for this profile.
ROLE: ${targetRole}
MATCHED SKILLS: ${matchedSkills.slice(0, 10).join(", ")}
MISSING SKILLS: ${missingSkills.slice(0, 8).join(", ")}
Return ONLY valid JSON:
{
  "salaryRange": {"min": <INR LPA number>, "max": <INR LPA number>, "currency": "INR LPA"},
  "timeToHire": {"weeks": <estimated weeks to land job>, "message": "brief explanation"},
  "marketDemand": "Very High|High|Medium|Low",
  "topCompaniesHiring": ["company1","company2","company3","company4"],
  "skillPriorityMatrix": [
    {"skill":"","importance":"High|Medium|Low","difficulty":"Hard|Medium|Easy","action":"Quick Win|Study Now|Long Term"}
  ],
  "competitorInsight": "One insight about the competitive landscape for this role",
  "negotiationPower": <0-100 score>
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.3,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   9. PATH BATTLE  (new — TechExplorer)
═══════════════════════════════════════════════════════ */
async function compareCareerPaths(path1, path2) {
  const prompt = `You are a tech career strategist. Compare these two career paths head-to-head in detail.
PATH 1: ${path1}
PATH 2: ${path2}
Return ONLY valid JSON:
{
  "path1": {
    "name": "", "salaryMin": <INR LPA>, "salaryMax": <INR LPA>,
    "demandScore": <0-100>, "difficultyScore": <0-100>,
    "timeToLand": "<months>", "topSkills": ["s1","s2","s3","s4","s5"],
    "topCompanies": ["c1","c2","c3"],
    "pros": ["p1","p2","p3"], "cons": ["c1","c2"]
  },
  "path2": {
    "name": "", "salaryMin": <INR LPA>, "salaryMax": <INR LPA>,
    "demandScore": <0-100>, "difficultyScore": <0-100>,
    "timeToLand": "<months>", "topSkills": ["s1","s2","s3","s4","s5"],
    "topCompanies": ["c1","c2","c3"],
    "pros": ["p1","p2","p3"], "cons": ["c1","c2"]
  },
  "skillOverlap": ["shared_skill1","shared_skill2"],
  "verdict": {"winner": "path1 or path2 name", "reason": "2-3 sentence verdict", "bestFor": "Who should choose this path"}
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.3,
  });
  return safeJSON(r.choices[0].message.content);
}

/* ═══════════════════════════════════════════════════════
   10. WHAT-IF SIMULATOR  (new — TechExplorer)
═══════════════════════════════════════════════════════ */
async function whatIfSimulator(currentSkills, newSkill) {
  const prompt = `You are a tech career oracle. A developer currently knows: ${currentSkills.join(", ")}.
They are considering learning: ${newSkill}.
Predict what changes for their career. Return ONLY valid JSON:
{
  "newSkill": "${newSkill}",
  "unlockedRoles": [
    {"role": "", "matchPercent": <0-100>, "salaryRange": "X-Y LPA", "demandLevel": "High|Medium|Low"}
  ],
  "salaryImpact": {"currentEstimate": "X-Y LPA", "newEstimate": "X-Y LPA", "delta": "+X LPA"},
  "demandBoost": <percentage increase 0-100>,
  "timeToLearn": "<estimated time e.g. 6-8 weeks>",
  "synergies": ["how this skill pairs with existing skill1","existing skill2"],
  "verdict": "2-3 sentence verdict on whether this is a great investment"
}`;
  const r = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }],
    temperature: 0.4,
  });
  return safeJSON(r.choices[0].message.content);
}

module.exports = {
  generateDomainInsights,
  analyzeResumeWithAI,
  analyzeResumeVsJD,
  detectGhostSkills,
  rewriteBullets,
  generateInterviewQuestions,
  generateSprintPlan,
  generateCareerIntel,
  compareCareerPaths,
  whatIfSimulator,
};
