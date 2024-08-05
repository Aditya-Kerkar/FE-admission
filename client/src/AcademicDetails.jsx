import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const AcademicDetails = forwardRef(({ formData, setFormData,dbRetrival, setError }, ref) => {
  const [isVocationalSubjectOpted, setIsVocationalSubjectOpted] = useState(false);
  const [showAdmitCardIdInput, setShowAdmitCardIdInput] = useState(false);
  const [formType, setFormType] = useState(formData.formType);
  const getCurrentYear = () => new Date().getFullYear();


  const [count,setCount]=useState(0);


  //localstorage
  useEffect(() => {
    // Load data from local storage only when count is 0
    if (count === 0) {
      if(dbRetrival===false){
        const savedFormData = JSON.parse(localStorage.getItem(`${formData.personalDetails.email}-formData.academicDetails`));
        if (savedFormData) {
          // Merge savedFormData into formData
          // console.log("accessed the saved")
          const updatedFormData = {
            ...formData,
            academicDetails: {
              ...formData.academicDetails,
              ...savedFormData
            }
          };
          setFormData(updatedFormData);
        }
        // Increment count to prevent reloading on subsequent renders
        setCount(count + 1);

      }else{
        setCount(count+1);
        return;
      }
      
    } else {
      // console.log("tried to save")
      // Save formData.personalDetails to local storage on every change
      localStorage.setItem(`${formData.personalDetails.email}-formData.academicDetails`, JSON.stringify(formData.academicDetails));
      
    }
  }, [count, formData.academicDetails,setFormData]); // Watch count and formData.personalDetails for changes
 





  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (id === 'hscBoard') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          hscBoard: value,
          otherBoard12: value === 'Other' ? '' : prevState.academicDetails.otherBoard12
        }
      }));
      if (value === 'CBSE') {
        setShowAdmitCardIdInput(true);
      } else {
        setShowAdmitCardIdInput(false);
      }
    } else if (id === 'sscBoard') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          sscBoard: value,
          otherBoard10: value === 'Other' ? '' : prevState.academicDetails.otherBoard10
        }
      }));
    } else {

    // Convert specific fields to uppercase
    if (id === 'hscvocationalSub' || id === 'sscBoard' || id === 'hscBoard') {
      newValue = newValue.toUpperCase();
    }

    // Validate based on field ID
    switch (id) {
      case 'hscmathsMarks':
      case 'hscphysicsMarks':
      case 'hscchemistryMarks':
      case 'hscvocationalsubjectMarks':
        if (!/^\d*$/.test(value) || value < 0 || value > 100) {
          setError('Marks should be between 0 and 100.');
          return;
        }
        break;
      case 'ssctotalMarks':
      case 'sscmarksObtained':
      case 'hsctotalMarks':
      case 'hscmarksObtained':
        if (!/^\d*$/.test(value) || value < 0) return;
        break;
      case 'hscpcmPercentage':
      case 'hscvovationalsubjectPer':
      case 'sscPercentage':
      case 'hscPercentage':
        if (!/^\d*(\.\d{0,2})?$/.test(value) || value < 0 || value > 100) return;
        break;
      case 'hscvocationalSub':
      case 'sscBoard':
      case 'hscBoard':
        if (!/^[a-zA-Z\s]*$/.test(value)) return;
        break;
      default:
        break;
    }

    setError('');
    setFormData((prevFormData) => ({
      ...prevFormData,
      academicDetails: { ...prevFormData.academicDetails, [id]: newValue }
    }));
    }
  };

  useEffect(() => {
    const { hscmathsMarks, hscphysicsMarks, hscchemistryMarks } = formData.academicDetails;

    if (hscmathsMarks && hscphysicsMarks && hscchemistryMarks) {
      const maths = parseFloat(hscmathsMarks);
      const physics = parseFloat(hscphysicsMarks);
      const chemistry = parseFloat(hscchemistryMarks);

      if (maths <= 100 && physics <= 100 && chemistry <= 100) {
        const pcmPercentage = ((maths + physics + chemistry) / 3).toFixed(2);
        setFormData((prevFormData) => ({
          ...prevFormData,
          academicDetails: { ...prevFormData.academicDetails, hscpcmPercentage: pcmPercentage }
        }));
      }
    }
  }, [formData.academicDetails.hscmathsMarks, formData.academicDetails.hscphysicsMarks, formData.academicDetails.hscchemistryMarks]);

  useEffect(() => {
    const { hscmathsMarks, hscphysicsMarks, hscvocationalsubjectMarks } = formData.academicDetails;

    if (hscmathsMarks && hscphysicsMarks && hscvocationalsubjectMarks) {
      const maths = parseFloat(hscmathsMarks);
      const physics = parseFloat(hscphysicsMarks);
      const vocational = parseFloat(hscvocationalsubjectMarks);

      if (maths <= 100 && physics <= 100 && vocational <= 100) {
        const vocationalPercentage = ((maths + physics + vocational) / 3).toFixed(2);
        setFormData((prevFormData) => ({
          ...prevFormData,
          academicDetails: { ...prevFormData.academicDetails, hscvovationalsubjectPer: vocationalPercentage }
        }));
      }
    }
  }, [formData.academicDetails.hscmathsMarks, formData.academicDetails.hscphysicsMarks, formData.academicDetails.hscvocationalsubjectMarks]);

  useEffect(() => {
    const { ssctotalMarks, sscmarksObtained, hsctotalMarks, hscmarksObtained } = formData.academicDetails;

    if (ssctotalMarks && sscmarksObtained) {
      const total = parseFloat(ssctotalMarks);
      const obtained = parseFloat(sscmarksObtained);

      if (total > 0 && obtained <= total) {
        const sscPercentage = ((obtained / total) * 100).toFixed(2);
        setFormData((prevFormData) => ({
          ...prevFormData,
          academicDetails: { ...prevFormData.academicDetails, sscPercentage: sscPercentage }
        }));
      }
    }

    if (hsctotalMarks && hscmarksObtained) {
      const total = parseFloat(hsctotalMarks);
      const obtained = parseFloat(hscmarksObtained);

      if (total > 0 && obtained <= total) {
        const hscPercentage = ((obtained / total) * 100).toFixed(2);
        setFormData((prevFormData) => ({
          ...prevFormData,
          academicDetails: { ...prevFormData.academicDetails, hscPercentage: hscPercentage }
        }));
      }
    }
  }, [formData.academicDetails.ssctotalMarks, formData.academicDetails.sscmarksObtained, formData.academicDetails.hsctotalMarks, formData.academicDetails.hscmarksObtained]);

  const validate = () => {
    const {
      hscmathsMarks,
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
      hscPercentage,
      dsePercentage
    } = formData.academicDetails;

    const currentYear = getCurrentYear();
    const birthYear = new Date(formData.personalDetails.dateofBirth).getFullYear();
    const minSSCYear = birthYear + 15;
    const sscYearOfPass = parseInt(sscyearofPass, 10);
    const minHSCYear = sscYearOfPass + 2;

    if (
      !hscmathsMarks ||
      !hscphysicsMarks ||
      !hscchemistryMarks ||
      !hscpcmPercentage ||
      (isVocationalSubjectOpted && (!hscvocationalSub || !hscvocationalsubjectMarks || !hscvovationalsubjectPer)) ||
      !sscBoard ||
      !sscyearofPass ||
      !ssctotalMarks ||
      !sscmarksObtained ||
      !sscPercentage ||
      !hscBoard ||
      !hscyearofPass ||
      !hsctotalMarks ||
      !hscmarksObtained ||
      !hscPercentage ||
      (formType === 'Form C' && !dsePercentage)
    ) {
      alert('Please fill out all fields correctly.');
      return false;
    }

    if (
      !/^\d{4}$/.test(sscyearofPass) ||
      sscyearofPass < minSSCYear ||
      sscyearofPass > currentYear ||
      (!/^\d{4}$/.test(hscyearofPass) && hscyearofPass !== '0000') ||
      (hscyearofPass !== '0000' && (hscyearofPass < minHSCYear || hscyearofPass > currentYear))
    ) {
      if (
        !/^\d{4}$/.test(sscyearofPass) ||
        sscyearofPass < minSSCYear ||
        sscyearofPass > currentYear
      ) {
        setError(`Year of passing SSC should be between ${minSSCYear} and ${currentYear}.`);
      }
      
      if (
        hscyearofPass !== '0000' &&
        (
          !/^\d{4}$/.test(hscyearofPass) ||
          hscyearofPass < minHSCYear ||
          hscyearofPass > currentYear
        )
      ) {
        setError(`Year of passing HSC should be between ${minHSCYear} and ${currentYear}.`);
      }
      
      alert('Please fill out all fields correctly.');
      return false;
    }
    if (
      parseFloat(formData.academicDetails.sscmarksObtained) > parseFloat(formData.academicDetails.ssctotalMarks) ||
      parseFloat(formData.academicDetails.hscmarksObtained) > parseFloat(formData.academicDetails.hsctotalMarks)
    ) {
      setError('Marks obtained cannot be more than total marks.');
      alert('Marks obtained cannot be more than total marks.');
      return false;
    }

    if (formData.academicDetails.otherBoard10) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        academicDetails: { ...prevFormData.academicDetails, sscBoard: formData.academicDetails.otherBoard10 }
      }));
    }

    if (formData.academicDetails.otherBoard12) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        academicDetails: { ...prevFormData.academicDetails, hscBoard: formData.academicDetails.otherBoard12 }
      }));
    }

    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate
  }));

  
  const handleOtherBoardChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      academicDetails: {
        ...prevState.academicDetails,
        otherBoard: value
      }
    }));
  };
