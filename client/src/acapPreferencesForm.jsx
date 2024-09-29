import React, { useState, useEffect, forwardRef } from 'react';

const initialOptions = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Engineering (IOT & Cybersecurity Including Blockchain Technology)',
  'Electronics & Telecommunication Engineering',
  'Electronics & Computer Science',
  // 'Mechanical Engineering',
];

const AcapPreferencesForm = forwardRef(({ formData, setFormData, setError }, ref) => {
  const [preferences, setPreferences] = useState(formData.preferences || []);
  const [preferencesOptions, setPreferencesOptions] = useState([initialOptions]);

  useEffect(() => {
    // Update options for subsequent dropdowns based on current selections
    const updatedOptions = [initialOptions];

    for (let i = 1; i < preferences.length; i++) {
      if (preferences[i - 1]) {
        const remainingOptions = initialOptions.filter(option => !preferences.slice(0, i).includes(option));
        updatedOptions.push(remainingOptions);
      } else {
        updatedOptions.push([]);
      }
    }

    setPreferencesOptions(updatedOptions);
    
    // Update formData when preferences change
    setFormData(prevFormData => ({
      ...prevFormData,
      preferences
    }));
  }, [preferences, setFormData]);

  const handlePreferenceChange = (index, value) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index] = value;
    setPreferences(updatedPreferences);
  };

  const isFirstPreferenceEmpty = preferences[0] === '';

  return (
    <div className='container'>
      <div className='inputs'>
        <h1 className="center page-heading">Branch Preference Form</h1>
        {preferences.map((preference, index) => (
          <div key={index}>
            <div className='input-field'>
              <label htmlFor={`preference${index}`}>Preference {index + 1}: </label>
              <select
                id={`preference${index}`}
                className='dropdown-field'
                value={preference || ''}
                onChange={(e) => handlePreferenceChange(index, e.target.value)}
              >
                <option value="">Select preference</option>
                {preferencesOptions[index] && preferencesOptions[index].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {index === 0 && isFirstPreferenceEmpty && <span className="error">First preference is required.</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default AcapPreferencesForm;
