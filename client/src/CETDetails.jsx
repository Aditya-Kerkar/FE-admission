import React, { useState,useEffect, forwardRef, useImperativeHandle } from 'react';

const CETDetails = forwardRef(({ formData,dbRetrival, setFormData, setError }, ref) => {
//change1

const [count,setCount]=useState(0);


//localstorage
useEffect(() => {
  // Load data from local storage only when count is 0
  if (count === 0) {
    if(dbRetrival===false){
      const savedFormData = JSON.parse(localStorage.getItem(`${formData.personalDetails.email}-formData.cetDetails`));
      if (savedFormData) {
        // Merge savedFormData into formData
        // console.log("accessed the saved")
        const updatedFormData = {
          ...formData,
          cetDetails: {
            ...formData.cetDetails,
            ...savedFormData
          }
        };
        setFormData(updatedFormData);
      }
      // Increment count to prevent reloading on subsequent renders
      setCount(count + 1);
    // }else{
      // setCount(count+1);
      // return;
    }
   
  } else {
    // console.log("tried to save")
    // Save formData.personalDetails to local storage on every change
    localStorage.setItem(`${formData.personalDetails.email}-formData.cetDetails`, JSON.stringify(formData.cetDetails));
    
  }
}, [count, formData.cetDetails,setFormData]);





  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    // Validate based on input id
    switch (id) {
      case 'cetappId':
      case 'cetrollNo':
      case 'jeeappNum':
        // Allow only integers
        // newValue = value.replace(/\D/g, '');
        newValue = value;
        break;
      case 'cetmathsPer':
      case 'cetphysicsPer':
      case 'cetchemistryPer':
      case 'cetPer':
      case 'jeePer':
        // Allow only floats with 2 digits after decimal
        newValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except dot
        const match = /^(\d*\.?\d{0,7})/.exec(newValue);
        if (match) {
          newValue = match[1];
        }
        
        break;
      default:
        break;
    }

    // Update formData state
    setFormData((prevFormData) => ({
      ...prevFormData,
      cetDetails: {
        ...prevFormData.cetDetails,
        [id]: newValue
      }
    }));
  };

  const validate = () => {
    const { cetappId, cetrollNo, cetmathsPer, cetphysicsPer, cetchemistryPer, cetPer, jeeappNum, jeePer } = formData.cetDetails;


    if(formData.personalDetails.admissionType==='DSE'){
      return true;
    }
    if (!cetappId || !cetrollNo || !cetmathsPer || !cetphysicsPer || !cetchemistryPer || !cetPer) {
      setError('Please fill out all fields.');
      return false;
      
    }

    const percentages = [cetmathsPer, cetphysicsPer, cetchemistryPer, cetPer];
    for (const percentage of percentages) {
      if (isNaN(parseFloat(percentage)) || parseFloat(percentage) < 0 || parseFloat(percentage) > 100) {
        setError(<span style={{ color: 'red' }}>'Percentages and percentiles must be between 0 and 100.'</span>);
        return false;
      }
    }

    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate
  }));
//till here chnge1
  return (
    <div>
      <h1 className="center page-heading">CET Details</h1>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetappId">CET application ID:</label>
          <input type="text" id="cetappId" value={formData.cetDetails.cetappId} onChange={handleChange} placeholder="Enter CET application ID" />
        </div>
        <div className="input-field">
          <label for="cetrollNo">CET roll number:</label>
          <input type="text" id="cetrollNo" value={formData.cetDetails.cetrollNo} onChange={handleChange} placeholder="Enter CET roll number" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetmathsPer">CET maths percentile:</label>
          <input type="text" id="cetmathsPer" value={formData.cetDetails.cetmathsPer} onChange={handleChange} placeholder="Enter CET maths percentile" />
        </div>
        <div className="input-field">
          <label for="cetphysicsPer">CET physics percentile:</label>
          <input type="text" id="cetphysicsPer" value={formData.cetDetails.cetphysicsPer} onChange={handleChange} placeholder="Enter CET physics percentile" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetchemistryPer">CET chemistry percentile:</label>
          <input type="text" id="cetchemistryPer" value={formData.cetDetails.cetchemistryPer} onChange={handleChange} placeholder="Enter CET chemistry percentile" />
        </div>
        <div className="input-field">
          <label for="cetPer">CET Percentile:</label>
          <input type="text" id="cetPer" value={formData.cetDetails.cetPer} onChange={handleChange} placeholder="Enter CET Percentile" />
        </div>
      </div>


      <h1 className="center page-heading">JEE Details</h1>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="jeeappNum">JEE application number:</label>
          <input type="text" id="jeeappNum" value={formData.cetDetails.jeeappNum} onChange={handleChange} placeholder="Enter JEE application number" />
        </div>
        <div className="input-field">
          <label for="jeePer">JEE percentile:</label>
          <input type="text" id="jeePer" value={formData.cetDetails.jeePer} onChange={handleChange} placeholder="Enter JEE percentile" />
        </div>
      </div>
      <br></br>
      {/* Add your CET details form fields here */}
    </div>
  );
});

export default CETDetails;