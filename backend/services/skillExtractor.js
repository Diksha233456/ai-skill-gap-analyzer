const predefinedSkills = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL",
  // Web Frontend
  "React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "Sass", "Bootstrap", "Tailwind",
  // Web Backend
  "Node.js", "Express", "Django", "Flask", "Spring Boot", "FastAPI", "REST API", "GraphQL",
  // Databases
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "DynamoDB", "Elasticsearch",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Linux",
  // Data & AI
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn",
  "Data Analysis", "Power BI", "Tableau",
  // CS Fundamentals
  "DSA", "System Design", "OOP", "Microservices", "Git",
  // Mobile
  "React Native", "Flutter"
];

function extractSkills(text) {
  const foundSkills = [];
  const normalizedText = text.toLowerCase();

  predefinedSkills.forEach(skill => {
    const normalizedSkill = skill.toLowerCase();
    // Check for whole-word match using regex to avoid partial matches
    const regex = new RegExp(`\\b${normalizedSkill.replace(/[.+]/g, "\\$&")}\\b`);
    if (regex.test(normalizedText)) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)]; // deduplicate
}

module.exports = extractSkills;