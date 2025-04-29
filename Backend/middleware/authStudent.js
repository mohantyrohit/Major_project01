const jwt = require("jsonwebtoken");
const Student = require("../models/studentUser");

const verifyStudent = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student) return res.status(401).json({ message: "Unauthorized: student not found." });

    req.user = student; // ✅ store student info in req
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = verifyStudent;
