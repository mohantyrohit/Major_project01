// import React, { useState } from 'react';
// import axios from '../axios'; // ✅ Assuming you have configured axios instance here
// import './CollegeDetailsForm.css'; // ✅ Make sure .input and .textarea classes are defined

// const CollegeDetailsForm = () => {
//   const [formData, setFormData] = useState({
//     collegeName: '',
//     motto: '',
//     yearOfEstablishment: '',
//     type: '',
//     accreditation: '',
//     approval: '',
//     address: '',
//     state: '',
//     district: '',
//     city: '',
//     pincode: '',
//     phoneNumber: '',
//     email: '',
//     website: '',
//     vision: '',
//     mission: '',
//     principalMessage: '',
//     undergraduatePrograms: '',
//     postgraduatePrograms: '',
//     diplomaCourses: '',
//     departments: '',
//     facilities: [],
//     rankings: '',
//     awards: '',
//     notableAlumni: '',
//     admissionProcess: '',
//     entranceExams: '',
//     eligibilityCriteria: '',
//     importantDates: '',
//     scholarships: '',
//     placementStats: '',
//     topRecruiters: '',
//     studentClubs: '',
//   });

//   const handleChange = (e) => {
//     const { name, value,  checked } = e.target;

//     if (name === 'facilities') {
//       const updatedFacilities = checked
//         ? [...formData.facilities, value]
//         : formData.facilities.filter((facility) => facility !== value);
//       setFormData({ ...formData, facilities: updatedFacilities });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('/collegeInfo', formData); // ✅ Fixed here
//       alert('College details submitted successfully!');
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error submitting college details:', error.response ? error.response.data : error.message);
//       alert('Error submitting form. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
//       <h2 className="text-2xl font-bold mb-6 text-center">College Details Form</h2>

//       <form onSubmit={handleSubmit} className="grid gap-6">

//         {/* Basic Information */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Basic Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input type="text" name="collegeName" placeholder="College Name" value={formData.collegeName} onChange={handleChange} required className="input" />
//             <input type="text" name="motto" placeholder="Motto/Tagline" value={formData.motto} onChange={handleChange} className="input" />
//             <input type="number" name="yearOfEstablishment" placeholder="Year of Establishment" value={formData.yearOfEstablishment} onChange={handleChange} className="input" />
//             <input type="text" name="type" placeholder="Type (Public/Private/Autonomous)" value={formData.type} onChange={handleChange} className="input" />
//             <input type="text" name="accreditation" placeholder="Accreditation (e.g. NAAC A+)" value={formData.accreditation} onChange={handleChange} className="input" />
//             <input type="text" name="approval" placeholder="Approval (e.g. AICTE, UGC)" value={formData.approval} onChange={handleChange} className="input" />
//           </div>
//         </div>

//         {/* Location & Contact */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Location & Contact</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input type="text" name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} required className="input" />
//             <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="input" />
//             <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="input" />
//             <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="input" />
//             <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="input" />
//             <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="input" />
//             <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="input" />
//             <input type="text" name="website" placeholder="Website Link" value={formData.website} onChange={handleChange} className="input" />
//           </div>
//         </div>

