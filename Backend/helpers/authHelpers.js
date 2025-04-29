
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hash the password securely
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare the provided password with the hashed password
const comparePasswords = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// Generate JWT token with user details (✅ includes name)
const generateToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
        name: user.name,             // ✅ Add institute name in token payload
        signupType: user.signupType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw new Error("Failed to generate access token");
  }
};

// Generate JWT refresh token (Optional)
const generateRefreshToken = (user) => {
  try {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "30d" }
    );
  } catch (error) {
    console.error("Error generating refresh token:", error.message);
    throw new Error("Failed to generate refresh token");
  }
};

module.exports = {
  hashPassword,
  comparePasswords,
  generateToken,
  generateRefreshToken,
};
