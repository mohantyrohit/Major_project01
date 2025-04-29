const mongoose = require('mongoose');
const InstituteInfo = require('../models/InstituteInfo');
require('dotenv').config();

const sampleData = [
    {
        state: "California",
        district: "Los Angeles",
        instituteName: "Institute of Technology",
        nearestMallName: "Tech Mall",
        nearestMallEmbedUrl: "http://example.com/techmall",
        medicineStoreName: "Health Store",
        medicineStoreEmbedUrl: "http://example.com/healthstore",
        bookstoreName: "Book Haven",
        bookstoreEmbedUrl: "http://example.com/bookhaven",
        atmName: "Bank ATM",
        atmEmbedUrl: "http://example.com/bankatm"
    },
    {
        state: "New York",
        district: "Manhattan",
        instituteName: "New York Institute",
        nearestMallName: "City Mall",
        nearestMallEmbedUrl: "http://example.com/citymall",
        medicineStoreName: "City Pharmacy",
        medicineStoreEmbedUrl: "http://example.com/citypharmacy",
        bookstoreName: "City Books",
        bookstoreEmbedUrl: "http://example.com/citybooks",
        atmName: "City Bank ATM",
        atmEmbedUrl: "http://example.com/citybankatm"
    }
];

const insertSampleData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await InstituteInfo.deleteMany({}); // Clear existing data
        await InstituteInfo.insertMany(sampleData); // Insert sample data
        console.log("Sample data inserted successfully!");
    } catch (error) {
        console.error("Error inserting sample data:", error);
    } finally {
        mongoose.connection.close();
    }
};

insertSampleData();
