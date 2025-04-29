const cron = require("node-cron");
const Event = require("../models/Event");
const moment = require("moment-timezone");

const timeZone = "Asia/Kolkata"; // Set your desired timezone

// Run every day at midnight IST
cron.schedule("0 0  * * *", async () => {
    try {
        const nowIST = moment().tz(timeZone).toDate();
        const result = await Event.deleteMany({ eventDate: { $lt: nowIST } });
        console.log(`✅ Auto-delete job: ${result.deletedCount} expired events removed at ${moment().tz(timeZone).format()} (IST)`);
    } catch (error) {
        console.error("❌ Error in auto-delete job:", error.message);
    }
}, {
    scheduled: true,
    timezone: timeZone // Ensure the timezone is correctly applied to the schedule
});

console.log(`⏰ Auto-delete job scheduled to run daily at midnight ${timeZone}.`);