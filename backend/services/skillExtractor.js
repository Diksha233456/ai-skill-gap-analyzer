const predefinedSkills = [
  "JavaScript",
  "Node.js",
  "React",
  "MongoDB",
  "Express",
  "Python",
  "DSA",
  "System Design",
  "SQL",
  "C++",
  "Java"
];

function extractSkills(text) {
  const foundSkills = [];

  predefinedSkills.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

module.exports = extractSkills;