import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const AcademicDetails = forwardRef(({ formData, setFormData,dbRetrival, setError }, ref) => {
  const [isVocationalSubjectOpted, setIsVocationalSubjectOpted] = useState(false);
  const [showAdmitCardIdInput, setShowAdmitCardIdInput] = useState(false);
  const [formType, setFormType] = useState(formData.formType);
  const getCurrentYear = () => new Date().getFullYear();
  const [Showdse,setShowdse]=useState(false);
  // let showdse=false

  const [count,setCount]=useState(0);

// useEffect(()=>{
//   setFormData((prevFormData) => ({
//     ...prevFormData,
//     academicDetails: { ...prevFormData.academicDetails, eduBackground: prevFormData }
//   }));
// })
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
  
    // Convert specific fields to uppercase
    if (['hscvocationalSub', 'sscBoard', 'hscBoard', 'diplomaBoardOrUniversity'].includes(id)) {
      newValue = newValue.toUpperCase();
    }

    // Convert empty values to null
    if (newValue.trim() === '') {
      newValue = null;
    }
  
    const { eduBackground } = formData.academicDetails; // Get the admission type
    const isVocationalChecked = formData.academicDetails.hscvocationalSubChecked; // Vocational subject checkbox status
    
    let isValid = true;
    let errorMessage = '';
  
    // Validate SSC fields (always required)
    if (['sscyearofPass', 'ssctotalMarks', 'sscmarksObtained'].includes(id)) {
      if (newValue !== null && (!/^\d+$/.test(newValue) || newValue < 0)) {
        isValid = false;
        errorMessage = 'SSC details should be non-negative numbers.';
      }
    }
  
    // Validation logic based on admissionType
    if (eduBackground !== "hsc") {
      if (['diplomaBoardOrUniversity', 'diplomatotalMarks', 'diplomamarksObtained', 'diplomaPercentage'].includes(id)) {
        if (id === 'diplomaBoardOrUniversity' && newValue === null) {
          isValid = false;
          errorMessage = 'Diploma board/university is mandatory.';
        } else if (['diplomatotalMarks', 'diplomamarksObtained'].includes(id) && (newValue !== null && (!/^\d+$/.test(newValue) || newValue < 0))) {
          isValid = false;
          errorMessage = 'Diploma total marks and marks obtained should be non-negative numbers.';
        } else if (id === 'diplomaPercentage' && (newValue !== null && (!/^\d*(\.\d{0,2})?$/.test(newValue) || newValue < 0 || newValue > 100))) {
          isValid = false;
          errorMessage = 'Diploma percentage should be between 0 and 100 and can have up to 2 decimal places.';
        }
      }
    }
  
    if (eduBackground !== "diploma") {
      // For normal students (non-DSE), HSC fields are mandatory
      if (['hscmathsMarks', 'hscphysicsMarks', 'hscchemistryMarks', 'hscpcmPercentage', 'hscvocationalsubjectMarks', 'hscvovationalsubjectPer'].includes(id)) {
        if (newValue !== null && (!/^\d+$/.test(newValue) || newValue < 0 || newValue > 100)) {
          isValid = false;
          errorMessage = 'HSC marks should be between 0 and 100.';
        }
      }
      if (['hscBoard'].includes(id) && newValue === null) {
        isValid = false;
        errorMessage = 'HSC board is mandatory.';
      }
      
    }
  
    // Handle vocational subject details
    if (id === 'hscvocationalSubChecked') {
      if (checked) {
        if (formData.academicDetails.hscvocationalSub === null || formData.academicDetails.hscvocationalSub.trim() === '') {
          isValid = false;
          errorMessage = 'Vocational subject name is mandatory when vocational checkbox is ticked.';
        }
        if (formData.academicDetails.hscvocationalsubjectMarks !== null && (!/^\d+$/.test(formData.academicDetails.hscvocationalsubjectMarks) || formData.academicDetails.hscvocationalsubjectMarks < 0 || formData.academicDetails.hscvocationalsubjectMarks > 100)) {
          isValid = false;
          errorMessage = 'Vocational subject marks should be between 0 and 100.';
        }
      }
    } else if (isVocationalChecked) {
      if (newValue === null || (id === 'hscvocationalsubjectMarks' && (newValue !== null && (!/^\d+$/.test(newValue) || newValue < 0 || newValue > 100)))) {
        isValid = false;
        errorMessage = 'Vocational subject details are required when checkbox is ticked.';
      }
    }
  
    // Update form data and error messages
    if (isValid) {
      setError('');
      setFormData((prevFormData) => ({
        ...prevFormData,
        academicDetails: { ...prevFormData.academicDetails, [id]: newValue }
      }));
    } else {
      setError(errorMessage);
    }
  
    // Specific logic for handling board selection
    if (id === 'hscBoard') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          hscBoard: newValue,
        }
      }));
      setShowAdmitCardIdInput(newValue === 'CBSE');
    } else if (id === 'sscBoard') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          sscBoard: newValue,
          
        }
      }));
    } else if (id === 'diplomaBoardOrUniversity') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          diplomaBoardOrUniversity: newValue
        }
      }));
    } else if (id === 'eduBackground') {
      setFormData((prevState) => ({
        ...prevState,
        academicDetails: {
          ...prevState.academicDetails,
          eduBackground: newValue
        }
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
    const { diplomatotalMarks, diplomamarksObtained } = formData.academicDetails;
  
    if (diplomatotalMarks && diplomamarksObtained) {
      const total = parseFloat(diplomatotalMarks);
      const obtained = parseFloat(diplomamarksObtained);
  
      if (total > 0 && obtained >= 0) {
        const diplomaPercentagecal = ((obtained / total) * 100).toFixed(2);
        console.log(diplomaPercentagecal);
        setFormData((prevFormData) => ({
          ...prevFormData,
          academicDetails: { ...prevFormData.academicDetails, diplomaPercentage: diplomaPercentagecal }
        }));
      }
    }
  }, [formData.academicDetails.diplomatotalMarks, formData.academicDetails.diplomamarksObtained]);
  



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
      dsePercentage,
      diplomapassingyear,
      diplomatotalMarks,
      diplomamarksObtained,
      diplomaPercentage,
      diplomacollage,
      eduBackground,
      diplomaBoardOrUniversity,
    } = formData.academicDetails;
  
    const currentYear = getCurrentYear();
    const birthYear = new Date(formData.personalDetails.dateofBirth).getFullYear();
    const minSSCYear = birthYear + 15;
    const sscYearOfPass = parseInt(sscyearofPass, 10);
    const minHSCYear = sscYearOfPass + 2;
  
    // Validation for SSC (common for all students)
    if (
      !/^\d{4}$/.test(sscyearofPass) ||
      sscyearofPass < minSSCYear ||
      sscyearofPass > currentYear ||
      !/^\d+$/.test(ssctotalMarks) ||
      !/^\d+$/.test(sscmarksObtained) ||
      !/^\d+(\.\d{1,2})?$/.test(sscPercentage)
    ) {
      setError(`Please provide valid SSC details.`);
      return false;
    }
  
    if (parseFloat(sscmarksObtained) > parseFloat(ssctotalMarks)) {
      setError('Marks obtained in SSC cannot be more than total marks.');
      alert('Marks obtained in SSC cannot be more than total marks.');
      return false;
    }
  
    // Validation for HSC details (only for regular students)
    if (eduBackground !=="diploma") {
      
      if (hscBoard === 'Other' && !formData.academicDetails.otherBoard12) {
        setError('Please enter the name of the other HSC board.');
        return false;
      }
      
      if (
        !hscmathsMarks ||
        !hscphysicsMarks ||
        !hscchemistryMarks ||
        !hscpcmPercentage ||
        (isVocationalSubjectOpted && (!hscvocationalSub || !hscvocationalsubjectMarks || !hscvovationalsubjectPer)) ||
        !hscBoard ||
        !/^\d{4}$/.test(hscyearofPass) ||
        !/^\d+$/.test(hsctotalMarks) ||
        !/^\d+$/.test(hscmarksObtained) ||
        !/^\d+(\.\d{1,2})?$/.test(hscPercentage)
      ) {
        setError('Please provide valid HSC details.');
        return false;
      }
  
      if (parseFloat(hscmarksObtained) > parseFloat(hsctotalMarks)) {
        setError('Marks obtained in HSC cannot be more than total marks.');
        alert('Marks obtained in HSC cannot be more than total marks.');
        return false;
      }
  
      // Year Validation for HSC
      if (
        hscyearofPass !== '0000' &&
        (hscyearofPass < minHSCYear || hscyearofPass > currentYear)
      ) {
        setError(`Year of passing HSC should be between ${minHSCYear} and ${currentYear}.`);
        alert('Please fill out all fields correctly.');
        return false;
      }
      if(formData.academicDetails.hscBoard==="CBSE"){
        if(formData.academicDetails.admitCardId===null || formData.academicDetails.admitCardId.trim()===""){
          setError('CBSE Amit Card Id is required');
          return false;
      }
    }
    }
  
    // Diploma details validation for regular students
    if (eduBackground !=="hsc") {
      if (
        !diplomapassingyear ||
        !diplomatotalMarks ||
        !diplomamarksObtained ||
        !diplomaPercentage ||
        !diplomacollage ||
        !diplomaBoardOrUniversity
      ) {
        setError('Diploma details are required .');
        return false;
      }
    }
  
    // Board Fields Validation
    if (sscBoard === 'Other' && !formData.academicDetails.otherBoard10) {
      setError('Please enter the name of the other SSC board.');
      return false;
    }
  

  
    // Update formData with other board names if applicable
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
  
    // Clear previous error
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


      {(formData.personalDetails.admissionType ==="DSE" || formData.personalDetails.admissionType ==="DSE MINORITY" || formData.personalDetails.admissionType ==="DSE ACAP") ?(
<>

      <div className="input-fields side-by-side">
        <div className="input-field">
        <label for="education">Select Education Level:</label>
    <select  id="eduBackground" className="dropdown-field" value={formData.academicDetails.eduBackground} onChange={handleChange}>
    <option value="" disabled selected>Select Education Background</option>
        <option value="diploma">Diploma</option>
        <option value="diploma + hsc">Diploma + HSC</option>
        <option value="hsc" disabled>HSC</option>
    </select>
        </div>
        </div>
</>
      ):(<></>)}
      {formData.academicDetails.eduBackground !=="diploma" &&(
        <>
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
</>
      )}
<div className="input-fields">
        <div className="input-field">
          <label for="sscBoard">10th Board Name:</label>
          <select id="sscBoard" className="dropdown-field" value={formData.academicDetails.sscBoard} onChange={handleChange}>
            <option value="" disabled selected>Select Board</option>
            <option value="Other">Other</option>
            <option value="MSBSHSE">Maharashtra State Board of Secondary and Higher Secondary Education(MSBSHSE)</option>
            <option value="CBSE">Central Board of Secondary Education(CBSE)</option>
            <option value="ICSE">Indian Certificate of Secondary Education(ICSE)</option>
          </select>
          <br></br>
          {formData.academicDetails.sscBoard === "OTHER" && (
          <input
            type="text"
            id="otherBoard10"
            // className="dropdown-field"
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
{formData.academicDetails.eduBackground !=="diploma" && (
  <>
  <div className="input-fields">
        <div className="input-field">
          <label for="hscBoard">12th Board Name :</label>
          <select id="hscBoard" className="dropdown-field" value={formData.academicDetails.hscBoard} onChange={handleChange} placeholder="Enter board name">
            <option value="" disabled selected>Select Board</option>
            <option value="Other">Other</option>
            <option value="MSBSHSE">Maharashtra State Board of Secondary and Higher Secondary Education(MSBSHSE)</option>
            <option value="CBSE">Central Board of Secondary Education(CBSE)</option>
            <option value="ICSE">Indian Certificate of Secondary Education(ICSE)</option>
            <option value="ISC">Indian School Certificate(ISC)</option>
          </select>
          <br></br>
          {formData.academicDetails.hscBoard==="CBSE" && (
          <div className="input-field">
            <br></br>
            <label htmlFor="admitCardId">CBSE 12th Admit Card ID:</label>
            <input type="text" id="admitCardId" value={formData.academicDetails.admitCardId} onChange={handleChange} placeholder="Enter Admit Card ID" />
          </div>
        )}
          {formData.academicDetails.hscBoard === "OTHER" && (
          <input
            type="text"
            id="otherBoard12"
            // className="dropdown-field"
            value={formData.academicDetails.otherBoard12}
            onChange={handleChange}
            placeholder="Enter board name "
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
  </>
)}
      
      {formData.academicDetails.eduBackground !=="hsc" && ( 
        <>
        <hr />
        <div className="input-fields">
        <div className="input-field">
          <label for="diplomaBoardOrUniversity">Diploma Board / University:</label>
          {/* <br></br> */}

              {/* <div className="input-field">
            <br></br>
            <label htmlFor="admitCardId">CBSE 12th Admit Card ID:</label>
            <input type="text" id="admitCardId" value={formData.academicDetails.admitCardId} onChange={handleChange} placeholder="Enter Admit Card ID" />
          </div> */}


      {/* <div className="input-fields"> */}
      {/* <div className="input-field"> */}
        {/* <label htmlFor="diplomaBoardOrUniversity">University :</label> */}
        <input type="text" id="diplomaBoardOrUniversity" className="dropdown-field" value={formData.academicDetails.diplomaBoardOrUniversity} onChange={handleChange} placeholder="diploma Board / university" />
      {/* </div> */}
      {/* </div> */}
  
        </div>
        </div>




      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="diplomacollage">Name Of the College :</label>
          <input type="text" id="diplomacollage" value={formData.academicDetails.diplomacollage} onChange={handleChange} placeholder="Diploma collage" />
        </div>
      </div>




      <div className="input-fields side-by-side">
        <div className="input-field">
          <label htmlFor="diplomapassingyear">Diploma year of passing :</label>
          <input type="text" id="diplomapassingyear" value={formData.academicDetails.diplomapassingyear} onChange={handleChange} placeholder="Enter year" />
        </div>
        <div className="input-field">
          <label htmlFor="diplomatotalMarks">Total marks :</label>
          <input type="text" id="diplomatotalMarks" value={formData.academicDetails.diplomatotalMarks} onChange={handleChange} placeholder="Enter total marks" />
        </div>
        <div className="input-field">
          <label htmlFor="diplomamarksObtained">Marks Obtained :</label>
          <input type="text" id="diplomamarksObtained" value={formData.academicDetails.diplomamarksObtained} onChange={handleChange} placeholder="Enter marks obtained" />
        </div>
      </div>

      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="diplomaPercentage">Diploma percentage:</label>
          <input type="text" id="diplomaPercentage" value={formData.academicDetails.diplomaPercentage} onChange={handleChange} placeholder="Calculated percentage" readOnly />
        </div>
      </div>

        </>
)}

    </div>

    
  );
});

export default AcademicDetails;