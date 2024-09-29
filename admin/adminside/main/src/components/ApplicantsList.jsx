import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"; //bootstrap.bundle.min.js / bootstrap.bundle.js
import "./ApplicantsList.css";
import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function ApplicantsList() {

  const [AdmissionType, setAdmissionType] = useState("Brochure Institute Level");
  const AdmissionTypeBrochureInstituteLevel = () => {
    setAdmissionType("Brochure Institute Level");
  };
  const AdmissionTypeAdmission = () => {
    setAdmissionType("Admission");
  };



  const [Class, setClass] = useState("FE");
  const setClassFE = ()=>{
    setClass("FE");
  };
  const setClassSE = ()=>{
    setClass("SE");
  };
  const setClassTE = ()=>{
    setClass("TE");
  };
  const setClassBE = ()=>{
    setClass("BE");
  };


  const [DocStatus, setDocStatus] = useState("Not Approved");
  const setDocStatusApproved = ()=>{
    setDocStatus("Approved");
  };
  const setDocStatusNotApproved = ()=>{
    setDocStatus("Not Approved");
  };
  const setDocStatusRejected = ()=>{
    setDocStatus("Rejected");
  };

  const [TransactionStatus, setTransactionStatus] = useState("Not Approved");
  const setTransactionStatusApproved = ()=>{
    setTransactionStatus("Approved");
  }
  const setTransactionStatusNotApproved = ()=>{
    setTransactionStatus("Not Approved");
  }
  const setTransactionStatusRejected= ()=>{
    setTransactionStatus("Rejected");
  }


////Used for displaying content in table
  const [data2, setData] = useState([]);

  const fetchData = async () => {
    if(AdmissionType === 'Admission' && Class === 'FE'){
      try {
        const response = await axios.get('http://localhost:3001/FEadmissiondata', {
          params: {
            class: Class,
            admissionType: AdmissionType
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    }
    else if(AdmissionType === 'Admission' && Class !== 'FE'){
      try {
        const response = await axios.get('http://localhost:3001/higheradmissiondata', {
          params: {
            class: Class,
            admissionType: AdmissionType
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    }
    else if(AdmissionType === 'Brochure Institute Level'){
      try {
        const response = await axios.get('http://localhost:3001/brochuredata', {
          params: {
            class: Class,
            admissionType: AdmissionType
          }
        });        setData(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    }
    
  };

  useEffect(() => {
    fetchData();
  }, [Class, AdmissionType]);

  useEffect(() => {
    // This useEffect will run whenever `data2` changes.
    console.log(data2); // Logs the updated state.
  }, [data2]);

  // useEffect(() => {
  //   // This useEffect will run whenever `data2` changes.
  //   console.log(data2); // Logs the updated state.
  // }, [data2]); 
  

  const navigate = useNavigate();
  const navigateToDocVerification = (uid) => {
    const data = { uidRecieved : uid };
    console.log(data);
    navigate('/documentverification', { state: data });
  };


  ///Navigate for docverifcation FE admission
  const navigateToDocVerificationFEAdmission = (uid) => {
    const data = { uidRecieved : uid };
    console.log(data);
    navigate('/documentverificationFEAdmission', { state: data });
  };
  // const docVerificationPage = (name, applicationNumber) =>
  //   navigate("/documentverification ", { state: { name, applicationNumber } });

  return (
    <>
      <div className="title">
        <h2>Applicants list </h2>
      </div>
    
      <div className="search-container">
        <div className="row search-bar-row">
          <div className="col-1">
            <div className="col-1 search-bar-icon "> <b>Search</b></div>
          </div>
          <div className="col-10">
            <div className="row ">
              <div className="row admissionSelectButton">
                <div className="col-6 row1col1 ">
                  <div className="row">
                    <div className="col-4">Admission Type </div>
                    <div className="col-8">
                      <div className="dropdown dropdown-btn |">
                        <div className="dropdown SelectButton">
                          <button
                            className="btn btn-secondary dropdown-toggle typeSelect"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {AdmissionType}
                          </button>
                          <ul className="dropdown-menu">
                            <li
                              className="dropdown-item"
                              onClick={AdmissionTypeBrochureInstituteLevel}
                            >
                              Brochure Institute Level
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={AdmissionTypeAdmission}
                            >
                              Admission
                            </li>
                            
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 row1col1">
                  <div className="row">
                    <div className="col-4">Select Class</div>
                    <div className="col-8">
                      <div className="dropdown dropdown-btn SelectButton">
                        <div className="dropdown SelectButton">
                          <button
                            className="btn btn-secondary dropdown-toggle typeSelect"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {Class}
                          </button>
                          <ul className="dropdown-menu">
                            <li
                              className="dropdown-item"
                              onClick={setClassFE}
                            >
                              FE
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setClassSE}
                            >
                              SE
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setClassTE}
                            >
                              TE
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setClassBE}
                            >
                              BE
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row ">
              <div className="row admissionSelectButton">
                <div className="col-6 row1col1 admission-type">
                  <div className="row">
                    <div className="col-4">Documents Status</div>
                    <div className="col-8">
                      <div className="dropdown dropdown-btn ">
                        <div className="dropdown SelectButton">
                          <button
                            className="btn btn-secondary dropdown-toggle typeSelect"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {DocStatus}
                          </button>
                          <ul className="dropdown-menu">
                            <li
                              className="dropdown-item"
                              onClick={setDocStatusApproved}
                            >
                              Approved
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setDocStatusNotApproved}
                            >
                              Not Approved
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setDocStatusRejected}
                            >
                              Rejected
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 row1col1">
                  <div className="row">
                    <div className="col-4">Transaction Status</div>
                    <div className="col-8">
                      <div className="dropdown dropdown-btn ">
                        <div className="dropdown SelectButton">
                          <button
                            className="btn btn-secondary dropdown-toggle typeSelect"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {TransactionStatus}
                          </button>
                          <ul className="dropdown-menu">
                            <li
                              className="dropdown-item"
                              onClick={setTransactionStatusApproved}
                            >
                              Approved
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setTransactionStatusNotApproved}
                            >
                              Not Approved
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={setTransactionStatusRejected}
                            >
                              Rejected
                            </li>
                           
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      {(AdmissionType === 'Admission' && Class === 'FE' )&& 
        <>
          <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">UID</th>
              <th scope="col">Name</th>
              <th scope="col">Year</th>
              <th scope="col">Admission Type</th>
              <th scope="col">Document Status</th>
              <th scope="col">Transaction status</th>
              <th scope="col">Verify</th>
            </tr>
          </thead>
          <tbody>
            
            {data2.map((row, index) => {
              if(row.documentsApproved === DocStatus && row.admissiontransactionproofStatus === TransactionStatus){
                return(
                
                  <tr key={row.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{row.id}</td>
                          <td>{row.fullname}</td>
                          <td>{row.class}</td>
                          <td>Admission</td>
                          <td>{row.documentsApproved}</td>
                          <td>{row.admissiontransactionproofStatus}</td>
                          
                          <td>
                            <button
                              type="button"
                              onClick={()=>{navigateToDocVerificationFEAdmission(row.id)}}
                              
                              className="btn verify-btn"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
        </>
      }
      {(AdmissionType === 'Admission' && (Class === 'SE' || Class === 'TE' || Class === 'BE' ) )&& 
        <>
          <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">UID</th>
              <th scope="col">Name</th>
              <th scope="col">Year</th>
              <th scope="col">Admission Type</th>
              <th scope="col">Document Status</th>
              <th scope="col">Transaction status</th>
              <th scope="col">Verify</th>
            </tr>
          </thead>
          <tbody>
            
            {data2.map((row, index) => {
              if(row.documentsApproved === DocStatus && row.admissiontransactionproofStatus === TransactionStatus && row.class === Class){
                return(
                
                  <tr key={row.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{row.id}</td>
                          <td>{row.fullname}</td>
                          <td>{row.class}</td>
                          <td>Admission</td>
                          <td>{row.documentsApproved}</td>
                          <td>{row.admissiontransactionproofStatus}</td>
                          
                          <td>
                            <button
                              type="button"
                              onClick={()=>{navigateToDocVerification(row.id)}}
                              
                              className="btn verify-btn"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
        </>
      }
      {AdmissionType === 'Brochure Institute Level' && 
        <>
          <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">UID</th>
              <th scope="col">Name</th>
              <th scope="col">Application number</th>
              <th scope="col">Admission Type</th>
              <th scope="col">Document Status</th>
              <th scope="col">Transaction status</th>
              <th scope="col">Verify</th>
            </tr>
          </thead>
          <tbody>
            
            {data2.map((row, index) => {
              if(row.documentsApproved === DocStatus && row.transactionproofStatus === TransactionStatus){
                return(
                
                  <tr key={row.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{row.id}</td>
                          <td>{row.fullname}</td>
                          <td>{row.cet_application_id}</td>
                          <td>Brochure Institute Level</td>
                          <td>{row.documentsApproved}</td>
                          <td>{row.transactionproofStatus}</td>
                          
                          <td>
                            <button
                              type="button"
                              onClick={()=>{navigateToDocVerification(row.id)}}
                              
                              className="btn verify-btn"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                )
              }
              
             
                      
               
            })}
          </tbody>
        </table>
      </div>
        </>
      }

      
    </>
  );
}

export default ApplicantsList;