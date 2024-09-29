import React, { useState } from 'react';

export default function DocumentUpload({formData, setFormData}) {
  const [filePreviews, setFilePreviews] = useState({});

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFilePreviews({
        ...filePreviews,
        [field]: URL.createObjectURL(file)
      });
      setFormData({
        ...formData,
        documentUpload: {
          ...formData.documentUpload,
          [field]: file
        }
      });
    }
  };

  return (
    <div>
      <h1 className="center page-heading">Document Uploading</h1>
      <table className="course-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Upload</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Passport size photo", field: "photo" },
            { label: "10th Marksheet", field: "marksheet10" },
            { label: "12th Leaving Certificate", field: "leavingCertificate12" },
            { label: "12th Marksheet", field: "marksheet12" },
            { label: "CET Marksheet", field: "cetMarksheet" },
            { label: "JEE Marksheet", field: "jeeMarksheet" },
            { label: "Signature", field: "signature" },
          ].map((doc, index) => (
            <tr key={index}>
              <th>{doc.label}</th>
              <td><input type="file" name="files" onChange={(e) => handleFileChange(e, doc.field)} /></td>
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
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
    </div>
  );
}
