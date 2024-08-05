import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"; //bootstrap.bundle.min.js / bootstrap.bundle.js

import "./FeeStructure.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const back_url = "http://localhost:3001";

function FeeStructure() {
  const [feeStructure, setFeeStructure] = useState([]);

  useEffect(() => {
    axios.get(`${back_url}/feeStructure`)
      .then((response) => {
        setFeeStructure(response.data);
        console.log("Data fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const [admissionYear, setAdmissionYear] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [developmentFee, setDevelopmentFee] = useState("");
  const [examFee, setExamFee] = useState("");
  const [miscellaneousFee, setMiscellaneousFee] = useState("");

  const handleAutoFill = () => {
    const found = feeStructure.find(fee => fee.admission_year === Number(admissionYear));
    if (found) {
      setTuitionFee(found.tuition_fee);
      setDevelopmentFee(found.development_fee);
      setExamFee(found.exam_fee);
      setMiscellaneousFee(found.misc_fee);
    } else {
      setTuitionFee("");
      setDevelopmentFee("");
      setExamFee("");
      setMiscellaneousFee("");
    }
  };

  const handleUpload = async() => {
    const feeData = {
      admissionYear,
      tuitionFee,
      developmentFee,
      examFee,
      miscellaneousFee,
    };
    console.log("Uploading data:", feeData);
    try {
      const response = await axios.post(`${back_url}/fee-structure-upload`, feeData);
      console.log("Data uploaded successfully:", response.data);
      // Fetch the updated data after successful upload
      const updatedResponse = await axios.get(`${back_url}/feeStructure`);
      setFeeStructure(updatedResponse.data);
    } catch(error) {
      console.error("Error uploading data:", error);
    }
    window.location.reload();
  };

  const handleUpdate = async() => {
    const feeData = {
      admissionYear,
      tuitionFee,
      developmentFee,
      examFee,
      miscellaneousFee,
    };
    console.log("Uploading data:", feeData);
    try {
      const response = await axios.put(`${back_url}/fee-structure-update`, feeData);
      console.log("Data updated successfully:", response.data);
      
      
    } catch(error) {
      console.error("Error uploading data:", error);
    }
    window.location.reload();
  };
  console.log("Rendering component. Current feeStructure:", feeStructure);

  return (
    <>
      <div className="title">
        <h2>Upload fee structure</h2>
      </div>

      <div className="fee-input">
        <div className="input-group mb-3">
          <span className="input-group-text inputfee-width" id="inputGroup-sizing-default">
            Select Admission year
          </span>
          <input
            type="number"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={admissionYear}
            onChange={(e) => setAdmissionYear(e.target.value)}
            onBlur={handleAutoFill}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputfee-width" id="inputGroup-sizing-default">
            Tuition Fee
          </span>
          <input
            type="number"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={tuitionFee}
            onChange={(e) => setTuitionFee(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputfee-width" id="inputGroup-sizing-default">
            Development fee
          </span>
          <input
            type="number"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={developmentFee}
            onChange={(e) => setDevelopmentFee(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputfee-width" id="inputGroup-sizing-default">
            Exam fee
          </span>
          <input
            type="number"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={examFee}
            onChange={(e) => setExamFee(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text inputfee-width" id="inputGroup-sizing-default">
            Miscellaneous fee
          </span>
          <input
            type="number"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            value={miscellaneousFee}
            onChange={(e) => setMiscellaneousFee(e.target.value)}
          />
        </div>
        <div className="row">
            <div className="col">
            <button type="button" className="btn upload-btn" onClick={handleUpload}>Upload</button>
            </div>
            <div className="col">
            <button type="button" className="btn upload-btn" onClick={handleUpdate}>Update</button>
            </div>
        </div>
        
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Admission Year</th>
              <th scope="col">Tuition fee</th>
              <th scope="col">Development fee</th>
              <th scope="col">Exam fee</th>
              <th scope="col">Miscellaneous fee</th>
              <th scope="col">Total fee</th>
            </tr>
          </thead>
          <tbody>
            {feeStructure.map((row, index) => (
              <tr key={index}>
                <td>{row.admission_year}</td>
                <td>{row.tuition_fee}</td>
                <td>{row.development_fee}</td>
                <td>{row.exam_fee}</td>
                <td>{row.misc_fee}</td>
                <td>{Number(row.tuition_fee) + Number(row.development_fee) + Number(row.exam_fee) + Number(row.misc_fee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FeeStructure;