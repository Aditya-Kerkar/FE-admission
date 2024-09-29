import React, { useState, useRef, useEffect} from 'react';
import './styles.css';
import './styles-import.css';
import PersonalDetails from './PersonalDetails';
import AcademicDetails from './AcademicDetails';
import CETDetails from './CETDetails';
import DocumentUpload from './DocumentUpload';
import TransactionDetails from './TransactionDetails';
import SignupPage from './SignupPage';
import SignInPage from './SignInPage';
// import AdmissionForm from './AdmissionForm';
import AdmissionForm2 from './AdmissionForm2';
import Layout from './Layout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import Documents from './Documents';
import Conditionalpreference from './Conditionalpreference.jsx'
// import PreferencesForm from './PreferencesForm'; // Import PreferencesForm
import PreferenceFormAdmin from './PreferenceFormAdmin'; // Import PreferencesForm
import FAQ from './FAQ';
import AcapPreferencesForm from './acapPreferencesForm';
import Header from './Header';
import ConditionalAdmission from './conditionalAdmissionForm.jsx'
const back_url = process.env.REACT_APP_backUrl;

export default function App() {
  document.title = "GST Admission Portal";
  const [currentSection, setCurrentSection] = useState(-2); // -2 for sign-in, -1 for signup, 0 for first form section
  const [error, setError] = useState('');
  const [formSelectionPage, setFormSelectionPage] = useState(false);
  const [formAlreadySubmitted, setFormAlreadySubmitted] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [newsub,setnewsub]=useState(false);
  const [prevUploadedDoc,setPrevUploadedDoc]=useState([])
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: '',
      email: '',
      juniorCollege:'',
      class: 'FE',
      admissionType: '',
      mobileNumber: '',
      fathersName: '',
      fathersmobileNumber: '',
      fathersOccupation: '',
      mothersName: '',
      mothersOccupation: '',
      mothersmobileNumber: '',
      annualIncome: '',
      sex: '',
      corrAddr: '',
      perAddr: '',
      area: '',
      category: '',
      nationality: 'Indian',
      religion: '',
      domicile: '',
      mothersTongue: '',
      dateofBirth: '',
      birthPlace: '',
      bloodGroup: '',
      state: 'Maharashtra',
      verificationStatus: null
    },
    academicDetails: {
      eduBackground:"",
      hscmathsMarks: null,
      hscphysicsMarks: null,
      hscchemistryMarks: null,
      hscpcmPercentage: null,
      hscvocationalSub: null,
      hscvocationalsubjectMarks: null,
      hscvovationalsubjectPer: null,
      sscBoard: null,
      sscyearofPass: null,
      ssctotalMarks: null,
      sscmarksObtained: null,
      sscPercentage: null,
      hscBoard: null,
      hscyearofPass: null,
      hsctotalMarks: null,
      hscmarksObtained: null,
      hscPercentage: null,
      otherBoard10: null,
      otherBoard12: null,
      admitCardId: null
    },
    cetDetails: {
      cetappId: null,
      cetrollNo: null,
      cetmathsPer: null,
      cetphysicsPer: null,
      cetchemistryPer: null,
      jeeappNum: null,
      jeePer: null,
      cetPer: null
    },
    documentUpload: {
      photo: null,
      signature: null,
      marksheet10: null,
      leavingCertificate12: null,
      marksheet12: null,
      cbse12admitcard:null,
      cetMarksheet: null,
      jeeMarksheet: null,
      domicilecert: null,
      castecertificate: null,
      castevalidity: null,
      noncreamylayer: null,
      income: null,
      transactionproof: null,
      fcverificationcopy: null,
      other: null
    },
   
    preferences: ['', '', '', '', '', '', '', ''],
    formType: 'Form B'
  });
  
  const [formDataB, setFormDataB] = useState({
    personalDetails: {
      fullName: '',
      email: '',
      juniorCollege:'',
      class: 'FE',
      admissionType: '',
      mobileNumber: '',
      fathersName: '',
      fathersmobileNumber: '',
      fathersOccupation: '',
      mothersName: '',
      mothersOccupation: '',
      mothersmobileNumber: '',
      annualIncome: '',
      sex: '',
      corrAddr: '',
      perAddr: '',
      area: '',
      category: '',
      nationality: 'Indian',
      religion: '',
      domicile: '',
      mothersTongue: '',
      dateofBirth: '',
      bloodGroup: '',
      state: 'Maharashtra',
      verificationStatus: null
    },
    academicDetails: {
      eduBackground:"hsc",
      hscmathsMarks: null,
      hscphysicsMarks: null,
      hscchemistryMarks: null,
      hscpcmPercentage: null,
      hscvocationalSub: null,
      hscvocationalsubjectMarks: null,
      hscvovationalsubjectPer: null,
      sscBoard: null,
      sscyearofPass: null,
      ssctotalMarks: null,
      sscmarksObtained: null,
      sscPercentage: null,
      hscBoard: null,
      hscyearofPass: null,
      hsctotalMarks: null,
      hscmarksObtained: null,
      hscPercentage: null,
      otherBoard10: null,
      otherBoard12: null,
      admitCardId: null,
      diplomapassingyear: null,
      diplomatotalMarks: null,
      diplomamarksObtained: null,
      diplomaPercentage: null,
      diplomacollage: null,
      diplomaBoardOrUniversity: "Maharashtra State Board of Technical Education (MSBTE)",
    },
    cetDetails: {
      cetappId: null,
      cetrollNo: null,
      cetmathsPer: null,
      cetphysicsPer: null,
      cetchemistryPer: null,
      jeeappNum: null,
      jeePer: null,
      cetPer: null
    },
    documentUpload: {
      photo: null,
      signature: null,
      marksheet10: null,
      leavingCertificate12: null,
      marksheet12: null,
      cbse12admitcard:null,
      cetMarksheet: null,
      jeeMarksheet: null,
      domicilecert: null,
      castecertificate: null,
      castevalidity: null,
      noncreamylayer: null,
      income: null,
      migration:null,
      diplomaProvisionalMarksheetEquivalent:null,
      transactionproof: null,
      fcverificationcopy: null,
      other: null,
      capAllotmentLetter :null,
    },
   
    preferences: ['', '', '', '', '', '', '',''],
    preference :null,
    formType: 'Form B'
  });


  const [filePreviews, setFilePreviews] = useState({});

  const [formData1, setFormData1] = useState({
  
      date: '',
      amount: '2500',
      transactionId: '',
      file: null,
      paymentAgainst: '',
      selectedYear:'',
      feeStructure:null,
      draftedBy:'',
      paymentMode:'',
    
  });

  // let dbRetrival = false;
  const [dbRetrival,setdbRetrival]=useState(false)

  const [userId, setUserId] = useState('');

  const personalDetailsRef = useRef();
  const academicDetailsRef = useRef();
  const cetDetailsRef = useRef();
  const documentUploadRef = useRef();
  const transactionDetailsRef = useRef();
  const admissionFormRef = useRef();
  const preferencesFormRef = useRef();
  const preferenceFormAdminRef = useRef();
  const admissionForm2Ref = useRef(null);
  const ktdetailsRef = useRef();
  const feedRef = useRef();
  // const preferenceFormAdminRef = useRef();

  const sectionsB = [
    <Documents formData={formDataB} dbRetrival={dbRetrival} setFormData={setFormDataB} formData1={formData1} setFormData1={setFormData1}/>,
    <PersonalDetails ref={personalDetailsRef} userId={userId} dbRetrival={dbRetrival} gstVerified={gstVerified} setGstVerified={setGstVerified} formData={formDataB} setFormData={setFormDataB} formDataB={formDataB} setFormDataB={setFormDataB} setError={setError} />,
    <AcademicDetails ref={academicDetailsRef} formData={formDataB} dbRetrival={dbRetrival} setFormData={setFormDataB} setError={setError} />,
    <CETDetails ref={cetDetailsRef} formData={formDataB} dbRetrival={dbRetrival} setFormData={setFormDataB} setError={setError} />,
    <Conditionalpreference ref={preferenceFormAdminRef} dbRetrival={dbRetrival} formData={formDataB} setFormData={setFormDataB} setError={setError} />,
    // <PreferenceFormAdmin ref={preferenceFormAdminRef} dbRetrival={dbRetrival} formData={formDataB} setFormData={setFormDataB} setError={setError} />,
    // <AcapPreferencesForm ref={acapPreferenceFormAdminRef} dbRetrival={dbRetrival} formData={formDataB} setFormData={setFormDataB} setError={setError} />,
    <TransactionDetails ref={transactionDetailsRef} formData={formDataB} setFormData={setFormDataB} formData1={formData1} setFormData1={setFormData1} setError={setError} boardEligibility={formDataB.academicDetails.hscBoard} dse={formDataB.personalDetails.admissionType}/>,
    <DocumentUpload ref={documentUploadRef} prevUploadedDoc={prevUploadedDoc} formData={formDataB} setFormData={setFormDataB} dbRetrival={dbRetrival} filePreviews={filePreviews} setFilePreviews={setFilePreviews} setError={setError} dse={formDataB.personalDetails.admissionType}/>,
    <ConditionalAdmission ref={admissionForm2Ref} formDataB={formDataB} setFormDataB={setFormDataB} filePreviews={filePreviews} formData1={formData1} userId={userId} setError={setError}/>
  ];


  const moveDocument = async (srcEmail) => {
    try {
      const response = await fetch(`${back_url}/admission/movedoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({ srcEmail }), // Send only srcEmail
      });
  
      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        // Attempt to parse error response as JSON
        const contentType = response.headers.get('Content-Type');
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json(); // Extract error data from the response
        } else {
          // Handle non-JSON error responses
          errorData = await response.text(); // Read response as text
        }
        // Extract message from errorData
        const errorMessage = errorData.message || errorData || 'Unknown error';
        throw new Error(errorMessage);
      }
  
      // Handle success
      const data = await response.json(); // Parse JSON response
      console.log('Response:', data);
      return data;
    } catch (error) {
      // Handle error
      console.error('Error moving document:', error.message || error); // Ensure proper error message handling
      throw error;
    }
  };
  
  
  








  const retriveData = async (email) => {
    try {
      console.log("inside try")
      const response = await fetch(`${back_url}/api/retrivedata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      });

      if (!response.ok) {
        throw new Error('');
      }
      // console.log("fetched but not checked yet")
      const result = await response.json();
      if (result.success) {
        // alert('data retrived');
        // onSignIn(result.userData);
        const data = result;
        // console.log(data);
        // return data;
        const dateString = data.userData[0].date_of_birth;

// Create a Date object from the string
          let dobObject = new Date(dateString);
            if (isNaN(dobObject.getTime())) {
              dobObject=''; // Return empty string if the date is invalid
            }

        const userData = data.userData[0];


        const docNames = [
          { label: "photo", value: userData.photo },
          { label: "marksheet10", value: userData.marksheet10 },
          { label: "leavingCertificate12", value: userData.leavingCertificate12},
          { label: "marksheet12", value: userData.marksheet12 },
          { label: "cbse12admitcard", value: userData.cbse12admitcard },
          { label: "cetMarksheet", value: userData.cetMarksheet },
          { label: "jeeMarksheet", value: userData.jeeMarksheet },
          { label: "domicilecert", value: userData.domicilecert },
          { label: "castecertificate", value: userData.castecertificate },
          { label: "castevalidity", value: userData.castevalidity },
          { label: "noncreamylayer", value: userData.noncreamylayer },
          { label: "income", value: userData.income },
          { label: "transactionproof", value: userData.transactionproof },
          { label: "capAllotmentLetter", value: userData.capAllotmentLetter },
          { label: "other", value: userData.other },
          { label: "signature", value: userData.signature }
        ];

        const getUploadedDocs = (docs) => {
          return docs
            .filter(doc => doc.value) // Filter documents where value is not null, undefined, or empty string
            // .map(doc => doc.label); // Map to just the labels
        };
        
        // Assuming docNames is your array of documents
        const uploadedDocLabels = getUploadedDocs(docNames);
        
        // Update the state or variable with uploaded document labels
        setPrevUploadedDoc(uploadedDocLabels);
        console.log(uploadedDocLabels);
        


        // Updating formDataB with userData
        setFormDataB(prevState => ({
          ...prevState,
          personalDetails: {
            ...prevState.personalDetails,
            fullName: userData.fullname ?? prevState.personalDetails.fullName,
            email: userData.email ?? prevState.personalDetails.email,
            juniorCollege: userData.juniorCollege ?? prevState.personalDetails.juniorCollege,
            class: userData.class ?? prevState.personalDetails.class,
            admissionType: userData.admissionType ?? prevState.personalDetails.admissionType,
            mobileNumber: userData.mobile_number ?? prevState.personalDetails.mobileNumber,
            fathersName: userData.father_name ?? prevState.personalDetails.fathersName,
            fathersmobileNumber: userData.father_mobile_number ?? prevState.personalDetails.fathersmobileNumber,
            fathersOccupation: userData.father_occupation ?? prevState.personalDetails.fathersOccupation,
            mothersName: userData.mother_name ?? prevState.personalDetails.mothersName,
            mothersOccupation: userData.mother_occupation ?? prevState.personalDetails.mothersOccupation,
            mothersmobileNumber: userData.mother_mobile_number ?? prevState.personalDetails.mothersmobileNumber,
            annualIncome: userData.annual_income ?? prevState.personalDetails.annualIncome,
            sex: userData.sex ?? prevState.personalDetails.sex,
            corrAddr: userData.corres_address ?? prevState.personalDetails.corrAddr,
            perAddr: userData.permanent_address ?? prevState.personalDetails.perAddr,
            area: userData.area ?? prevState.personalDetails.area,
            category: userData.category ?? prevState.personalDetails.category,
            nationality: userData.nationality ?? prevState.personalDetails.nationality,
            religion: userData.religion ?? prevState.personalDetails.religion,
            domicile: userData.domicile ?? prevState.personalDetails.domicile,
            mothersTongue: userData.mother_tongue ?? prevState.personalDetails.mothersTongue,
            dateofBirth: dobObject ?? prevState.personalDetails.dateofBirth,
            bloodGroup: userData.bloodGroup ?? prevState.personalDetails.bloodGroup,
            state: userData.state ?? prevState.personalDetails.state,
            birthPlace:userData.birth_place ?? prevState.personalDetails.birthPlace,
            // verificationStatus: userData.verificationStatus ?? prevState.personalDetails.verificationStatus
          },
          academicDetails: {
            ...prevState.academicDetails,
            hscchemistryMarks: userData.hsc_chemistry ?? prevState.academicDetails.hscchemistryMarks,
            hscpcmPercentage: userData.hsc_pcm_percentage ?? prevState.academicDetails.hscpcmPercentage,
            hscvovationalsubjectPer: userData.hsc_vocational_subject_percentage ?? prevState.academicDetails.hscvovationalsubjectPer,
            hsctotalMarks: userData['12th_total_marks'] ?? prevState.academicDetails.hsctotalMarks,
            hscmarksObtained: userData['12th_marks_obtained'] ?? prevState.academicDetails.hscmarksObtained,
            hscPercentage: userData['12th_percentage'] ?? prevState.academicDetails.hscPercentage,
            hscmathsMarks:userData.hsc_maths ?? prevState.academicDetails.hscmathsMarks,
            hscphysicsMarks:userData.hsc_physics ?? prevState.academicDetails.hscphysicsMarks,
            hscvocationalSub:userData.hsc_vocational_subject_name ?? prevState.academicDetails.hscvocationalSub,
            hscvocationalsubjectMarks : userData.hsc_vocational_subject_marks ?? prevState.academicDetails.hscvocationalsubjectMarks,
            hscyearofPass:userData['12th_year_of_passing'] ?? prevState.academicDetails.hscyearofPass,
            hscBoard:userData['12th_board_name'] ?? prevState.academicDetails.hscBoard,
            sscBoard:userData['10th_board_name'] ?? prevState.academicDetails.sscBoard,
            sscPercentage:userData['10th_percentage'] ?? prevState.academicDetails.sscPercentage,
            sscyearofPass:userData['10th_year_of_passing'] ?? prevState.academicDetails.sscyearofPass,
            ssctotalMarks:userData['10th_total_marks'] ?? prevState.academicDetails.ssctotalMarks,
            sscmarksObtained:userData['10th_marks_obtained'] ?? prevState.academicDetails.sscmarksObtained,

          },
          cetDetails:{
            cetappId: userData.cet_application_id ?? prevState.cetDetails.cetappId,
            cetrollNo: userData.cet_roll_number ?? prevState.cetDetails.cetrollNo,
            cetmathsPer: userData.cet_maths_percentile ?? prevState.cetDetails.cetmathsPer,
            cetphysicsPer: userData.cet_physics_percentile ?? prevState.cetDetails.cetphysicsPer,
            cetchemistryPer: userData.cet_chemistry_percentile ?? prevState.cetDetails.cetchemistryPer,
            jeeappNum: userData.jee_application_number ?? prevState.cetDetails.jeeappNum,
            jeePer: userData.jee_percentile ?? prevState.cetDetails.jeePer,
            cetPer: userData.cet_percentile ?? prevState.cetDetails.cetPer
          },
          documentUpload: {
            ...prevState.documentUpload,
            photo: userData.photo ?? prevState.documentUpload.photo,
            marksheet10: userData.marksheet10 ?? prevState.documentUpload.marksheet10,
            leavingCertificate12: userData.leavingCertificate12 ?? prevState.documentUpload.leavingCertificate12,
            marksheet12: userData.marksheet12 ?? prevState.documentUpload.marksheet12,
            cbse12admitcard: userData.cbse12admitcard ?? prevState.documentUpload.cbse12admitcard,
            cetMarksheet: userData.cetMarksheet ?? prevState.documentUpload.cetMarksheet,
            jeeMarksheet: userData.jeeMarksheet ?? prevState.documentUpload.jeeMarksheet,
            domicilecert: userData.domicilecert ?? prevState.documentUpload.domicilecert,
            castecertificate: userData.castecertificate ?? prevState.documentUpload.castecertificate,
            castevalidity: userData.castevalidity ?? prevState.documentUpload.castevalidity,
            noncreamylayer: userData.noncreamylayer ?? prevState.documentUpload.noncreamylayer,
            income: userData.income ?? prevState.documentUpload.income,
            transactionproof: userData.transactionproof ?? prevState.documentUpload.transactionproof,
            capAllotmentLetter: userData.capAllotmentLetter ?? prevState.documentUpload.capAllotmentLetter,
            other: userData.other ?? prevState.documentUpload.other,
            signature: userData.signature ?? prevState.documentUpload.signature,
          },
          // preference: userData.preference && userData.preference.length > 0 ? userData.preference.join(', ') : prevState.preference,
          formType:prevState.formType
        }));

        setdbRetrival(true);
        console.log("hello")
        console.log(dbRetrival)
        console.log(formDataB.personalDetails.email)
        const moveResp = moveDocument(formDataB.personalDetails.email || userData.email);
        console.log(moveResp)

      } else {
        setError('failure in retriving data');
      }
      // const moveResp = moveDocument("professional0012345@gmail.com");
      //   console.log(moveResp)
    } catch (error) {
      setError(error.message);
    }
  };





  const createPDFBlob = async (content) => {
    try {
      console.log(content); // Debug: Check if the content is a valid DOM element

      if (!(content instanceof HTMLElement)) {
        throw new Error('Content is not a valid DOM element.');
      }

      // Capture the content as a canvas
      const canvas = await html2canvas(content, {
        useCORS: true,
        logging: true,
        allowTaint: true,
        scale: 1.9, // Increase the scale to improve image quality
      });

      // Get the image data
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 90% quality

      // Define PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;


      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Page settings
      let position = 0;

      // Add the captured image to the PDF
      while (position < imgHeight) {
        // Calculate the height for the current page
        const pageImgHeight = Math.min(imgHeight - position, pageHeight);

        // Add image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);

        // Add a new page if there are more pages left
        if (position + pageHeight < imgHeight) {
          pdf.addPage();
        }

        // Update the position for the next page
        position += pageHeight;
      }

      // Return the PDF as a Blob with compression
      return pdf.output('blob', { compress: true, compression: 'DEFLATE' });
    } catch (error) {
      console.error('Error generating PDF: ', error);
      throw error; // Re-throw the error to be handled by caller
    }
  };



  const handleFormSelection = async (formLabel) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      formType: formLabel
    }));

    const email = formData.personalDetails.email;
    const canProceed = await handleCheck(email, formLabel);
    if (!canProceed) {
      if (formAlreadySubmitted) {
        setFormSelectionPage(true); // If form already submitted, stay on form selection page
      } else {
        setFormAlreadySubmitted(true);
        setCurrentSection(0); // Proceed to the first section of the form
      }
    } else {
      setFormAlreadySubmitted(false);
      setFormSelectionPage(false); // Set formSelectionPage to false when form type is selected
      setCurrentSection(0); // Proceed to the first section of the form
    }
  };

  const validateCurrentSectionB = () => {

    if (currentSection === -2 || currentSection === -1 || currentSection === 4) {
      return true;
    }
    
    if (currentSection >= 0 && currentSection < sectionsB.length) {
      const refs = [
        null,
        personalDetailsRef,
        academicDetailsRef,
        cetDetailsRef,
        preferenceFormAdminRef,
        documentUploadRef,
        admissionForm2Ref
      ];
  
      // Check if the ref is defined before calling validate
      if (refs[currentSection] && refs[currentSection].current) {
        return refs[currentSection].current.validate();
      }
    }
    return true; // Skip validation for sign-in and sign-up sections
  };

  const handleCheck = async (email, formType) => {
    try {
      const response = await fetch(`${back_url}/api/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, formType }),
      });
      const result = await response.json();
      if (result.key === 1) {
        return true;
      } else {
        // alert('User already submitted the form');
        setError(result.message);
        return false;
      }
    } catch (error) {
      setError(`Error while check ${'\n'}: ` + error.message);
      return false;
    }
  };



  const nextSectionB = () => {
    if (!validateCurrentSectionB()){
      console.log("dfdf");
      // alert("not validated");
      return;
    }
    // console.log("df452f");


    function checkAllDocumentsPresent(obj) {
 
       const fieldsToCheck = [
        'photo', 'marksheet10', 'leavingCertificate12', 'signature','transactionproof',
      ];
    
    
      // Iterate through fieldsToCheck array
      for (let i = 0; i < fieldsToCheck.length; i++) {
        const field = fieldsToCheck[i];
        if (formDataB.documentUpload[field] === null) {
          console.log(formDataB.documentUpload)
          return false; // Return false if any document is null
        }
      }
    
      return true; // Return true if all documents are present
    }

    function checkAllDocumentsPresentDSE(obj) {
 
      const fieldsToCheck = [
       'photo', 'marksheet10', 'leavingCertificate12', 'signature','transactionproof',
     ];
   
   
     // Iterate through fieldsToCheck array
     for (let i = 0; i < fieldsToCheck.length; i++) {
       const field = fieldsToCheck[i];
       if (formDataB.documentUpload[field] === null) {
         console.log(formDataB.documentUpload)
         return false; // Return false if any document is null
       }
     }
   
     return true; // Return true if all documents are present
   }

    // const compulsoryFields = ['photo', 'marksheet10', 'leavingCertificate12', 'marksheet12', 'signature'];
    // console.log(formDataB.documentUpload.photo)
    // const areCompulsoryDocsUploaded = compulsoryFields.every(field => formData.documentUpload && formData.documentUpload[field] !== null);


console.log(formDataB.personalDetails.class)
    if (currentSection === 0) {
      console.log(formData1.selectedYear)
      // Display warning alert for section 0
      if(formData1.selectedYear===''){
        alert("please select admission year")
        return;
      }
      alert("Please ensure to complete and submit the form before closing the website\n A fee of Rs 2500 will be charged if Brochure form (Institute Level Form) is not filled .");
  
      // After OK is pressed, proceed to next section
      setCurrentSection(currentSection + 1);
      setError('');
    // }  else if(currentSection === 0 ){
      // console.log("checker")
    }else if(currentSection === 1  ){
      // if(formDataB.personalDetails.dateofBirth===''){
      //   alert('please fill date of birth');
      //   return;
      // }
      


      setCurrentSection(currentSection + 1);
      setError('');

  }else if(currentSection===2){
      if(formDataB.personalDetails.admissionType==='DSE' || formDataB.personalDetails.admissionType==='DSE ACAP' || formDataB.personalDetails.admissionType==="DSE MINORITY"){
        console.log("hello this is executing")
        setCurrentSection(currentSection+2);
        setError('');
      }else{
        
        setCurrentSection(currentSection + 1);
        setError('');
      }
  }else if(currentSection===4){
    if(formDataB.personalDetails.admissionType==="DSE ACAP"){
      if(formDataB.preferences===null || formDataB.preferences[0].trim()===""){
        alert("please select branch");
        return;
      }
      setCurrentSection(currentSection + 1);
      setError('');
    }else{
      if(formDataB.preference===null || formDataB.preference.trim()===""){
        alert("please select branch");
        return;
      }
      setCurrentSection(currentSection + 1);
      setError('');
  }}
  else if(currentSection === 5  ){

        if(formData1.transactionId==='' || formData1.date==='' || formData1.paymentMode===""){
          // console.log("hello2")
          alert("Please fill payment details before proceeding.");
        return;
        }
        setCurrentSection(currentSection + 1);
        setError('');
      

    }else if (currentSection === 6) {
      // if(checkAllDocumentsPresent(formData.documentUpload)){
      // setCurrentSection(currentSection + 1);
      // setError('');
      // return;
      // }
      

      
     if(formDataB.personalDetails.admissionType==="DSE" || formDataB.personalDetails.admissionType==="DSE ACAP" || formDataB.personalDetails.admissionType==="DSE MINORITY"){
      if(formDataB.personalDetails.admissionType !=="DSE ACAP"){
        if(!formDataB.documentUpload.capAllotmentLetter){
          alert("please upload cap allotment letter");
          return;
        }
      }
      
      if(!formDataB.documentUpload.transactionproof || !formDataB.documentUpload.marksheet10 || !formDataB.documentUpload.signature ||!formDataB.documentUpload.photo || !formDataB.documentUpload.migration || !formDataB.documentUpload.diplomaProvisionalMarksheetEquivalent || !formDataB.documentUpload.leavingCertificate12){
        alert("please upload compulsary documents .");
        return;
      }
      if(formDataB.academicDetails.eduBackground==="hsc + diploma"){
        if(!formDataB.documentUpload.marksheet12 || formDataB.documentUpload.marksheet12===""){
          alert("please upload 12th marksheet.");
          return;
        }
      }
    }else{
        if((formDataB.documentUpload.jeeMarksheet==='' || formDataB.documentUpload.jeeMarksheet===null) && (formDataB.documentUpload.cetMarksheet==='' || formDataB.documentUpload.cetMarksheet===null)){
        alert(`Please upload either your JEE marksheet or CET marksheet, based on your attempts in JEE , CET , or both .`);
        return;
      }
      if(!formDataB.documentUpload.marksheet12 || formDataB.documentUpload.marksheet12===""){
        alert("please upload 12th marksheet");
          return;
      }
      if(formDataB.personalDetails.admissionType==='CAP Level' || formDataB.personalDetails.admissionType==='Minority Level' || formDataB.personalDetails.admissionType==='CAP TFWS'){
        if(!formDataB.documentUpload.capAllotmentLetter){
          alert("please upload cap allotment letter");
          return;
        }
      }
      if(formDataB.academicDetails.hscBoard==="CBSE"){
        if(!formDataB.documentUpload.cbse12admitcard || formDataB.documentUpload.cbse12admitcard===""){

          alert("please upload CBSE Admit Card.");
          return;
        }
      }


      if(formDataB.personalDetails.admissionType==="DSE ACAP") {
        if(!checkAllDocumentsPresentDSE(formDataB.documentUpload)){

          alert("Please upload all compulsory documents before proceeding.");
          // setCurrentSection(currentSection + 1);
          // setError('');
          return;
        }
      }
      else {
        if(!checkAllDocumentsPresent(formDataB.documentUpload)){

          alert("Please upload all compulsory documents before proceeding.");
          // setCurrentSection(currentSection + 1);
          // setError('');
          return;
        }
      }
      
    
    }

      


      setCurrentSection(currentSection + 1);
      setError('');
  } else if (currentSection < sectionsB.length - 1) {
      // Regular section advancement logic
      setCurrentSection(currentSection + 1);
      setError('');
    }
    window.scrollTo(0, 0);
  };

 

  // const prevSection = () => {
  //   if (currentSection > 0) {
  //     setCurrentSection(currentSection - 1);
  //     setError('');
  //   }
  // };

  // const prevSectionB = () => {
  //   if (currentSection > 0) {
  //     setCurrentSection(currentSection - 1);
  //     setError('');
  //   }
  // };


  
  const prevSectionB = () => {
    if (currentSection === 0) {
      window.location.reload(); // Reload the entire application
    }else if(currentSection===4){
      if(formDataB.personalDetails.admissionType==='DSE' || formDataB.personalDetails.admissionType==='DSE ACAP'){
        console.log("hello this is executing")
        setCurrentSection(currentSection-2);
        setError('');
      }else{

        setCurrentSection(currentSection-1);
        setError('');
      }
  } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setError('');
    }
  };



  const handleDownloadPDF = async () => {
    const email = formDataB.personalDetails.email; // Get this from state or props
    const formType = formDataB.formType; // Get this from state or props

    try {
      const url = `${back_url}/api/admissionDownloadPDF?email=${encodeURIComponent(email)}&formType=${encodeURIComponent(formType)}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch the PDF:', errorText);
        throw new Error('Failed to fetch the PDF');
      }

      const blob = await response.blob();

      if (blob.type !== 'application/pdf') {
        console.error('Downloaded file is not a PDF:', blob.type);
        throw new Error('Downloaded file is not a PDF');
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'FEadmission.pdf';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error occurred while downloading PDF:', error);
      alert('Error occurred while downloading PDF');
    }
  };

  
  const handlePrint = useReactToPrint({
    content: () => admissionForm2Ref.current,
  });




  const handleSubmitB = async () => {
    alert("please wait till conformation message .");
    
    // saveDobInForm();
    const fieldsToReplace = [
      'hscmathsMarks',
      'hscphysicsMarks',
      'hscchemistryMarks',
      'hscpcmPercentage',
      'hscvocationalSub',
      'hscvocationalsubjectMarks',
      'hscvovationalsubjectPer',
      'hscBoard',
      'hscyearofPass',
      'hsctotalMarks',
      'hscmarksObtained',
      'hscPercentage',
      'otherBoard12'
    ];
    
    if (formDataB.personalDetails.admissionType === "DSE" || formDataB.personalDetails.admissionType === "DSE ACAP") {
      fieldsToReplace.forEach(field => {
        const value = formDataB.academicDetails[field];
        if (value === undefined || value === null) {
          // Skip if the value is undefined or null
          return;
        }
        if (value === "") {
          formDataB.academicDetails[field] = null;
        }
      });
    }
    

    const formDataToSend = new FormData();
    const pdfBlob = await createPDFBlob(admissionForm2Ref.current);
  
  // Append personal, academic, and cet details as JSON string
  formDataToSend.append('personalDetails', JSON.stringify(formDataB.personalDetails));
  formDataToSend.append('academicDetails', JSON.stringify(formDataB.academicDetails));
  formDataToSend.append('cetDetails', JSON.stringify(formDataB.cetDetails));
  formDataToSend.append('preference', JSON.stringify(formDataB.preference));
  formDataToSend.append('preferences', JSON.stringify(formDataB.preferences));
  formDataToSend.append('formType', formData.formType); // Set the formType property
  formDataToSend.append('formData1', JSON.stringify(formData1));
  formDataToSend.append('FEadmission', pdfBlob, 'admissionForm.pdf');
  console.log(formDataToSend);
  
  
  // Append files
  Object.keys(formDataB.documentUpload).forEach(key => {
    formDataToSend.append(key, formDataB.documentUpload[key]);
  });

    try {
      const response = await fetch(`${back_url}/api/submit2`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Error while Submiting (2) ${'\n'} Invalid network response `);
      }

      const result = await response.json();
      alert(result.message); // Show success message
      const popup = document.getElementById('popup');
      popup.classList.add('show');
      popup.innerHTML=`
      <h1 className = 'center page-heading>Form Submitted Successfully</h1>
      <span>Please visit offline College office for Document Verification along with all required Document</span>`
      // setCurrentSection(-2); // Reset to first section
      // window.location.reload();
      if(response.ok){
        setnewsub(true);
      }
      setError("Please Download Form and logout");
    } catch (error) {
      setError('Unable to submit(2)' + error.message);
      if(newsub===true){
        alert("Form Submition Failed . Please check if already filled \nIf multiple attempts please contact office .")
      }else{

        alert("Form Submition Failed . Please Try again \nIf multiple attempts please contact office .")
      }
    }

    
    localStorage.removeItem(`${formDataB.personalDetails.email}-formData.personalDetails`);
    localStorage.removeItem(`${formDataB.personalDetails.email}-formData.bpreference`);
    localStorage.removeItem(`${formDataB.personalDetails.email}-formData.cetDetails`);
    localStorage.removeItem(`${formDataB.personalDetails.email}-formData.academicDetails`);
    // localStorage.removeItem(`std65498754-KtDetails`);



  };


  

  // const handleSignIn = (userData) => {
  //   setUserId(userData.userId);
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     personalDetails: {
  //       ...prevFormData.personalDetails,
  //       email: userData.email,
  //       uniqueKey: userData.uniqueKey
  //     }
  //   }));
  //   setCurrentSection(0); // Proceed to the first section of the form
  // };

  const handleSignIn = async (userData) => {
    setUserId(userData.userId);
    
    // Update all form data states
    setFormData(prevFormData => ({
      ...prevFormData,
      personalDetails: {
        ...prevFormData.personalDetails,
        email: userData.email,
        uniqueKey: userData.uniqueKey
      }
    }));
    setFormDataB(prevFormDataB => ({
      ...prevFormDataB,
      personalDetails: {
        ...prevFormDataB.personalDetails,
        email: userData.email,
        uniqueKey: userData.uniqueKey
      }
    }));
    try{
      // console.log("reached here")
      const a = await retriveData(userData.email);
      console.log(a); // Set formSelectionPage to false when form type is selected
    }catch(err){
      console.log(err);
    }
  
    // Proceed to the first section of the form

    setCurrentSection(0);
  
    // Check form submission status for the selected form type
    const email = userData.email; // Assuming userData contains the signed-in user's email
    const formLabel = formData.formType; // Assuming formType is already set correctly
    const canProceed = await handleCheck(email, formLabel);
  
    // Handle navigation based on form submission status
    if (!canProceed) {
      if (formAlreadySubmitted) {
        setFormSelectionPage(true); // Stay on form selection page if already submitted
      } else {
        setFormAlreadySubmitted(true);
        setCurrentSection(0); // Proceed to the first section of the form
      }
    } else {
      setFormAlreadySubmitted(false);
      setFormSelectionPage(false);
      setCurrentSection(0);
       // Proceed to the first section of the form
    }
  };
  const goToSignup = () => {
    setCurrentSection(-1); // Navigate to the signup page
  };

  const handleSignupComplete = (email) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      personalDetails: {
        ...prevFormData.personalDetails,
        email: email
      }
    }));
    setCurrentSection(-2); // Navigate back to the sign-in page after signup
  };
  
  // const section = formData.formType === 'A' ? sections : sectionsB;
  
  return (
    <Layout>
      <div className="container">
        {currentSection === -2 ? (
          <SignInPage onSignIn={handleSignIn} goToSignup={goToSignup} />
        ) : currentSection === -1 ? (
          <SignupPage onSignupComplete={handleSignupComplete} />
        ) : formAlreadySubmitted ? (
            
          <h3 className="center page-heading" style={{ color: 'green', fontSize: '20px'}}>
            You have already submitted this form!
            <br></br>
           <br></br>
           <br></br>
           <div className="buttons">
            {formData.formType === 'Form B' && (

              <button onClick={handleDownloadPDF}>Download FE admission Form</button>
            )}
            </div>
          </h3>
            
            
          ) : (
          <>
          {(formSelectionPage || !formData.formType) && !formAlreadySubmitted && (
            <div className="form-selection">
              <h1 className="center page-heading">Form Selection</h1>
              <div className='buttons1'>
                <br></br>
              {/* <button onClick={() => handleFormSelection('Form A')}>SIES Brochure Form</button> */}
              <button onClick={() => handleFormSelection('Form B')}>FE Admission Form</button>
              {/* <button onClick={() => handleFormSelection('Form C')}>SE Admission Form</button> */}
              {/* <button onClick={() => handleFormSelection('Form D')}>TE Admission Form</button>
              <button onClick={() => handleFormSelection('Form E')}>BE Admission Form</button> */}
              {/* <button onClick={() => handleFormSelection('Form F')}>Form F</button>
              <button onClick={() => handleFormSelection('Form G')}>Form G</button> */}
              </div>
            </div>
          )}
          
            {formAlreadySubmitted ? (
            
            <h3 className="center page-heading" style={{ color: 'green', fontSize: '20px'}}>
              You have already submitted this form!
            </h3>
              
              
            ) : (
            formData.formType === 'Form A' ? (
              <>
               
              </>
            ) : (
              formData.formType === 'Form B' ? (
                <>
                {sectionsB[currentSection]}
                {error && <p className="error">{error}</p>}
                <br />
                <div className="buttons">

                  {newsub===false &&(

                  <button onClick={prevSectionB} >BACK</button>
                  )}

                  {currentSection !== sectionsB.length - 1 && (
                  <button onClick={nextSectionB} disabled={currentSection === sectionsB.length - 1}>NEXT</button>
                  )}
                  {currentSection === sectionsB.length - 1 && newsub===true && (
                    <button className="no-print" onClick={handlePrint}>Download PDF copy of form</button>
                  )}
                  {currentSection === sectionsB.length - 1 && (
                    <button className="add-course" onClick={handleSubmitB}><b>+ SUBMIT DATA</b></button>
                  )}
                </div>
                <div id="popup" class="popup"></div>
                <FAQ />
              </>
              ) : (
                formData.formType === 'Form C' ? (
                  <>
                 
                </>
                ) : (
                  <p></p>
                )
              )
            )
            )}
          </>
        )}
      </div>
    </Layout>
  );
}