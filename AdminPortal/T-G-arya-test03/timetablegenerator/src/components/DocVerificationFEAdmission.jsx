import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./DocVerification.css";

import axios from "axios";
import { formControlClasses } from "@mui/material";

function DocVerificationFEAdmission() {
  const location = useLocation();
  const { uidRecieved } = location.state || {};

  const [DocVerificationData, setDocVerificationData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  console.log(uidRecieved);
  //Documents that are not approved  are added to NotApprovedDocument Array
  let NotApprovedDocument = [];
  let RejectedDocument = [];
  let ApprovedDocument = [];

  useEffect(() => {
    if (uidRecieved) {
      axios
        .get(`http://localhost:3001/docverificationFEAdmission/${uidRecieved}`)
        .then((response) => {
          setDocVerificationData(response.data);
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [uidRecieved]);

  ///Finding Documents that have been uploaded by User
  const documentsNotUploaded = [];
  const allPossibleDocuments = [
    "photo",
    "marksheet10",
    "leavingCertificate12",
    "marksheet12",
    "cetMarksheet",
    "jeeMarksheet",
    "domicilecert",
    "castecertificate",
    "castevalidity",
    "noncreamylayer",
    "income",
    "other",
    "signature",
    "admissiontransactionproof",
    
  ];

  function findDisjoint(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const disjointFromArr1 = arr1.filter((item) => !set2.has(item));
    const disjointFromArr2 = arr2.filter((item) => !set1.has(item));

    return [...disjointFromArr1, ...disjointFromArr2];
  }
  ///Document which are not uploaded are added to documentsNotUploaded array
  for (const key in DocVerificationData[0]) {
    if (Object.hasOwnProperty.call(DocVerificationData[0], key)) {
      const value = DocVerificationData[0][key];
      if (value === null || value === "") {
        documentsNotUploaded.push(key);
      }
    }
  }

  for (const key in DocVerificationData[0]) {
    if (Object.hasOwnProperty.call(DocVerificationData[0], key)) {
      const value = DocVerificationData[0][key];
      if (value === "Not Approved") {
        NotApprovedDocument.push(key);
      } else if (value === "Rejected") {
        RejectedDocument.push(key);
      } else if (value === "Approved") {
        ApprovedDocument.push(key);
      }
    }
  }
  //Function to remove the Status string from each array
  function removeStatusSuffix(statusesArray) {
    return statusesArray.map((status) => status.replace("Status", ""));
  }

  NotApprovedDocument = removeStatusSuffix(NotApprovedDocument);
  ApprovedDocument = removeStatusSuffix(ApprovedDocument);
  RejectedDocument = removeStatusSuffix(RejectedDocument);

  console.log(NotApprovedDocument);
  console.log(ApprovedDocument);
  console.log(RejectedDocument);

  //Array of documents uploaded
  const documentUploaded = findDisjoint(
    allPossibleDocuments,
    documentsNotUploaded
  );
  console.log("Uploaded Documents : ", documentUploaded);
  console.log("Uploaded Documents length : ", documentUploaded.length);

  console.log("Not uploaded Documents", documentsNotUploaded);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const navigateToReceipt = () => {
    navigate("/receitGeneration");
  };

  // const [rejectedDocuments, setRejectedDocuments] = useState([]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "12th Marksheet",
      dbcol: "marksheet12",
      preview: "This is the preview of Document 1",
    },
    {
      id: 2,
      name: "10th Marksheet",
      dbcol: "marksheet10",
      preview: "This is the preview of Document 2",
    },
    {
      id: 3,
      name: "CET Marksheet",
      dbcol: "cetMarksheet",
      preview: "This is the preview of Document 3",
    },
    {
      id: 4,
      name: "JEE Marksheet",
      dbcol: "jeeMarksheet",
      preview: "This is the preview of Document 4",
    },
    {
      id: 5,
      name: "Caste Certificate",
      dbcol: "castecertificat",
      preview: "This is the preview of Document 5",
    },
    {
      id: 6,
      name: "Signature",
      dbcol: "signature",
      preview: "This is the preview of Document 6",
    },
    {
      id: 7,
      name: "Domicile Certificate",
      dbcol: "domicilecert",
      preview: "This is the preview of Document 7",
    },
    {
      id: 8,
      name: "Caste Validity",
      dbcol: "castevalidity",
      preview: "This is the preview of Document 8",
    },
    {
      id: 9,
      name: "Non Creamy Layer",
      dbcol: "noncreamylayer",
      preview: "This is the preview of Document 9",
    },
    {
      id: 10,
      name: "12th Leaving Certificate",
      dbcol: "leavingCertificate12",
      preview: "This is the preview of Document 10",
    },
    {
      id: 11,
      name: "Income Certificate",
      dbcol: "income",
      preview: "This is the preview of Document 11",
    },
    {
      id: 12,
      name: "Passport-size photo",
      dbcol: "photo",
      preview: "This is the preview of Document 12",
    },
    {
      id: 13,
      name: "Other Document",
      dbcol: "other",
      preview: "This is the preview of Document 13",
    },
    {
      id: 14,
      name: "Transaction Proof",
      dbcol: "admissiontransactionproof",
      preview: "This is the preview of Document 14",
    },
  ]);

  const handlePreview = async (docName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/docverificationFEAdmission/${DocVerificationData[0].id}/${docName}`
      );
      console.log("Response Data:", response.data); // Log the entire response data

      // Check if response has data and is an array with at least one element
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Extract URLpre from the first element of the response array
        const keyNames = Object.keys(response.data[0]); // Get all keys from the first element

        // Assuming the key to be used is the first key found in the response
        const firstKey = keyNames[0];
        const URLpre = response.data[0][firstKey];

        // Replace backslashes with forward slashes
        function replaceBackslashWithSlash(inputString) {
          return inputString.replace(/\\/g, "/");
        }

        function replacePublic(inputString) {
          return inputString.replace("public", "");
        }

        let actualURL = replaceBackslashWithSlash(URLpre);
        actualURL = replacePublic(actualURL);

        console.log("Key Name:", firstKey);
        console.log("URLpre:", URLpre);
        console.log(actualURL);

        // Make another request to fetch the actual file
        const fileResponse = await axios.get(
          `http://localhost:3001/files/${actualURL}`,
          {
            responseType: "blob", // Important for binary data
          }
        );

        // Create a URL for the received file
        const fileURL = window.URL.createObjectURL(fileResponse.data);
        console.log("File URL:", fileURL);

        // Open the file in a new tab
        window.open(fileURL, "_blank");
      } else {
        console.error("Empty or invalid response data");
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  const handleApprove = async (docName) => {
    try {
      const URL = `http://localhost:3001/approveDocFEAdmission/${DocVerificationData[0].id}/${docName}`;
      console.log(URL);
      const response = await axios.put(
        `http://localhost:3001/approveDocFEAdmission/${DocVerificationData[0].id}/${docName}`,
        {
          // fieldToUpdate: 'status',  // Replace with your specific field to update
          // updatedValue: 'approved'  // Replace with the value to update
        }
      );
      console.log(`${docName} Approved`);
      console.log(response.data); // Log the response from server
      // Optionally, update local state or perform other actions upon successful approval
    } catch (error) {
      console.error("Error approving document:", error);
      // Handle error scenarios as needed
    }
    window.location.reload();
  };

  const handleReject = async (docName) => {
    try {
      const URL = `http://localhost:3001/rejectDocFEAdmission/${DocVerificationData[0].id}/${DocVerificationData[0].email}/${docName}`;
      console.log(URL);
      const response = await axios.put(
        `http://localhost:3001/rejectDocFEAdmission/${DocVerificationData[0].id}/${DocVerificationData[0].email}/${docName}`,
        {
          // fieldToUpdate: 'status',  // Replace with your specific field to update
          // updatedValue: 'approved'  // Replace with the value to update
        }
      );
      console.log(`${docName} Rejected`);
      console.log(response.data); // Log the response from server
      // Optionally, update local state or perform other actions upon successful approval
    } catch (error) {
      console.error("Error approving document:", error);
      // Handle error scenarios as needed
    }
    window.location.reload();
  };

  //Handling reupload
  const [selectedFile,setSelectedFile] = useState(null);
  const handleFileChange = (event)=>{
    setSelectedFile(event.target.files[0]);
  }
  const handleUpload = async (email, docName) => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('docName', docName);
    formData.append('file', selectedFile);
    
    
    for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

    try {
      // const response = await axios.post('http://localhost:3001/reupload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
          
      //   },
      // });
      const response = await fetch('http://localhost:3001/reuploadFEAdmission',{
        method: 'POST',
        body: formData,
      })
      console.log('File uploaded from FE Admission check successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };




  const handleReceiptDocument = async () => {
    const confirmAction = window.confirm("Are you sure?");

    if (confirmAction) {
      try {
        const URL = `http://localhost:3001/DocumentsApproved/${DocVerificationData[0].id}`;
        console.log(URL);
        const response = await axios.put(URL);
        console.log(`All Documents Approved`);
        console.log(response.data);
        // Log the response from server
        // Optionally, update local state or perform other actions upon successful approval
      } catch (error) {
        console.error("Error approving document:", error);
        // Handle error scenarios as needed
      }
      console.log(ApprovedDocument);
      // const uidtoSend = uidRecieved;

      navigate("/feeReceipt", {
        state: {
          
          uidtoSend: uidRecieved,
          fullName: DocVerificationData[0].fullname,
          email : DocVerificationData[0].email,
        },
      });

      // window.location.reload(); // Reload the page after operation
    } else {
      // Handle if user chooses not to continue (optional)
      console.log("Operation cancelled by user");
    }

    // try {
    //   const URL = `http://localhost:3001/DocumentsApproved/${DocVerificationData[0].id}`;
    //   console.log(URL);
    //   const response = await axios.put(
    //     `http://localhost:3001/DocumentsApproved/${DocVerificationData[0].id}`,

    //   );
    //   console.log(`All Documents Approved`);
    //   console.log(response.data); // Log the response from server
    //   // Optionally, update local state or perform other actions upon successful approval
    // } catch (error) {
    //   console.error("Error approving document:", error);
    //   // Handle error scenarios as needed
    // }
    // window.location.reload();
  };

  ///////////////////////////Handling Reupload Button///////////////////////////////////////
  // const [file, setFile] = useState(null);

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   setFile(selectedFile);
  // };
  // const handleUpload = (emailId, docName) => {
  //   if (file) {
  //     const formData = new FormData();
  //     const email = emailId;
  //     formData.append("file", file);
  //     formData.append("docName", JSON.stringify(docName));
  //     formData.append("email", JSON.stringify(email));

  //     for (let [key, value] of formData.entries()) {
  //       console.log(`${key}: ${value}`);
  //     }

  //     console.log("FormData.email = ", JSON.stringify(formData[email]));

  //     axios
  //       .post("http://localhost:3001/reupload", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         console.log("File uploaded successfully");
  //         // Handle success, e.g., show a success message
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading file: ", error);
  //         // Handle errors, e.g., show an error message
  //       });
  //   } else {
  //     // Handle case where no file is selected
  //     console.warn("No file selected");
  //   }
  // };
  //////////////////////////////////////////////////////////////////////////////////////////

  // const handleReupload = (id, event) => {
  //   const file = event.target.files[0];
  //   console.log(`Reuploaded document with ID: ${id}`, file);

  //   const updatedDocuments = documents.map((doc) =>
  //     doc.id === id
  //       ? { ...doc, preview: window.URL.createObjectURL(file) }
  //       : doc
  //   );

  //   setDocuments(updatedDocuments);
  // };

  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching data
  }

  if (DocVerificationData.length === 0) {
    return <div>No data available</div>; // Render a message if there's no data
  }

  return (
    <>
      <div className="title">
        <div className="row">
          <div className="col-1">
            <button
              type="button"
              onClick={handleBackClick}
              className="btn backbtn"
            >
              Back
            </button>
          </div>
          <div className="col-11 titlepage">
            <h2>Documents and Transaction Approval</h2>
          </div>
        </div>
      </div>
      <div className="documents-container">
        <div className="row verify-row1">
          <div className="col-1 verify-col">
            <img
              className="img-style"
              src="C:\Users\Arya\OneDrive\Documents\GitHub\T-G\timetablegenerator\documents\student pic.jpeg"
              alt="Profile pic"
            />
          </div>
          <div className="col-9 verify-col2">
            <div className="row verify-row2">
              <div className="col">
                <b>Name</b>: {DocVerificationData[0].fullname}
              </div>
              <div className="col">
                <b>Email</b>: {DocVerificationData[0].email}
              </div>
              <div className="col">
                <b>Mobile number</b>: {DocVerificationData[0].mobile_number}
              </div>
            </div>
            <div className="row verify-row2">
              <div className="col">
                <b>Application number</b>: 1718437327903
              </div>
              <div className="col">
                <b>JEE seat number</b>:{" "}
                {DocVerificationData[0].jee_application_number}
              </div>
              <div className="col">
                <b>CET seat number</b>:{" "}
                {DocVerificationData[0].cet_application_id}
              </div>
            </div>
            <div className="row verify-row2">
              <div className="col">
                <b>Annual Income</b>: {DocVerificationData[0].annual_income}
              </div>
              <div className="col">
                <b>Category</b>: {DocVerificationData[0].category}
              </div>
              <div className="col">
                <b>Applied TFWS</b>: No
              </div>
            </div>
          </div>
        </div>
        {DocVerificationData[0].documentsApproved === "Approved" && (
          <>
            <div className="generate-receipt2">
              <div className="row doc-row">
                <div className="col doc-Submitted">
                  All Documents Submitted and Approved
                </div>
              </div>
            </div>
            <div className="generate-receipt">
              <div className="row">
                <button
                  className="btn receipt-btn"
                  onClick={() => {
                    handleReceiptDocument();
                  }}
                >
                  Generate Receipt
                </button>
              </div>
            </div>
          </>
        )}
        
        {DocVerificationData[0].documentsApproved === "Not Approved" && (
          <div className="doc-container">
            {documents
              .filter((doc) => documentUploaded.includes(doc.dbcol))
              .map((row) => (
                <div className="row doc-row" key={row.id}>
                  <div className="col arbtn">
                    <b>{row.name}</b>
                  </div>
                  <div className="col arbtn">
                    <b>
                      Status : {DocVerificationData[0][`${row.dbcol}Status`]}
                    </b>
                  </div>
                  <div className="col">
                    <button
                      className="btn arbtn preview-btn"
                      onClick={() => {
                        handlePreview(row.dbcol);
                      }}
                    >
                      Preview
                    </button>
                  </div>

                  <div className="col">
                    <div className="row btn-row">
                      <button
                        type="button"
                        className="btn btn-success arbtn"
                        onClick={() => handleApprove(row.dbcol)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger arbtn"
                        onClick={() => handleReject(row.dbcol)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  {RejectedDocument.includes(row.dbcol) && (
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile02"
                        onChange={handleFileChange}
                      />
                      <label
                        className="input-group-text"
                        htmlFor="inputGroupFile02"
                        onClick={() => {
                          handleUpload(DocVerificationData[0].email, row.dbcol);
                        }}
                      >
                        Reupload
                      </label>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {ApprovedDocument.length === documentUploaded.length && (
          <div className="generate-receipt">
            <div className="row">
              <button
                className="btn receipt-btn"
                onClick={() => {
                  handleReceiptDocument();
                }}
              >
                Generate Receipt + Add to Merit list
              </button>
            </div>
          </div>
        )}
        {DocVerificationData[0].documentsApproved === "Not Approved" &&
          ApprovedDocument.length !== documentUploaded.length && (
            <div className="generate-receipt">
              <div className="row">
                <button className="btn receipt-btn" disabled>
                  Generate Receipt
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

export default DocVerificationFEAdmission;