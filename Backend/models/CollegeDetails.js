// const mongoose = require('mongoose');

// const collegeDetailsSchema = new mongoose.Schema({
//   collegeName: { type: String, required: true },
//   motto: String,
//   yearOfEstablishment: Number,
//   type: String,
//   accreditation: String,
//   approval: String,
//   address: String,
//   state: String,
//   district: String,
//   city: String,
//   pincode: String,
//   phoneNumber: String,
//   email: String,
//   website: String,
//   vision: String,
//   mission: String,
//   principalMessage: String,
//   undergraduatePrograms: String,
//   postgraduatePrograms: String,
//   diplomaCourses: String,
//   departments: String,
//   facilities: [String],
//   rankings: String,
//   awards: String,
//   notableAlumni: String,
//   admissionProcess: String,
//   entranceExams: String,
//   eligibilityCriteria: String,
//   importantDates: String,
//   scholarships: String,
//   placementStats: String,
//   topRecruiters: String,
//   studentClubs: String,
// });

// const CollegeDetails = mongoose.model('CollegeDetails', collegeDetailsSchema);

// module.exports = CollegeDetails;
// models/CollegeDetails.js 
const mongoose = require('mongoose');

const collegeDetailsSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  motto: { type: String },
  yearOfEstablishment: { type: Number },
  type: { type: String },
  accreditation: { type: String },
  approval: { type: String },
  address: { type: String, required: true },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  pincode: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  website: { type: String },
  vision: { type: String },
  mission: { type: String },
  principalMessage: { type: String },
  undergraduatePrograms: { type: String },
  postgraduatePrograms: { type: String },
  diplomaCourses: { type: String },
  departments: { type: String },
  facilities: { type: [String] },  // List of facilities
  rankings: { type: String },
  awards: { type: String },
  notableAlumni: { type: String },
  admissionProcess: { type: String },
  entranceExams: { type: String },
  eligibilityCriteria: { type: String },
  importantDates: { type: String },
  scholarships: { type: String },
  placementStats: { type: String },
  topRecruiters: { type: String },
  studentClubs: { type: String },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true }, // Add instituteId here
});

const CollegeDetails = mongoose.model('CollegeDetails', collegeDetailsSchema);
module.exports = CollegeDetails;
