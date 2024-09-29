import React, {useState, useEffect} from 'react';
import './doc.css';

const back_url = process.env.REACT_APP_backUrl;

function Documents({ formData1,dbRetrival,setFormData1 }) {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [feeStructure, setFeeStructure] = useState({});
    const [dse, setDse] = useState('NO');
    const [count,setCount]=useState(0);

    useEffect(() => {
        // Fetch available years from the backend
       if(count===0){
        const now = new Date();
        const currentYear = now.getFullYear().toString();
        console.log(currentYear); // Outputs: "2024" (as a string)
        setSelectedYear(currentYear);
        setFormData1({
            ...formData1,
            selectedYear : currentYear,
          })
          setCount(count+1);
       }
        fetch(`${back_url}/api/years`)
          .then(response => response.json())
          .then(data => {
            //console.log('Years received from server:', data);
            setYears(data);
          })
          .catch(error => console.error('Error fetching years:', error));
    }, []);

    useEffect(() => {
        if (selectedYear) {
            const yearToFetch = dse === 'YES' ? selectedYear - 1 : selectedYear;
            fetch(`${back_url}/api/fee-structure/${yearToFetch}`)
              .then(response => response.json())
              .then(data => {
                console.log('Fee structure received from server:', data);
                setFeeStructure(data);
                console.log(data)
              })
              .catch(error => {
                console.error('Error fetching fee structure:', error);
                setFeeStructure(null);
              });
        }
    }, [selectedYear, dse]);

    useEffect(() => {
        if (feeStructure) {
            const totalFee = feeStructure.tuition_fee + feeStructure.development_fee + feeStructure.exam_fee + feeStructure.misc_fee;
            setFormData1(prevState => ({ ...prevState, amount: totalFee }));
        }
    }, [feeStructure, setFormData1]);

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
        const selyear = event.target.value;
        console.log(selyear)
        setFormData1({
          ...formData1,
          selectedYear : selyear,
        })
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const now = new Date();
            const currentYear = now.getFullYear().toString();
            
            const response = await fetch(`${back_url}/clientfeeStructure/${currentYear}`);
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Update formData1 with the fetched feeStructure
            setFormData1(prevData => ({
              ...prevData,
              feeStructure: data
            }));
            console.log("data",data)
          } catch (error) {
            console.error('Error fetching fee structure:', error);
          }
        };
        
        fetchData();
        console.log("check",formData1.feeStructure)
      }, []); 
    // const handleDseChange = (event) => {
    //     setDse(event.target.value);
    //     console.log("dsd")
    //     // formData1.append('dse', JSON.stringify(dse));
    //     setFormData1({
    //         ...formData1,
    //         dse: dse,
    //       });
    //     // setFormData1(dse);
    //     console.log(dse)
    // };


    const handleDseChange = (event) => {
        const newDse = event.target.value;
        setDse(newDse);
        console.log("dsd");
        setFormData1({
          ...formData1,
          dse: newDse,
        });
        console.log(newDse);
      };

  return (
    <div className="container-doc">
        <h1 className="center page-heading">Documents Required</h1>

        <table className="doc-req">
            <thead>
            <tr>
                <th>Sr. No.</th>
                <th>Types of Candidates</th>
                <th>Copies of documents to be produced along with Application Form for Admission</th>
                <th>Required</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Passing of SSC/ICSE/CBSE/Std. X Examination</td>
                    <td>
                        <ul>
                            <li>Marksheet</li>
                            <li>Migration certificate</li>
                        </ul>
                    </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Linguistic Minority(Tamil)</td>
                    <td>
                        <ul>
                            <li>Minority Affidavit</li>
                        </ul>
                    </td>
                    <td>(Only applicable if mother tongue is not mentioned on 12th LC as Tamil)</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Mark sheet at the qualifying examination HSC (Std. XII)</td>
                    <td>
                        <ul>
                            <li>Leaving certificate</li>
                            <li>Marksheet</li>

                        </ul>
                    </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Mark sheet at the qualifying examination(Std. XII ICSE, CBSE, ISC)</td>
                    <td>
                        <ul>
                            <li>Leaving certificate</li>
                            <li>Migration Certificate</li>
                            <li>Marksheet</li>

                        </ul>
                    </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>CET</td>
                    <td>MHT-CET Score Card </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>JEE</td>
                    <td> JEE Main Score Card  </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>CAP</td>
                    <td>CAP Allotment Letter </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Diploma (Direct Second Year Admission)</td>
                    <td>
                        <ul>
                            <li>Provisional Certificate</li>
                            <li>college leaving certificate</li>
                            <li>All Marksheets of Diploma</li>
                            <li>Migration Certificate</li>
                        </ul>
                    </td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>GAP</td>
                    <td>Affidavit Certificate Required</td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Caste</td>
                    <td>Candidates belonging to S.C./S.T.
                    <ul>
                        <li>Caste/Tribe Certificate</li>
                        <li>Caste/Tribe Validity Certificate</li>
                        <li>Income Certificate</li>
                    </ul>
                    </td>
                    
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>Candidates belonging to VJ/DT-NT(A)/
NT(B) / NT(C) /NT(D) /O.B.C/ SBC
                    <ul>
                        <li>Caste Certificate</li>
                        <li>Caste Validity Certificate</li>
                        <li>Income Certificate</li>
                        <li>Non creamy layer certificate</li>
                    </ul>
                    </td>
                    
                    <td>MANDATORY</td>
                    </tr>
                
                <tr>
                    <td>11</td>
                    <td>Economically WeakerSection (EWS) Candidate </td>
                    <td>Eligibility Certificate for Economically Weaker Section</td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>TFWS candidates</td>
                    <td>Income certificate</td>
                    <td>MANDATORY</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>Domicile Certificate</td>
                    <td>Domicile Certificate</td>
                    <td>MANDATORY</td>
                </tr>
            </tbody>
        </table>
        <h2 className="center page-heading" style={{ fontSize: '20px'}}>All the documents should be scanned (PDF) or in photo format (JPEG,PNG) and it should be under 250KB</h2>
        <div>
        <h1 className="center page-heading">FEE Details</h1>
        <div className="input-field">
        <label>
          Select Year:
          <select className="dropdown-field" value={selectedYear} onChange={handleYearChange} disabled>
            <option value="" disabled selected>Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
        </div>
        <div className="input-field">
         <label>
          Direct Second-Year Engineering(DSE):
          <select value={formData1.dse} className="dropdown-field" onChange={handleDseChange}>
          
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </label> 
        </div>
      </div>
      {(feeStructure && dse==="NO")?(
        <>
         <div>
          <h2>Fee Structure for Regular Students</h2>
          {/* {dse==="YES" &&(<h5>(Note for DSE : DSE students are supposed to pay one year prior fee hence previous years fee is displayed.)</h5>)} */}
          <p>{feeStructure.interim_fee != 0 && (<>Interim Fees : {feeStructure.interim_fee}/-</>)}</p>
          {/* <p>Development Fee: {feeStructure.development_fee}/-</p> */}
          {/* <p>Tuition Fee: {feeStructure.tuition_fee}/-</p> */}
          <p>Exam Fee: {feeStructure.exam_fee}/-</p>
          <p>Miscellaneous Fee: {feeStructure.misc_fee}/-</p>
          <p>{feeStructure.enrollment_fee != 0 && (<>Enrollment Fees : {feeStructure.enrollment_fee}/-</>)}</p>
          <h3><b>Total Fee: {feeStructure.interim_fee +feeStructure.enrollment_fee + feeStructure.exam_fee + feeStructure.misc_fee}/-</b></h3>
          
        </div>
        <div>
          <hr />
        <h2>Fee Structure for TFWS Students</h2>
          {/* {dse==="YES" &&(<h5>(Note for DSE : DSE students are supposed to pay one year prior fee hence previous years fee is displayed.)</h5>)} */}
          {/* <p>{feeStructure.interim_fee != 0 && (<>Interim Fees : {feeStructure.interim_fee}/-</>)}</p> */}
          {/* <p>Development Fee: {feeStructure.development_fee}/-</p> */}
          <p>{feeStructure.development_fee != 0 && (<>Development Fees : {feeStructure.development_fee}/-</>)}</p>
          {/* <p>{}</p> */}
          {/* <p>Tuition Fee: {feeStructure.tuition_fee}/-</p> */}
          <p>Exam Fee: {feeStructure.exam_fee}/-</p>
          <p>Miscellaneous Fee: {feeStructure.misc_fee}/-</p>
          <p>{feeStructure.enrollment_fee != 0 && (<>Enrollment Fees : {feeStructure.enrollment_fee}/-</>)}</p>
          <h3><b>Total Fee: {feeStructure.enrollment_fee + feeStructure.exam_fee + feeStructure.misc_fee + feeStructure.development_fee}/-</b></h3>
          <hr />
          <p> <center>(Additional Eligibility Fee will be considered for non Maharashtra State Board Students)</center> </p>
          <h4><p>{feeStructure.eligibility_fee != 0 && (<>Eligibility Fees : {feeStructure.eligibility_fee}/-</>)}</p></h4>
        </div>
        </>
      ):(
        <>
        <div>
          <h2>Fee Structure for DSE Students <br/>{selectedYear-1} Fee Structure</h2>
          {dse==="YES" &&(<h5>(Note for DSE : DSE students are supposed to pay one year prior fee hence previous years fee is displayed.)</h5>)}
          {/* <p>{feeStructure.interim_fee != 0 && (<>Interim Fees : {feeStructure.interim_fee}/-</>)}</p> */}
          <p>Tuition Fee: {feeStructure.tuition_fee}/-</p>
          <p>Development Fee: {feeStructure.development_fee}/-</p>
          <p>Exam Fee: {feeStructure.exam_fee}/-</p>
          <p>Miscellaneous Fee: {feeStructure.misc_fee}/-</p>
          <p>{feeStructure.enrollment_fee != 0 && (<>Enrollment cum Eligibility Fees : {feeStructure.enrollment_fee + feeStructure.eligibility_fee}/-</>)}</p>
          {/* <p>{feeStructure.eligibility_fee != 0 && (<>Eligibility Fees : {feeStructure.eligibility_fee}/-</>)}</p> */}
          <h3><b>Total Fee: {feeStructure.tuition_fee + feeStructure.development_fee + feeStructure.exam_fee + feeStructure.misc_fee + feeStructure.enrollment_fee+feeStructure.eligibility_fee}/-</b></h3>
        </div>
        </>
      )}
    </div>
    
  )
}

export default Documents;