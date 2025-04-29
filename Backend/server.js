
// require("dotenv").config();
// require("./jobs/autoDeleteEvents"); // Ensure this path is correct
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const path = require("path");
// const connectDB = require("./config/db");

// // Route imports
// const reviewRoutes = require("./routes/reviews");
// const eventsRoutes = require("./routes/events");
// const participationRoutes = require("./routes/participation");
// const notificationRoutes = require("./routes/notifications");
// const messageRoutes = require("./routes/messageRoutes");
// const studentRoutes = require("./routes/student");
// const instituteRoutes = require("./routes/institute");
// const instituteInfoRoutes = require("./routes/instituteInfo");
// const authRoutes = require("./routes/auth");
// const authTokenRoutes = require("./routes/authTokenRoutes");
// const requestFormRoutes = require("./routes/requestFormRoutes");
// const collegeInfoRoutes = require("./routes/collegeInfoRoutes");


// const app = express();

// // Security Headers
// app.use(
//     helmet({
//         crossOriginResourcePolicy: { policy: "cross-origin" },
//     })
// );

// // Logging
// app.use(morgan("dev"));

// // CORS setup
// const corsOptions = {
//     origin: "http://localhost:3000",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204
// };
// app.use(cors(corsOptions));

// // JSON parser
// app.use(express.json());

// // Static uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Database connection
// connectDB()
//     .then(() => console.log("✅ Database Connected"))
//     .catch((err) => {
//         console.error("❌ Database Connection Failed:", err);
//         process.exit(1);
//     });

// // Sessions
// const mongoOptions = {
//     mongoUrl: process.env.MONGO_URI,
//     collectionName: "sessions",
// };
// app.use(
//     session({
//         secret: process.env.JWT_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         store: MongoStore.create(mongoOptions),
//         cookie: {
//             secure: false, // Set to true in production with HTTPS
//             maxAge: 24 * 60 * 60 * 1000,
//         },
//     })
// );

// // Logout route
// app.post("/api/logout", (req, res) => {
//     req.session.destroy(err => {
//         if (err) return res.status(500).json({ message: "Logout failed" });
//         res.clearCookie("connect.sid");
//         return res.status(200).json({ message: "Logged out successfully" });
//     });
// });

// // API Routes
// app.use("/api/student", studentRoutes);
// app.use("/api/institute", instituteRoutes);
// app.use("/api/instituteInfo", instituteInfoRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/events", eventsRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/auth", authTokenRoutes);
// app.use("/api/events/participate", participationRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/requests", requestFormRoutes);
// app.use("/api/collegeInfo", collegeInfoRoutes);



// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();
require("./jobs/autoDeleteEvents"); // Ensure this path is correct
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

// Route imports
const reviewRoutes = require("./routes/reviews");
const eventsRoutes = require("./routes/events");
const participationRoutes = require("./routes/participation");
const notificationRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/messageRoutes");
const studentRoutes = require("./routes/student");
const instituteRoutes = require("./routes/institute");
const instituteInfoRoutes = require("./routes/instituteInfo");
const authRoutes = require("./routes/auth");
const authTokenRoutes = require("./routes/authTokenRoutes");
const requestFormRoutes = require("./routes/requestFormRoutes");
const collegeInfoRoutes = require('./routes/collegeInfoRoutes');


const app = express();

// Security Headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// Logging
app.use(morgan("dev"));

// CORS setup
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// JSON parser
app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
connectDB()
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => {
        console.error("❌ Database Connection Failed:", err);
        process.exit(1);
    });

// Sessions
const mongoOptions = {
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
};
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create(mongoOptions),
        cookie: {
            secure: false, // Set to true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// Logout route
app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
    });
});

// API Routes
app.use("/api/student", studentRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/instituteInfo", instituteInfoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", authTokenRoutes);
app.use("/api/events/participate", participationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/requests", requestFormRoutes);
app.use('/api/collegeInfo', collegeInfoRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));