//         {/* About */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">About</h3>
//           <textarea name="vision" placeholder="Vision" value={formData.vision} onChange={handleChange} className="textarea" />
//           <textarea name="mission" placeholder="Mission" value={formData.mission} onChange={handleChange} className="textarea" />
//           <textarea name="principalMessage" placeholder="Principal/Director Message" value={formData.principalMessage} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Courses & Departments */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Courses & Departments</h3>
//           <textarea name="undergraduatePrograms" placeholder="Undergraduate Programs (comma separated)" value={formData.undergraduatePrograms} onChange={handleChange} className="textarea" />
//           <textarea name="postgraduatePrograms" placeholder="Postgraduate Programs (comma separated)" value={formData.postgraduatePrograms} onChange={handleChange} className="textarea" />
//           <textarea name="diplomaCourses" placeholder="Diploma/Certificate Courses (comma separated)" value={formData.diplomaCourses} onChange={handleChange} className="textarea" />
//           <textarea name="departments" placeholder="Departments (comma separated)" value={formData.departments} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Facilities */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Facilities</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {['Library', 'Hostel', 'WiFi', 'Labs', 'Sports', 'Cafeteria', 'Medical', 'Transport', 'Auditorium'].map(facility => (
//               <label key={facility} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="facilities"
//                   value={facility}
//                   checked={formData.facilities.includes(facility)}
//                   onChange={handleChange}
//                 />
//                 <span className="ml-2">{facility}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Achievements */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Achievements</h3>
//           <textarea name="rankings" placeholder="Rankings" value={formData.rankings} onChange={handleChange} className="textarea" />
//           <textarea name="awards" placeholder="Awards" value={formData.awards} onChange={handleChange} className="textarea" />
//           <textarea name="notableAlumni" placeholder="Notable Alumni" value={formData.notableAlumni} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Admission */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Admission Details</h3>
//           <textarea name="admissionProcess" placeholder="Admission Process" value={formData.admissionProcess} onChange={handleChange} className="textarea" />
//           <textarea name="entranceExams" placeholder="Entrance Exams Accepted" value={formData.entranceExams} onChange={handleChange} className="textarea" />
//           <textarea name="eligibilityCriteria" placeholder="Eligibility Criteria" value={formData.eligibilityCriteria} onChange={handleChange} className="textarea" />
//           <textarea name="importantDates" placeholder="Important Dates" value={formData.importantDates} onChange={handleChange} className="textarea" />
//           <textarea name="scholarships" placeholder="Scholarships Available" value={formData.scholarships} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Placement */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Placement Information</h3>
//           <textarea name="placementStats" placeholder="Placement Statistics" value={formData.placementStats} onChange={handleChange} className="textarea" />
//           <textarea name="topRecruiters" placeholder="Top Recruiters (comma separated)" value={formData.topRecruiters} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Clubs */}
//         <div>
//           <h3 className="text-xl font-semibold mb-3">Student Clubs & Activities</h3>
//           <textarea name="studentClubs" placeholder="List of Student Clubs (comma separated)" value={formData.studentClubs} onChange={handleChange} className="textarea" />
//         </div>

//         {/* Submit */}
//         <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
//           Submit College Details
//         </button>

//       </form>
//     </div>
//   );
// };

// export default CollegeDetailsForm;
import React, { useState, useContext} from 'react';
import axios from '../axios'; // ✅ Assuming you have configured axios instance here
import './CollegeDetailsForm.css'; // ✅ Make sure .input and .textarea classes are defined
import { UserContext } from '../context/AuthContext';  // Change this line


