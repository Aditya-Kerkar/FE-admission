import React, { useState, forwardRef } from 'react';
import AcapPreferencesForm from './acapPreferencesForm'; // Update the path as necessary
import PreferenceFormAdmin from './PreferenceFormAdmin'; // Update the path as necessary

const Conditionalpreference = forwardRef(({ dbRetrival, formData, setFormData, setError}, ref) => {
  // Define your condition here
  // const [isAdmin, setIsAdmin] = useState(false); // Example condition, adjust as needed

  return (
    <div>
      {/* {console.log(dse)} */}
      {formData.personalDetails.admissionType.trim() === "DSE ACAP" ? (
        <AcapPreferencesForm
          ref={ref}
          formData={formData}
          setFormData={setFormData}
          setError={setError}
        />
      ) : (
        <PreferenceFormAdmin
          ref={ref}
          formData={formData}
          dbRetrival={dbRetrival}
          setFormData={setFormData}
          setError={setError}
        />
      )}
    </div>
  );
});

export default Conditionalpreference;
