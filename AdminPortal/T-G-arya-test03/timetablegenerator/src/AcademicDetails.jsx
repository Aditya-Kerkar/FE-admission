import React, { useState, forwardRef, useImperativeHandle } from 'react';

const AcademicDetails = forwardRef(({ formData, setFormData, setError }, ref) => {
  // const [formData, setFormData] = useState({
  //   hscmathsMarks: '',
  //   hscphysicsMarks: '',
  //   hscchemistryMarks: '',
  //   hscpcmPercentage: '',
  //   hscvocationalSub: '',
  //   hscvocationalsubjectMarks: '',
  //   hscvovationalsubjectPer: '',
  //   sscBoard: '',
  //   sscyearofPass: '',
  //   ssctotalMarks: '',
  //   sscmarksObtained: '',
  //   sscPercentage: '',
  //   hscBoard: '',
  //   hscyearofPass: '',
  //   hsctotalMarks: '',
  //   hscmarksObtained: '',
  //   hscPercentage: '',
  // });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, academicDetails: { ...prevFormData.academicDetails, [id]: value } }));
  };

  const validate = () => {
    const { hscmathsMarks,
        hscphysicsMarks,
        hscchemistryMarks,
        hscpcmPercentage,
        hscvocationalSub,
        hscvocationalsubjectMarks,
        hscvovationalsubjectPer,
        sscBoard,
        sscyearofPass,
        ssctotalMarks,
        sscmarksObtained,
        sscPercentage,
        hscBoard,
        hscyearofPass,
        hsctotalMarks,
        hscmarksObtained,
        hscPercentage } = formData.academicDetails;
    if (!hscmathsMarks ||
        !hscphysicsMarks ||
        !hscchemistryMarks ||
        !hscpcmPercentage ||
        !hscvocationalSub ||
        !hscvocationalsubjectMarks ||
        !hscvovationalsubjectPer ||
        !sscBoard ||
        !sscyearofPass ||
        !ssctotalMarks ||
        !sscmarksObtained ||
        !sscPercentage ||
        !hscBoard ||
        !hscyearofPass ||
        !hsctotalMarks ||
        !hscmarksObtained ||
        !hscPercentage) {
      setError('Please fill out all fields.');
      alert('Please fill out all fields.');
      return false;
    }
    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate
  }));

  return (
    <div>
      <h1 className="center page-heading">Academic Details</h1>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="hscmathsMarks">HSC maths marks:</label>
          <input type="text" id="hscmathsMarks" value={formData.academicDetails.hscmathsMarks} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="hscphysicsMarks">HSC physics marks:</label>
          <input type="text" id="hscphysicsMarks" value={formData.academicDetails.hscphysicsMarks} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="hscchemistryMarks">HSC chemistry marks:</label>
          <input type="text" id="hscchemistryMarks" value={formData.academicDetails.hscchemistryMarks} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="hscpcmPercentage">HSC PCM percentage:</label>
          <input type="text" id="hscpcmPercentage" value={formData.academicDetails.hscpcmPercentage} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-field">
        <label for="hscvocationalSub">HSC vocational subject name:</label>
        <input type="text" id="hscvocationalSub" value={formData.academicDetails.hscvocationalSub} onChange={handleChange} placeholder="Enter department name" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="hscvocationalsubjectMarks">HSC vocational subject marks:</label>
          <input type="text" id="hscvocationalsubjectMarks" value={formData.academicDetails.hscvocationalsubjectMarks} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="hscvocationalsubjectPer">HSC vocational subject percentage:</label>
          <input type="text" id="hscvovationalsubjectPer" value={formData.academicDetails.hscvovationalsubjectPer} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>        

      <label id="course-details">Course Details: </label>
    <table className="course-table">
      <thead>
        <tr>
          <th>Exam Passed</th>
          <th>Board / University</th>
          <th>Year of passing</th>
          <th>Total marks</th>
          <th>Marks obtained</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>S.S.C(10th)</th>
          <td><input type="text" id="sscBoard" value={formData.academicDetails.sscBoard} onChange={handleChange} /></td>
          <td><input type="text" id="sscyearofPass" value={formData.academicDetails.sscyearofPass} onChange={handleChange} /></td>
          <td><input type="text" id="ssctotalMarks" value={formData.academicDetails.ssctotalMarks} onChange={handleChange} /></td>
          <td><input type="text" id="sscmarksObtained" value={formData.academicDetails.sscmarksObtained} onChange={handleChange} /></td>
          <td><input type="text" id="sscPercentage" value={formData.academicDetails.sscPercentage} onChange={handleChange} /></td>
        </tr>
        <tr>
          <th>H.S.C(12th) / Diploma</th>
          <td><input type="text" id="hscBoard" value={formData.academicDetails.hscBoard} onChange={handleChange} /></td>
          <td><input type="text" id="hscyearofPass" value={formData.academicDetails.hscyearofPass} onChange={handleChange} /></td>
          <td><input type="text" id="hsctotalMarks" value={formData.academicDetails.hsctotalMarks} onChange={handleChange} /></td>
          <td><input type="text" id="hscmarksObtained" value={formData.academicDetails.hscmarksObtained} onChange={handleChange} /></td>
          <td><input type="text" id="hscPercentage" value={formData.academicDetails.hscPercentage} onChange={handleChange} /></td>
        </tr>
      </tbody>
    </table>
    <br></br>
      {/* Add your academic details form fields here */}
    </div>
  );
});

export default AcademicDetails;
