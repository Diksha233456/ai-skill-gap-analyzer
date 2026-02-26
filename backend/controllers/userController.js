const User = require("../models/User");
const extractSkills = require("../services/skillExtractor");
const roleSkills = require("../services/roleSkills");

exports.createUser = async (req, res) => {
  try {
    const { name, email, targetRole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = await User.create({
      name,
      email,
      targetRole
    });

    res.status(201).json({
      success: true,
      data: newUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const { email, resumeText } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const skills = extractSkills(resumeText);
    user.skills = skills;

    const requiredSkills = roleSkills[user.targetRole] || [];

    const matchedSkills = skills.filter(skill =>
      requiredSkills.includes(skill)
    );

    const readiness = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    user.readinessScore = readiness;

    await user.save();

    res.status(200).json({
      success: true,
      extractedSkills: skills,
      readinessScore: readiness,
      missingSkills: requiredSkills.filter(
        skill => !skills.includes(skill)
      )
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};