const mongoose = require('mongoose');
require('./config/db.js');
const Institute = require('./models/instituteUser.js');

async function checkInstituteUser() {
  try {
    const institute = await Institute.findOne();
    console.log('Found institute user:', institute);
    if (institute) {
      console.log('signupType value:', institute.signupType);
    }
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
}

checkInstituteUser();
