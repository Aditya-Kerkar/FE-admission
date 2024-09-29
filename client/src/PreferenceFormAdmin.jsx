import React, { useState, useEffect, forwardRef } from 'react';

const initialOptions = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Engineering (IOT & Cybersecurity Including Blockchain Technology)',
  'Electronics & Telecommunication Engineering',
  'Electronics & Computer Science',
  'Mechanical Engineering'
];

const PreferenceFormAdmin = forwardRef(({ formData,dbRetrival, setFormData, setError }) => {
  const [preference, setPreference] = useState(formData.preference || '');

  const [count,setCount]=useState(0);

//localstorage
  useEffect(() => {
    // Load data from local storage only when count is 0
    if (count === 0) {
      const savedFormData = JSON.parse(localStorage.getItem(`${formData.personalDetails.email}-formData.bpreference`));
      if (savedFormData) {
        console.log(savedFormData);
       
        setPreference(savedFormData);
      }
      // Increment count to prevent reloading on subsequent renders
      setCount(count + 1);
    } else {
      // console.log("is it webkitTextStrokeWidth")
      localStorage.setItem(`${formData.personalDetails.email}-formData.bpreference`, JSON.stringify(preference));
      // console.log("save");
      // setFormData(prevFormData => ({
      //       ...prevFormData,
      //       preference
      //     }));
      // Save formData.personalDetails to local storage on every change
      // console.log(formData.preference);
      
    }
  },[count, formData.preferences,preference,setPreference]); // Watch count and formData.personalDetails for changes
  



  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      preference : preference
    }));
  }, [preference, setFormData]);

  const handlePreferenceChange = (value) => {
    setPreference(value);
  };

  const isFirstPreferenceEmpty = preference === '';

  return (
    <div className='container'>
      <div className='inputs'>
        <h1 className="center page-heading">Allotment Details</h1>
        <div className='input-field'>
          <label htmlFor="preference">Select your Department: </label>
          <select
            id="preference"
            className='dropdown-field'
            value={preference}
            onChange={(e) => handlePreferenceChange(e.target.value)}
          >
            <option value="" disabled>Select Department</option>
            {initialOptions.map((option) => (                     
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {isFirstPreferenceEmpty && <span className="error">Department is required.</span>}
        </div>
      </div>
    </div>
  );
});

export default PreferenceFormAdmin;