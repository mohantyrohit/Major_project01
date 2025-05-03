import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CollegeDetailsPage = ({ instituteId }) => {
  const [college, setCollege] = useState(null);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const res = await axios.get(`/api/college-details/${instituteId}`);
        setCollege(res.data);
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };

    if (instituteId) {
      fetchCollegeDetails();
    }
  }, [instituteId]);

  if (!college) return <p>Loading college details...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{college.collegeName}</h1>
      <p className="italic text-gray-600">{college.motto}</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><strong>Established:</strong> {college.yearOfEstablishment}</div>
        <div><strong>Type:</strong> {college.type}</div>
        <div><strong>Accreditation:</strong> {college.accreditation}</div>
        <div><strong>Approval:</strong> {college.approval}</div>
        <div><strong>Address:</strong> {college.address}</div>
        <div><strong>City:</strong> {college.city}</div>
        <div><strong>District:</strong> {college.district}</div>
        <div><strong>State:</strong> {college.state}</div>
        <div><strong>Pincode:</strong> {college.pincode}</div>
        <div><strong>Phone:</strong> {college.phoneNumber}</div>
        <div><strong>Email:</strong> {college.email}</div>
        <div><strong>Website:</strong> <a href={college.website} className="text-blue-500" target="_blank" rel="noreferrer">{college.website}</a></div>
      </div>

      <hr className="my-6" />

      <section>
        <h2 className="text-xl font-semibold mb-2">Vision</h2>
        <p>{college.vision}</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Mission</h2>
        <p>{college.mission}</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Principal's Message</h2>
        <p>{college.principalMessage}</p>
      </section>

      <hr className="my-6" />

      <section>
        <h2 className="text-xl font-semibold mb-2">Programs Offered</h2>
        <ul className="list-disc ml-6">
          <li><strong>Undergraduate:</strong> {college.undergraduatePrograms}</li>
          <li><strong>Postgraduate:</strong> {college.postgraduatePrograms}</li>
          <li><strong>Diploma:</strong> {college.diplomaCourses}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Departments</h2>
        <p>{college.departments}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Facilities</h2>
        <ul className="list-disc ml-6">
          {college.facilities?.map((f, index) => <li key={index}>{f}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Rankings & Awards</h2>
        <p><strong>Rankings:</strong> {college.rankings}</p>
        <p><strong>Awards:</strong> {college.awards}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Alumni</h2>
        <p>{college.notableAlumni}</p>
      </section>

      <hr className="my-6" />

      <section>
        <h2 className="text-xl font-semibold mb-2">Admission Info</h2>
        <p><strong>Process:</strong> {college.admissionProcess}</p>
        <p><strong>Entrance Exams:</strong> {college.entranceExams}</p>
        <p><strong>Eligibility:</strong> {college.eligibilityCriteria}</p>
        <p><strong>Important Dates:</strong> {college.importantDates}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Scholarships</h2>
        <p>{college.scholarships}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Placements</h2>
        <p><strong>Stats:</strong> {college.placementStats}</p>
        <p><strong>Top Recruiters:</strong> {college.topRecruiters}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Student Clubs</h2>
        <p>{college.studentClubs}</p>
      </section>
    </div>
  );
};

export default CollegeDetails;