const CollegeDetailsForm = () => {
  // Getting the instituteId directly from context (or token)
  const { instituteId } = useContext(UserContext);  // AuthContext holds the logged-in user's data

  const [formData, setFormData] = useState({
    collegeName: '',
    motto: '',
    yearOfEstablishment: '',
    type: '',
    accreditation: '',
    approval: '',
    address: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    website: '',
    vision: '',
    mission: '',
    principalMessage: '',
    undergraduatePrograms: '',
    postgraduatePrograms: '',
    diplomaCourses: '',
    departments: '',
    facilities: [],
    rankings: '',
    awards: '',
    notableAlumni: '',
    admissionProcess: '',
    entranceExams: '',
    eligibilityCriteria: '',
    importantDates: '',
    scholarships: '',
    placementStats: '',
    topRecruiters: '',
    studentClubs: '',
    instituteId: instituteId || '', // Automatically adding instituteId from context
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'facilities') {
      const updatedFacilities = checked
        ? [...formData.facilities, value]
        : formData.facilities.filter((facility) => facility !== value);
      setFormData({ ...formData, facilities: updatedFacilities });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/collegeInfo', formData); // Send formData including instituteId
      alert('College details submitted successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting college details:', error.response ? error.response.data : error.message);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">College Details Form</h2>

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Basic Information */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="collegeName" placeholder="College Name" value={formData.collegeName} onChange={handleChange} required className="input" />
            <input type="text" name="motto" placeholder="Motto/Tagline" value={formData.motto} onChange={handleChange} className="input" />
            <input type="number" name="yearOfEstablishment" placeholder="Year of Establishment" value={formData.yearOfEstablishment} onChange={handleChange} className="input" />
            <input type="text" name="type" placeholder="Type (Public/Private/Autonomous)" value={formData.type} onChange={handleChange} className="input" />
            <input type="text" name="accreditation" placeholder="Accreditation (e.g. NAAC A+)" value={formData.accreditation} onChange={handleChange} className="input" />
            <input type="text" name="approval" placeholder="Approval (e.g. AICTE, UGC)" value={formData.approval} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* Location & Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Location & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} required className="input" />
            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="input" />
            <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="input" />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="input" />
            <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="input" />
            <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="input" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="input" />
            <input type="text" name="website" placeholder="Website Link" value={formData.website} onChange={handleChange} className="input" />
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-3">About</h3>
          <textarea name="vision" placeholder="Vision" value={formData.vision} onChange={handleChange} className="textarea" />
          <textarea name="mission" placeholder="Mission" value={formData.mission} onChange={handleChange} className="textarea" />
          <textarea name="principalMessage" placeholder="Principal/Director Message" value={formData.principalMessage} onChange={handleChange} className="textarea" />
        </div>

        {/* Courses & Departments */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Courses & Departments</h3>
          <textarea name="undergraduatePrograms" placeholder="Undergraduate Programs (comma separated)" value={formData.undergraduatePrograms} onChange={handleChange} className="textarea" />
          <textarea name="postgraduatePrograms" placeholder="Postgraduate Programs (comma separated)" value={formData.postgraduatePrograms} onChange={handleChange} className="textarea" />
          <textarea name="diplomaCourses" placeholder="Diploma/Certificate Courses (comma separated)" value={formData.diplomaCourses} onChange={handleChange} className="textarea" />
          <textarea name="departments" placeholder="Departments (comma separated)" value={formData.departments} onChange={handleChange} className="textarea" />
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Library', 'Hostel', 'WiFi', 'Labs', 'Sports', 'Cafeteria', 'Medical', 'Transport', 'Auditorium'].map(facility => (
              <label key={facility} className="flex items-center">
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility}
                  checked={formData.facilities.includes(facility)}
                  onChange={handleChange}
                />
                <span className="ml-2">{facility}</span>
              </label>
            ))}
          </div>
        </div>
          {/* Achievements */}
       <div>
           <h3 className="text-xl font-semibold mb-3">Achievements</h3>
           <textarea name="rankings" placeholder="Rankings" value={formData.rankings} onChange={handleChange} className="textarea" />
          <textarea name="awards" placeholder="Awards" value={formData.awards} onChange={handleChange} className="textarea" />
           <textarea name="notableAlumni" placeholder="Notable Alumni" value={formData.notableAlumni} onChange={handleChange} className="textarea" />
         </div>

         {/* Admission */}
         <div>
          <h3 className="text-xl font-semibold mb-3">Admission Details</h3>
           <textarea name="admissionProcess" placeholder="Admission Process" value={formData.admissionProcess} onChange={handleChange} className="textarea" />
           <textarea name="entranceExams" placeholder="Entrance Exams Accepted" value={formData.entranceExams} onChange={handleChange} className="textarea" />
           <textarea name="eligibilityCriteria" placeholder="Eligibility Criteria" value={formData.eligibilityCriteria} onChange={handleChange} className="textarea" />
           <textarea name="importantDates" placeholder="Important Dates" value={formData.importantDates} onChange={handleChange} className="textarea" />
           <textarea name="scholarships" placeholder="Scholarships Available" value={formData.scholarships} onChange={handleChange} className="textarea" />
         </div>

         {/* Placement */}
         <div>
           <h3 className="text-xl font-semibold mb-3">Placement Information</h3>
           <textarea name="placementStats" placeholder="Placement Statistics" value={formData.placementStats} onChange={handleChange} className="textarea" />
           <textarea name="topRecruiters" placeholder="Top Recruiters (comma separated)" value={formData.topRecruiters} onChange={handleChange} className="textarea" />
         </div>

        {/* Clubs */}
         <div>
           <h3 className="text-xl font-semibold mb-3">Student Clubs & Activities</h3>
           <textarea name="studentClubs" placeholder="List of Student Clubs (comma separated)" value={formData.studentClubs} onChange={handleChange} className="textarea" />
         </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Submit College Details
        </button>

      </form>
    </div>
  );
};

export default CollegeDetailsForm;
