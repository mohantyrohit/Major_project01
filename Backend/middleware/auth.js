
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: Token not provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Attach both user object and flat fields
        req.user = decoded;
        req.userId = decoded.id; // <-- Needed by /getUserName
        req.signupType = decoded.signupType;

        console.log("Decoded Token:", {
            id: decoded.id,
            signupType: decoded.signupType,
            iat: new Date(decoded.iat * 1000),
            exp: new Date(decoded.exp * 1000),
        });

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Session expired. Please refresh your token.",
                code: "ACCESS_TOKEN_EXPIRED",
                canRefresh: true
            });
        }
        console.error("Error verifying token:", error.message);
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
    }
 };
