import React, { useState, forwardRef } from 'react';
import DseAdmissionForm from './dseAdmissionForm.jsx';
import AdmissionForm2 from './AdmissionForm2';
// import React, { forwardRef } from 'react';

const ConditionalAdmission = forwardRef(({ dbRetrival, formData1, userId, filePreviews, formDataB, setFormDataB, setError }, ref) => {
  return (
    <div>
      {formDataB.personalDetails.admissionType.trim() === "DSE ACAP" || formDataB.personalDetails.admissionType.trim() === "DSE"  || formDataB.personalDetails.admissionType.trim() === "DSE MINORITY" ? (
        <DseAdmissionForm
          ref={ref} // Forward the ref here if `DseAdmissionForm` accepts refs
          formDataB={formDataB}
          setFormDataB={setFormDataB}
          filePreviews={filePreviews}
          formData1={formData1} 
          userId={userId} 
          setError={setError}
        />
      ) : (
        <AdmissionForm2
          ref={ref} // Forward the ref here if `AdmissionForm2` accepts refs
          formDataB={formDataB}
          setFormDataB={setFormDataB}
          filePreviews={filePreviews} 
          formData1={formData1}
          userId={userId} 
          setError={setError}
        />
      )}
    </div>
  );
});

export default ConditionalAdmission;
