const User = require("../models/User");

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