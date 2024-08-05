import "./styles.css";
import "./styles-import.css";

import Admin from "./components/Admin";
import DocVerification from "./components/DocVerification";

import Navbar from "./components/Navbar";
import CertificateList from "./components/CertificateList";
// import SelectedCertificates from "./components/SelectedCertificates";
import RejectedTransaction from "./components/RejectedTransaction";
import ApplicantsList from "./components/ApplicantsList";
import SelectedCertificate from "./components/SelectedCertificates";
import ReportGenerator from "./components/ReportGenerator";
import MeritList from "./components/MeritList";
import FeeStructure from "./components/FeeStructure";



import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Importdept from './importdept';
// import './import';

// var departmentButton = false;
// var importButton = false;
import React, { useState, useRef } from "react";
import "./styles.css";
import "./styles-import.css";
import PersonalDetails from "./PersonalDetails";
import AcademicDetails from "./AcademicDetails";
import CETDetails from "./CETDetails";
import DocumentUpload from "./DocumentUpload";
import FeeReceipt from "./components/FeeReceipt";
import DocVerificationFEAdmission from "./components/DocVerificationFEAdmission";

const back_url = "https://lectures-frederick-cab-inventory.trycloudflare.com";

export default function App() {
  // const [dept, setDept] = useState(false);
  // const [impr, setImpr] = useState(false);

  // function deptAdder() {
  //   setDept(true);
  //   setImpr(false);
  // }

  // function importAdder() {
  //   setImpr(true);
  //   setDept(false);
  // }

  const [currentSection, setCurrentSection] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: "",
      email: "",
      mobileNumber: "",
      fathersName: "",
      fathersmobileNumber: "",
      fathersOccupation: "",
      mothersName: "",
      mothersOccupation: "",
      mothersmobileNumber: "",
      annualIncome: "",
      sex: "",
      corrAddr: "",
      perAddr: "",
      area: "",
      category: "",
      nationality: "",
      religion: "",
      domicile: "",
      mothersTongue: "",
      dateofBirth: "",
    },
    academicDetails: {
      hscmathsMarks: "",
      hscphysicsMarks: "",
      hscchemistryMarks: "",
      hscpcmPercentage: "",
      hscvocationalSub: "",
      hscvocationalsubjectMarks: "",
      hscvovationalsubjectPer: "",
      sscBoard: "",
      sscyearofPass: "",
      ssctotalMarks: "",
      sscmarksObtained: "",
      sscPercentage: "",
      hscBoard: "",
      hscyearofPass: "",
      hsctotalMarks: "",
      hscmarksObtained: "",
      hscPercentage: "",
    },
    cetDetails: {
      cetappId: "",
      cetrollNo: "",
      cetmathsPer: "",
      cetphysicsPer: "",
      cetchemistryPer: "",
      jeeappNum: "",
      jeePer: "",
    },
    documentUpload: {},
  });

  const personalDetailsRef = useRef();
  const academicDetailsRef = useRef();
  const cetDetailsRef = useRef();
  const documentUploadRef = useRef();

  const sections = [
    <PersonalDetails
      ref={personalDetailsRef}
      formData={formData}
      setFormData={setFormData}
      setError={setError}
    />,
    <AcademicDetails
      ref={academicDetailsRef}
      formData={formData}
      setFormData={setFormData}
      setError={setError}
    />,
    <CETDetails
      ref={cetDetailsRef}
      formData={formData}
      setFormData={setFormData}
      setError={setError}
    />,
    <DocumentUpload
      ref={documentUploadRef}
      formData={formData}
      setFormData={setFormData}
      setError={setError}
    />,
  ];

  const nextSection = () => {
    if (!validateCurrentSection()) return;
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setError("");
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setError("");
    }
  };

  const validateCurrentSection = () => {
    const refs = [
      personalDetailsRef,
      academicDetailsRef,
      cetDetailsRef,
      documentUploadRef,
    ];
    return refs[currentSection].current.validate();
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Append personal, academic, and cet details as JSON string
    formDataToSend.append(
      "personalDetails",
      JSON.stringify(formData.personalDetails)
    );
    formDataToSend.append(
      "academicDetails",
      JSON.stringify(formData.academicDetails)
    );
    formDataToSend.append("cetDetails", JSON.stringify(formData.cetDetails));

    // Append files
    Object.keys(formData.documentUpload).forEach((key) => {
      formDataToSend.append(key, formData.documentUpload[key]);
    });

    try {
      const response = await fetch(`${back_url}/api/submit`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      result.message = "Successfully Submitted Form";
      alert("Form submitted successfully");
      console.log(result); // Show success message
      setCurrentSection(0); // Reset to first section
    } catch (error) {
      setError("Network error: " + error.message);
    }
  };

  // return (
  //   <div className="container">
  //     <h1 className="center page-heading">Personal Details</h1>
  //     <Adddept />
  //     {/* <div className="buttons">
  //       <button id="add-department" onClick={deptAdder}>+ ADD DEPARTMENT</button>
  //       <button id="import-btn" onClick={importAdder}>+ IMPORT</button>
  //     </div> */}
  //     {/* {(dept === true) ? <Adddept /> : (impr === true) ? <Importdept /> : null} */}
  //   </div>
  //);
  return (
    <>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/documentverification" element={<DocVerification />} />
            <Route
              path="/transactionrejected"
              element={<RejectedTransaction />}
            />
            <Route path="/receitGeneration" element={<CertificateList />} />
            <Route path="/ApplicationList" element={<ApplicantsList />} />
            <Route
              path="/documentReceiptGenerator"
              element={<SelectedCertificate />}
            />
            <Route path="/selected" element={<SelectedCertificate />} />
            <Route path="/reportgeneration" element={<ReportGenerator/>} />
            <Route path="/meritList" element={<MeritList/>}/>
            <Route path="/meritList" element={<MeritList/>}/>
            <Route path="/feeStructure" element={<FeeStructure/>}/>
            <Route path="/feeReceipt" element={<FeeReceipt/>}/>
            <Route path="/documentverificationFEAdmission" element={<DocVerificationFEAdmission/>}/>
          </Routes>
        </div>
      </Router>
    </>
  );
}