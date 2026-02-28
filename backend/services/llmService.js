const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateDomainInsights(domainName, options) {
  const { level, goal, time } = options;

  const prompt = `
You are a senior tech mentor.

Generate a structured career roadmap in JSON format ONLY.

Domain: ${domainName}
Level: ${level}
Goal: ${goal}
Study Time: ${time}

Return ONLY valid JSON in this exact format:

{
  "title": "",
  "overview": "",
  "phases": [
    {
      "name": "",
      "duration": "",
      "topics": [],
      "projects": []
    }
  ],
  "techStack": {
    "languages": [],
    "frameworks": [],
    "tools": []
  },
  "interviewPrep": [],
  "futureScope": ""
}

DO NOT include markdown.
DO NOT include explanation.
ONLY return JSON.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Return only valid JSON." },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("JSON parse failed:", raw);
    throw new Error("Invalid AI JSON response");
  }
}

module.exports = { generateDomainInsights, analyzeResumeWithAI };

/* ─── AI-powered Resume Analysis ─── */
async function analyzeResumeWithAI(resumeText, targetRole) {
  const prompt = `
You are a senior tech recruiter and career coach.

Analyze this resume text against the target role and return ONLY valid JSON (no markdown, no explanation).

TARGET ROLE: ${targetRole}

RESUME TEXT:
${resumeText.slice(0, 3000)}

Return ONLY this JSON:
{
  "readinessScore": <0-100 integer>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "allExtractedSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "skillGaps": ["gap1", "gap2", "gap3"],
  "actionPlan": ["step1", "step2", "step3", "step4"],
  "feedback": "2-3 sentence personalized feedback for this specific role",
  "hirability": "Strong Candidate",
  "topSkillToLearn": "Most impactful skill to learn next"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a technical career coach. Return only valid JSON." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const raw = response.choices[0].message.content.trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const jsonStr = start >= 0 ? raw.slice(start, end) : raw;

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Resume AI parse failed:", raw);
    throw new Error("Invalid AI JSON response for resume");
  }
}
