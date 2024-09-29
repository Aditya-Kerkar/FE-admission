import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './AdmissionForm.css';
// import DownloadPDFButton from './DownloadPDFButton';

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import DocumentUpload from './DocumentUpload';

const DseAdmissionForm = forwardRef(({  formDataB, setFormDataB, filePreviews, setFilePreviews, formData1, userId, setFormData1}, ref) => {
    const componentRef = ref;
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

  const dateOfBirth = formDataB.personalDetails.dateofBirth instanceof Date
  ? formDataB.personalDetails.dateofBirth.toLocaleDateString()
  : '';



    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1; // Month is zero based, so we add 1
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    // Get current system date in dd-mm-yyyy format
    const currentDate = formatDate(new Date());
  
  const {
    personalDetails = {},
    academicDetails = {},
    cetDetails = {},
    documentUpload = {},
    transactionDetails = {},
    preferences = []
  } = formDataB; 


  const adjustDateForTimezone = (inputdate) => {
    console.log("check 1");
    // console.log(date);
    const date = new Date(inputdate);
    if (!(date instanceof Date)) {
      console.log("empty date returned")
      return ""; // Return original date if it's not a valid Date object
    }
  
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based index
    const day = ("0" + date.getDate()).slice(-2);
  
    return `${day}-${month}-${year}`;
  };
  
  // setFormDataB(dob);
 

  const back_url = process.env.REACT_APP_backUrl;

  const getImageUrl = (docname) => {
    // const extensions = ['jpg', 'jpeg', 'png'];
    // for (const ext of extensions) {
    //   const url = `${back_url}/admissionfiles/${formDataB.personalDetails.email}/${docname}.${ext}`;
    //   try {
    //     const response = await fetch(url, { method: 'HEAD' });
    //     console.log(response)
    //     if (response.ok) {
    //       return url; // Image exists, return the URL
    //     }
    //   } catch (error) {
    //     console.error(`Error fetching URL ${url}:`, error);
    //   }
    // }
    // return ''; // Return a default image or placeholder if no valid image is found
    console.log(typeof(formDataB.documentUpload[docname]))
    // if(typeof(formDataB.documentUpload[docname])==='String'){
      console.log(formDataB.documentUpload[docname])
      // console.log(formDataB.documentUpload.signature)
      let imgurl = `${back_url}/admissionfiles/${(formDataB.documentUpload[docname]).replace('admissions\\','').replace('\\','/')}`
      console.log(imgurl)
      return imgurl
    // }
  };


  return (
    <div id="pdf-content" ref={componentRef}>
      <form className="admission-form">
        <table className="form-table table1">
          <thead>
            {/* <tr>
              <th colSpan="4"> */}
                <div className="header">
                  <img src="/gstlogo.png" alt="SIES Logo" className="logo" />
                  <div className="header-left">
                    <div className="school-info">
                      <h2>SIES Graduate School of Technology</h2>
                      <p>Sri Chandrasekarendra Saraswati Vidyapuram Sector-V, Nerul, Navi Mumbai, Maharashtra 400706</p>
                      <p>Phone: 022 6108 2402</p>
                    </div>
                  </div>
                  <div className="header-right">  
                   
                  <img
                      src={filePreviews.photo ? filePreviews.photo : getImageUrl('photo')}
                      alt="Profile"
                      className="profile-photo"
                      onError={(e) => {
                        e.target.src = '/path/to/default-image.png'; // Fallback image
                      }}
                    />
                   
                    <tr>{currentDate}</tr> 
                  </div>
                </div>
              {/* </th>
            </tr> */}
            {/* <tr>
            <div className="header2-name">
                  <td>  

                  <p >{formDataB.personalDetails.fullName}</p><br />
                  </td>
                  <td>  

                  <p>{currentDate}</p>
                  </td>
            </div>
            </tr> */}
          </thead>
        </table>
        {/* <table>
          <tr>{formDataB.personalDetails.fullName}</tr>
          <tr>{currentDate}</tr>
          </table> */}
            
          <table className="form-table table2">
            <thead>
              <tr></tr>
              <tr>
              <th colSpan="4" className="title">
                <h3>DSE Year Admission Form (2024-25)</h3>
              </th>
            </tr>
            </thead>
            <tbody>
              {formDataB.personalDetails.admissionType.trim()==="DSE" || formDataB.personalDetails.admissionType.trim()==="DSE MINORITY" &&(

            <tr>
              <td className="label">Allotment Details</td>
              <td colSpan="3">
                <table className="inner-table">
                  <tbody>
                    <tr></tr>
                    <tr>
                      <td>Branch</td>
                      <td>{formDataB.preference}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
              )}
            <tr>
              <td className="label">Name</td>
              <td>{formDataB.personalDetails.fullName}</td>
              <td className="label">CET Application ID</td>
              <td>{formDataB.cetDetails.cetappId}</td>
            </tr>
            <tr>
              <td className="label">ID</td>
              <td>{userId}</td>
            </tr>
            <tr>
              <td className="label">Date of Birth</td>
              <td>{adjustDateForTimezone(formDataB.personalDetails.dateofBirth)}</td>
              <td className="label">Birth Place</td>
              <td>{(formDataB.personalDetails.birthPlace)}</td>
            </tr>
            <tr>
              <td className="label">Email Id</td>
              <td>{formDataB.personalDetails.email}</td>
            </tr>
            <tr>
              <td className="label">Mobile No.</td>
              <td>{formDataB.personalDetails.mobileNumber}</td>
            </tr>
            <tr>
              <td className="label">Father's Name</td>
              <td>{formDataB.personalDetails.fathersName}</td>
              <td className="label">Father's Occupation</td>
              <td>{formDataB.personalDetails.fathersOccupation}</td>
            </tr>
            <tr>
              <td className="label">Mobile No.</td>
              <td>{formDataB.personalDetails.fathersmobileNumber}</td>
            </tr>
            <tr>
              <td className="label">Mother's Name</td>
              <td>{formDataB.personalDetails.mothersName}</td>
              <td className="label">Mother's Occupation</td>
              <td>{formDataB.personalDetails.mothersOccupation}</td>
            </tr>
            <tr>
              <td className="label">Mobile No.</td>
              <td>{formDataB.personalDetails.mothersmobileNumber}</td>
            </tr>
            <tr>
              <td className="label">Annual Income</td>
              <td>{formDataB.personalDetails.annualIncome}</td>
            </tr>
            <tr>
              <td className="label">Gender</td>
              <td>{formDataB.personalDetails.sex}</td>
              <td className="label">Blood Group</td>
              <td>{formDataB.personalDetails.bloodGroup}</td>
            </tr>
            <tr>
              <td className="label">Correspondence Address</td>
              <td colSpan="3">{formDataB.personalDetails.corrAddr}</td>
            </tr>
            <tr>
              <td className="label">State</td>
              <td colSpan="3">{formDataB.personalDetails.state}</td>
            </tr>
            <tr>
              <td className="label">Permanent Address</td>
              <td colSpan="3">{formDataB.personalDetails.perAddr}</td>
            </tr>
            <tr>
              <td className="label">State</td>
              <td colSpan="3">{formDataB.personalDetails.state}</td>
            </tr>
            <tr>
              <td className="label">Area</td>
              <td>{formDataB.personalDetails.area}</td>
              <td className="label">Nationality</td>
              <td>{formDataB.personalDetails.nationality}</td>
            </tr>
            <tr className="spacer"></tr>
            <tr>
              <td className="label">Religion</td>
              <td>{formDataB.personalDetails.religion}</td>
              <td className="label">Category</td>
              <td>{formDataB.personalDetails.category}</td>
            </tr>
            <tr>
              <td className="label">Domicile</td>
              <td>{formDataB.personalDetails.domicile}</td>
              <td className="label">Mother Tongue</td>
              <td>{formDataB.personalDetails.mothersTongue}</td>
            </tr>
            </tbody>
                
            </table>
            <table className="form-table table3">
            <tbody>
              <tr></tr>
            {/* <tr className="sub-title"> */}
              {/* <td colSpan="4">JEE Details</td> */}
            {/* </tr> */}
            {/* <tr>
              <td className="label">JEE Application No</td>
              <td>{formDataB.cetDetails.jeeappNum}</td>
              <td className="label">JEE Percentile</td>
              <td>{formDataB.cetDetails.jeePer}</td>
            </tr> */}
            <tr className="sub-title">
              <td colSpan="4">Diploma Details</td>
            </tr>
            <tr>
              <td className="label">Passing Year</td>
              <td>{formDataB.academicDetails.diplomapassingyear}</td>
              <td className="label">Marks Obtained</td>
              <td>{formDataB.academicDetails.diplomamarksObtained}</td>
            </tr>
            <tr>
              <td className="label">Total Marks</td>
              <td>{formDataB.academicDetails.diplomatotalMarks}</td>
              <td className="label">Diploma Marks Percentage</td>
              <td>{formDataB.academicDetails.diplomaPercentage}</td>
            </tr>
            <tr>
              <td className="label">Diploma University or Board</td>
              <td>{formDataB.academicDetails.diplomaBoardOrUniversity}</td>
            </tr>
            <tr>
                <td className="label">Diploma College</td>
                <td>{formDataB.academicDetails.diplomacollage}</td>
            </tr>
            <tr className="sub-title">
              <td colSpan="4">HSC Details</td>
            </tr>
            <tr>
              <td className="label">HSC Maths Marks</td>
              <td>{formDataB.academicDetails.hscmathsMarks}</td>
              <td className="label">HSC Physics Marks</td>
              <td>{formDataB.academicDetails.hscphysicsMarks}</td>
            </tr>
            <tr>
              <td className="label">HSC Chemistry Marks</td>
              <td>{formDataB.academicDetails.hscchemistryMarks}</td>
              <td className="label">HSC PCM Percentage</td>
              <td>{formDataB.academicDetails.hscpcmPercentage}</td>
            </tr>
            <tr>
              <td className="label">HSC Vocational Subject Name</td>
              <td>{formDataB.academicDetails.hscvocationalSub}</td>
              <td className="label">HSC Vocational Subject Marks</td>
              <td>{formDataB.academicDetails.hscvocationalsubjectMarks}</td>
            </tr>
            <tr>
              <td className="label">HSC PMV Percentage</td>
              <td>{formDataB.academicDetails.hscvovationalsubjectPer}</td>
            </tr>
            <tr className="spacer2"></tr>
            <tr>
              <td className="label">Academic Qualification</td>
              <td colSpan="3">
                <table className="inner-table">
                  <tbody>
                    <tr></tr>
                    <tr>
                      <td>Exam Passed</td>
                      <td>Name of Board/University</td>
                      <td>Year of Passing</td>
                      <td>Total Marks</td>
                      <td>Marks Obtained</td>
                      <td>% of Marks</td>
                    </tr>
                    <tr>
                      <td>S.S.C(10th)</td>
                      <td>{formDataB.academicDetails.sscBoard}</td>
                      <td>{formDataB.academicDetails.sscyearofPass}</td>
                      <td>{formDataB.academicDetails.ssctotalMarks} </td>
                      <td>{formDataB.academicDetails.sscmarksObtained}</td>
                      <td>{formDataB.academicDetails.sscPercentage}</td>
                    </tr>
                    <tr>
                      <td>H.S.C(12th)</td>
                      <td>{formDataB.academicDetails.hscBoard}</td>
                      <td>{formDataB.academicDetails.hscyearofPass}</td>
                      <td>{formDataB.academicDetails.hsctotalMarks}</td>
                      <td>{formDataB.academicDetails.hscmarksObtained}</td>
                      <td>{formDataB.academicDetails.hscPercentage}</td>
                    </tr>
                    <tr>
                      <td>Diploma</td>
                      <td>{formDataB.academicDetails.diplomaBoardOrUniversity}</td>
                      <td>{formDataB.academicDetails.diplomapassingyear}</td>
                      <td>{formDataB.academicDetails.diplomatotalMarks}</td>
                      <td>{formDataB.academicDetails.diplomamarksObtained}</td>
                      <td>{formDataB.academicDetails.diplomaPercentage}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
            </table>
            <tr className="spacer2"></tr>
            <table className="form-table">
            <tbody>
            <tr>
              
              <td colSpan="3">

            {formDataB.personalDetails.admissionType==="DSE ACAP" && (
                <>
                                    <tr>
                                    <td>1 Preference</td>
                                    <td>{formDataB.preferences[0]}</td>
                                    <td>2 Preference</td>
                                    <td>{formDataB.preferences[1]}</td>
                                  </tr>
                                  <tr>
                                    <td>3 Preference</td>
                                    <td>{formDataB.preferences[2]}</td>
                                    <td>4 Preference</td>
                                    <td>{formDataB.preferences[3]}</td>
                                  </tr>
                                  <tr>
                                    <td>5 Preference</td>
                                    <td>{formDataB.preferences[4]}</td>
                                    <td>6 Preference</td>
                                    <td>{formDataB.preferences[5]}</td>
                                    </tr>
                                  <tr>
                                    <td>7 Preference</td>
                                    <td>{formDataB.preferences[6]}</td>
                                    <td></td>
                                    <td>{formDataB.preferences[7]}</td>
                                  </tr>
                    </>
            )}
                
              </td>
            </tr>
            </tbody>
            </table>
            <table className="form-table">
            <tbody>
              <tr></tr>
            <tr>
                <td className="label">Signature</td>
                <td colSpan="3">
                <img
                      src={filePreviews.photo ? filePreviews.photo : getImageUrl('signature')}
                      alt="Signature" 
                      className="signature-img"
                      onError={(e) => {
                        e.target.src = '/path/to/default-image.png'; // Fallback image
                      }}
                    />
                     </td>
              </tr>
              <tr></tr>
              </tbody>
            </table>
            <table className="form-table">
            <tbody>
              <tr></tr>
            <tr>
              <td className="label">Transaction Details</td>
              <td colSpan="3">
                <table className="inner-table">
                  <tbody>
                    <tr>
                      <td>Payment Mode</td>
                      <td>{formData1.paymentMode}</td>
                      <td>Amount</td>
                      <td>{formData1.amount}</td>
                    </tr>
                    <tr>
                    {formData1.paymentMode === 'DD' && (
                      <>
                      <td>Drafted By</td>
                      <td>{formData1.draftedBy}</td></>)}
                      <td>Transaction ID</td>
                      <td>{formData1.transactionId}</td>
                    </tr>
                    <tr>
                      <td>Transaction Date</td>
                      <td>{formData1.date}</td>
                      <td>Payment For</td>
                      <td>{formData1.paymentAgainst}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="label">Other Details</td>
              <td colSpan="3">{formDataB.otherDetails}</td>
            </tr>
          </tbody>
        </table>
      </form>
      {/* <DownloadPDFButton /> */}
      {/* <div className="buttons">
      <button onClick={handlePrint} style={{ border: '1px solid #E28C41' }}>Download Form as PDF</button>
      </div> */}
    </div>
  );
});

export default DseAdmissionForm;