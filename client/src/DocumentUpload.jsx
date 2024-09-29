import React, { useState, useEffect } from 'react';

export default function DocumentUpload({ formData, setFormData, filePreviews,prevUploadedDoc, setFilePreviews, dbRetrival ,dse}) {
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});

  const documentsToUpload = [
     { label: "Passport size photo (compulsory)", field: "photo" },
            { label: "10th Marksheet (compulsory)", field: "marksheet10" },
            { label: "12th Leaving Certificate (compulsory)", field: "leavingCertificate12" },
            { label: "12th Marksheet (compulsory)", field: "marksheet12" },
            { label: "CBSE 12th Admit Card", field: "cbse12admitcard" },
            { label: "CET Marksheet", field: "cetMarksheet" },
            { label: "JEE Marksheet", field: "jeeMarksheet" },
            { label: "Domicile Certificate", field: "domicilecert" },
            { label: "Caste Certificate", field: "castecertificate" },
            { label: "Caste Validity", field: "castevalidity" },
            { label: "Non creamy layer", field: "noncreamylayer" },
            { label: "Income Certificate", field: "income" },
            { label: "Transaction Proof / DD Proof (compulsory)", field: "transactionproof" },
            // { label: "FC Verification Copy (compulsory)", field: "fcverificationcopy" },
            { label: "cap Allotment Letter (compulsory if admitted via cap)", field: "capAllotmentLetter" },
            { label: "Other Documents", field: "other" },
            { label: "Signature (compulsory)", field: "signature" },
]


const dseDocumentsToUpload = [
         { label: "Passport size photo (compulsory)", field: "photo" },
         { label: "10th Marksheet (compulsory)", field: "marksheet10" },
         { label: "Leaving Certificate (compulsory)", field: "leavingCertificate12" },
         { label: "12th Marksheet ", field: "marksheet12" },
         { label: "CBSE 12th Admit Card", field: "cbse12admitcard" },
        //  { label: "CET Marksheet", field: "cetMarksheet" },
        //  { label: "JEE Marksheet", field: "jeeMarksheet" },
         { label: "Domicile Certificate", field: "domicilecert" },
         { label: "Caste Certificate", field: "castecertificate" },
         { label: "Caste Validity", field: "castevalidity" },
         { label: "Non creamy layer", field: "noncreamylayer" },
         { label: "Income Certificate", field: "income" },
         { label: "migration (compulsory)", field: "migration" },
         
         { label: "diploma provisional marksheet (compulsory)", field: "diplomaProvisionalMarksheetEquivalent" },
        //  { label: "diploma provisional marksheet Equivalence ", field: "diplomaProvisionalMarksheetEquivalent" },

         { label: "Transaction Proof / DD Proof (compulsory)", field: "transactionproof" },
         // { label: "FC Verification Copy (compulsory)", field: "fcverificationcopy" },
         { label: "cap Allotment Letter (compulsory if admitted via cap)", field: "capAllotmentLetter" },
         { label: "Other Documents", field: "other" },
         { label: "Signature (compulsory)", field: "signature" },
]


const prevUploadedLabels = new Set(prevUploadedDoc.map(doc => doc.label));

const docToRender = ((dse==='DSE' || dse==='DSE ACAP' || dse==="DSE MINORITY") ? dseDocumentsToUpload : documentsToUpload).filter(doc => !prevUploadedLabels.has(doc.field));
if (!docToRender.some(doc => doc.field === "transactionproof")) {
  docToRender.push({ label: "Transaction Proof / DD Proof (compulsory)", field: "transactionproof" });
}
console.log(docToRender)

  const updatePathOfPrevUploadedDoc =()=>{
    if(prevUploadedDoc.length ===0){
      return;
    }
    console.log(prevUploadedDoc);
    const updatedUploads = { ...formData.documentUpload };

    for (let i = 0; i < prevUploadedDoc.length; i++) {
      let path = prevUploadedDoc[i].value;
      let field = prevUploadedDoc[i].label;
      // Update path
      path = path.replace('public\\', 'admissions\\');
      // Update formData
      updatedUploads[field] = path;
      console.log(updatedUploads[field]);
    }

    setFormData(prevData => ({
      ...prevData,
      documentUpload: updatedUploads
    }));
  }
  useEffect(() => {
    updatePathOfPrevUploadedDoc();
  }, []);

// console.log(docToRender)

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 250 * 1024; // 250 KB

      if (!validTypes.includes(file.type)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.'
        }));
        setValidations(prevValidations => ({
          ...prevValidations,
          [field]: null
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: 'File size exceeds 250 KB.'
        }));
        setValidations(prevValidations => ({
          ...prevValidations,
          [field]: null
        }));
        return;
      }

      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: null
      }));

      setValidations(prevValidations => ({
        ...prevValidations,
        [field]: 'Valid'
      }));

      setFilePreviews(prevPreviews => ({
        ...prevPreviews,
        [field]: URL.createObjectURL(file)
      }));

      setFormData(prevFormData => ({
        ...prevFormData,
        documentUpload: {
          ...prevFormData.documentUpload,
          [field]: file
        }
      }));
    }
  };

  const compulsoryFields = ['photo', 'marksheet10', 'leavingCertificate12', 'marksheet12', 'signature', 'transactionproof'];

  const isFormValid = () => {
    for (let field of compulsoryFields) {
      if (!formData.documentUpload || !formData.documentUpload[field]) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      // Proceed to the next step
      console.log("Proceeding to the next step");
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        form: 'Please upload all compulsory documents before proceeding.'
      }));
    }
  };

  return (
    <div>
      <h1 className="center page-heading">Document Uploading</h1>
      {dse !=='DSE' || dse !=='DSE ACAP' || dse !=="DSE MINORITY" &&(<center> <h5>(Please upload either your JEE marksheet or CET marksheet, based on your attempts in JEE , CET , or both .)</h5> </center>)}
      <table className="course-table">
        
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Upload</th>
            <th>Preview</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {docToRender.map((doc, index) => (
            <tr key={index}>
              <th>{doc.label}</th>
              <td>
                <input
                  type="file"
                  name="files"
                  // disabled={
                  //   dbRetrival && initialDocuments[doc.field] !== undefined && initialDocuments[doc.field] !== null
                  // }
                  onChange={(e) => handleFileChange(e, doc.field)}
                />
              </td>
              <td>
                {filePreviews[doc.field] && (
                  <div>
                    {doc.field === "photo" || doc.field === "signature" ? (
                      <img src={filePreviews[doc.field]} alt={`${doc.label} preview`} width="100" />
                    ) : (
                      <a href={filePreviews[doc.field]} target="_blank" rel="noopener noreferrer">View {doc.label}</a>
                    )}
                  </div>
                )}
              </td>
              <td>
                {errors[doc.field] && (
                  <div className="error">{errors[doc.field]}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      {/* <button onClick={handleNext}>Next</button> */}
      {/* {errors.form && <div className="error">{errors.form}</div>} */}
    </div>
  );
}