// 3,4,2,5
  return (
    <div>
      <h1 className="center page-heading">Academic Details</h1>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label htmlFor="hscmathsMarks">12th maths marks:</label>
          <input type="text" id="hscmathsMarks" value={formData.academicDetails.hscmathsMarks} onChange={handleChange} placeholder="Enter marks" />
        </div>
        <div className="input-field">
          <label htmlFor="hscphysicsMarks">12th physics marks:</label>
          <input type="text" id="hscphysicsMarks" value={formData.academicDetails.hscphysicsMarks} onChange={handleChange} placeholder="Enter marks" />
        </div>
        <div className="input-field">
          <label htmlFor="hscchemistryMarks">12th chemistry marks:</label>
          <input type="text" id="hscchemistryMarks" value={formData.academicDetails.hscchemistryMarks} onChange={handleChange} placeholder="Enter marks" />
        </div>
      </div>

      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="hscpcmPercentage">12th PCM percentage:</label>
          <input type="text" id="hscpcmPercentage" value={formData.academicDetails.hscpcmPercentage} onChange={handleChange} placeholder="Calculated percentage" readOnly />
        </div>
      </div>

      <div className="input-field">
        <label htmlFor="hscvocationalSub">Is vocational subject opted?</label>
        <input type="checkbox" id="hscvocationalSub" checked={isVocationalSubjectOpted} onChange={(e) => setIsVocationalSubjectOpted(e.target.checked)} />
      </div>

      {isVocationalSubjectOpted && (
        <>
          <div className="input-fields">
            <div className="input-field">
              <label htmlFor="hscvocationalSub">12th vocational subject name:</label>
              <input type="text" id="hscvocationalSub" value={formData.academicDetails.hscvocationalSub} onChange={handleChange} placeholder="Enter subject" />
            </div>
          </div>

          <div className="input-fields side-by-side">
            <div className="input-field">
              <label htmlFor="hscvocationalsubjectMarks">12th vocational subject marks:</label>
              <input type="text" id="hscvocationalsubjectMarks" value={formData.academicDetails.hscvocationalsubjectMarks} onChange={handleChange} placeholder="Enter marks" />
            </div>
            <div className="input-field">
              <label htmlFor="hscvovationalsubjectPer">12th vocational subject percentage:</label>
              <input type="text" id="hscvovationalsubjectPer" value={formData.academicDetails.hscvovationalsubjectPer} onChange={handleChange} placeholder="Calculated percentage" readOnly />
            </div>
          </div>
        </>
      )}

<div className="input-fields">
        <div className="input-field">
          <label for="sscBoard">10th Board Name:</label>
          <select id="sscBoard" className="dropdown-field" value={formData.academicDetails.sscBoard} onChange={handleChange}>
            <option value="" disabled selected>Select Board</option>
            <option value="MSBSHSE">Maharashtra State Board of Secondary and Higher Secondary Education(MSBSHSE)</option>
            <option value="CBSE">Central Board of Secondary Education(CBSE)</option>
            <option value="ICSE">Indian Certificate of Secondary Education(ICSE)</option>
            <option value="Other">Other</option>
          </select>
          <br></br>
          {formData.academicDetails.sscBoard === "Other" && (
          <input
            type="text"
            id="otherBoard10"
            className="dropdown-field"
            value={formData.academicDetails.otherBoard10}
            onChange={handleChange}
            placeholder="Enter board name"
          />
        )}
        </div>
      </div>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label htmlFor="sscyearofPass">10th year of passing:</label>
          <input type="text" id="sscyearofPass" value={formData.academicDetails.sscyearofPass} onChange={handleChange} placeholder="Enter year" />
        </div>
        <div className="input-field">
          <label htmlFor="ssctotalMarks">10th total marks:</label>
          <input type="text" id="ssctotalMarks" value={formData.academicDetails.ssctotalMarks} onChange={handleChange} placeholder="Enter total marks" />
        </div>
        <div className="input-field">
          <label htmlFor="sscmarksObtained">10th marks obtained:</label>
          <input type="text" id="sscmarksObtained" value={formData.academicDetails.sscmarksObtained} onChange={handleChange} placeholder="Enter marks obtained" />
        </div>
      </div>

      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="sscPercentage">10th percentage:</label>
          <input type="text" id="sscPercentage" value={formData.academicDetails.sscPercentage} onChange={handleChange} placeholder="Calculated percentage" readOnly />
        </div>
      </div>

      <div className="input-fields">
        <div className="input-field">
          <label for="hscBoard">12th Board Name :</label>
          <select id="hscBoard" className="dropdown-field" value={formData.academicDetails.hscBoard} onChange={handleChange} placeholder="Enter board name">
            <option value="" disabled selected>Select Board</option>
            <option value="MSBSHSE">Maharashtra State Board of Secondary and Higher Secondary Education(MSBSHSE)</option>
            <option value="CBSE">Central Board of Secondary Education(CBSE)</option>
            <option value="ICSE">Indian Certificate of Secondary Education(ICSE)</option>
            <option value="ISC">Indian School Certificate(ISC)</option>
            <option value="Other or DSE">Other</option>
          </select>
          <br></br>
          {showAdmitCardIdInput && (
          <div className="input-field">
            <br></br>
            <label htmlFor="admitCardId">CBSE 12th Admit Card ID:</label>
            <input type="text" id="admitCardId" value={formData.academicDetails.admitCardId} onChange={handleChange} placeholder="Enter Admit Card ID" />
          </div>
        )}
          {formData.academicDetails.hscBoard === "Other or DSE" && (
          <input
            type="text"
            id="otherBoard12"
            className="dropdown-field"
            value={formData.academicDetails.otherBoard12}
            onChange={handleChange}
            placeholder="Enter board name (Enter 'NULL' if DSE)"
          />
        )}
        </div>
      </div>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label htmlFor="hscyearofPass">12th year of passing :</label>
          <input type="text" id="hscyearofPass" value={formData.academicDetails.hscyearofPass} onChange={handleChange} placeholder="Enter year" />
        </div>
        <div className="input-field">
          <label htmlFor="hsctotalMarks">12th total marks :</label>
          <input type="text" id="hsctotalMarks" value={formData.academicDetails.hsctotalMarks} onChange={handleChange} placeholder="Enter total marks" />
        </div>
        <div className="input-field">
          <label htmlFor="hscmarksObtained">12th marks obtained :</label>
          <input type="text" id="hscmarksObtained" value={formData.academicDetails.hscmarksObtained} onChange={handleChange} placeholder="Enter marks obtained" />
        </div>
      </div>

      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="hscPercentage">12th percentage:</label>
          <input type="text" id="hscPercentage" value={formData.academicDetails.hscPercentage} onChange={handleChange} placeholder="Calculated percentage" readOnly />
        </div>
      </div>
      {(formType === 'Form A' || formType === 'Form B') ? (
  <>

  </>
) : (
      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="dsePercentage">Diploma Final Percentage as per Marksheet :</label>
          <input type="text" id="dsePercentage" value={formData.academicDetails.dsePercentage} onChange={handleChange} placeholder="DSE percentage" />
        </div>
      </div>

)}
    </div>

    
  );
});

export default AcademicDetails;