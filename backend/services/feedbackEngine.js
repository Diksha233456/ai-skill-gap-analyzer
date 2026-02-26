function generateFeedback(user) {
  const { readinessScore, missingSkills, targetRole } = user;

  if (readinessScore >= 80) {
    return `You are highly prepared for ${targetRole} roles. Focus on refining advanced concepts and mock interviews.`;
  }

  if (readinessScore >= 50) {
    return `You have a solid foundation for ${targetRole}, but you need improvement in: ${missingSkills.join(", ")}. Strengthening these will significantly boost your placement chances.`;
  }

  return `You need strong improvement for ${targetRole}. Start by mastering: ${missingSkills.join(", ")} and building real-world projects.`;
}

module.exports = generateFeedback;