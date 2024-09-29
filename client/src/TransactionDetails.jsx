import React, { useState, useEffect, useCallback,useMemo, forwardRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const TransactionForm = forwardRef(({ formData, setFormData,formData1,setFormData1,boardEligibility,dse}, ref) => {

 
  

  const [formErrors, setFormErrors] = useState({});
  const [formType, setFormType] = useState(formData.formType);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const verifyDetails = useCallback((text, formData1) => {
    const lines = text.split('\n');
    let ocrResult = { date: '', amount: '', transactionId: '' };
    lines.forEach(line => {
      const [key, value] = line.split(':');
      switch (key.trim()) {
        case 'Date':
          ocrResult.date = parseAndFormatDate(value.trim());
          break;
        case 'Amount':
          ocrResult.amount = value.trim();
          break;
        case 'Transaction ID':
          ocrResult.transactionId = value.trim();
          break;
        default:
          break;
      }
    });

    // console.log('OCR Result:', ocrResult);
    // console.log('Form Data:', formData);

    if (ocrResult.date !== formData1.date) {

      setMessage(`Transaction not approved. Please contact the Admin.`);
    } else {
      setMessage('Transaction verified and approved!');
    }
  }, []);


  const calculateFees = useCallback(() => {
    if (dse === "DSE" || dse === "DSE MINORITY") {
      const totalfeecal = formData1.feeStructure[0].tuition_fee +
        formData1.feeStructure[0].development_fee +
        formData1.feeStructure[0].exam_fee +
        formData1.feeStructure[0].misc_fee +
        formData1.feeStructure[0].enrollment_fee +
        formData1.feeStructure[0].eligibility_fee;
      console.log(totalfeecal);
      setFormData1(prev => ({ ...prev, amount: totalfeecal }));
    } else if (dse === "CAP TFWS") {
      let tfwsfees=0;
      if (boardEligibility != "MSBSHSE") {
        tfwsfees = (formData1.feeStructure[1].eligibility_fee +
          formData1.feeStructure[1].development_fee +
          formData1.feeStructure[1].misc_fee +
          formData1.feeStructure[1].enrollment_fee +
          formData1.feeStructure[1].exam_fee);
        }else{
        tfwsfees = formData1.feeStructure[1].misc_fee +
          formData1.feeStructure[1].development_fee +
          formData1.feeStructure[1].enrollment_fee +
          formData1.feeStructure[1].exam_fee;
        }
        // console.log(boardEligibility)
      console.log(tfwsfees);
      setFormData1(prev => ({ ...prev, amount: tfwsfees }));
    } else if (dse==="CAP Level" || dse === "Minority Level" || dse==="Admission Against CAP Vacancy" || dse==="Institute Level" || dse==="other"){

      if(boardEligibility === "MSBSHSE") {
        const fetotalfeecal = formData1.feeStructure[1].interim_fee +
          formData1.feeStructure[1].enrollment_fee +
          formData1.feeStructure[1].exam_fee +
          formData1.feeStructure[1].misc_fee;
        console.log(fetotalfeecal);
        setFormData1(prev => ({ ...prev, amount: fetotalfeecal }));
      } else {
        const fetotalfeecal2 = formData1.feeStructure[1].interim_fee +
          formData1.feeStructure[1].enrollment_fee +
          formData1.feeStructure[1].exam_fee +
          formData1.feeStructure[1].misc_fee +
          formData1.feeStructure[1].eligibility_fee;
        console.log(fetotalfeecal2);
        setFormData1(prev => ({ ...prev, amount: fetotalfeecal2 }));
      }
    }else if(dse === "DSE ACAP"){

        const totaldseacap=2500;
      
      console.log(totaldseacap);
      setFormData1(prev => ({ ...prev, amount: totaldseacap }));
    }else{
      const fetotalfeecalother = formData1.feeStructure[1].interim_fee +
      formData1.feeStructure[1].enrollment_fee +
      formData1.feeStructure[1].exam_fee +
      formData1.feeStructure[1].misc_fee +
      formData1.feeStructure[1].eligibility_fee;
    console.log(fetotalfeecalother);
    setFormData1(prev => ({ ...prev, amount: fetotalfeecalother }));
    }
     
  }, [dse, boardEligibility, formData1, setFormData1]);

  // Call calculateFees only when needed
  useEffect(() => {
    calculateFees();
  }, [calculateFees]);

  useEffect(() => {
    if (generatedText) {
      setLoading(false);
      verifyDetails(generatedText, formData1);
    }
  }, [generatedText, formData1, verifyDetails]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData1({
      ...formData1,
      [name]: files ? files[0] : value
    });
    console.log(value)
  };

  const handleDateChange = (date) => {
    setFormData1({
      ...formData1,
      date: date ? date.toLocaleDateString('en-GB') : ''
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData1.date) {
      errors.date = 'Date of Transaction is required.';
    }
    if (!formData1.transactionId) {
      errors.transactionId = 'Transaction ID is required.';
    }
    if (!formData1.file) {
      errors.file = 'Proof of transaction is required.';
    }
    if (formData1.paymentAgainst === 'select payment for') {

      errors.paymentAgainst = 'Please select the purpose of payment.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData1.file) return;
    if (!validateForm()) return;
    setLoading(true);
    const genAI = new GoogleGenerativeAI('AIzaSyDYecx7ZQUfrUOksHRU1JHLFPxJuHyfy5Y');
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const prompt = "Read the image which is proof of transaction and extract all details like date, Transaction ID and amount(no currency symbol) without mistake.";
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imagePart = {
        inlineData: {
          data: reader.result.split(",")[1],
          mimeType: formData1.file.type
        },
      };
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = await response.text();
      setGeneratedText(text);
    };
    reader.readAsDataURL(formData1.file);
  };

  const parseAndFormatDate = (dateString) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parseSingleDate = (singleDateString) => {
      let parsedDate = new Date(singleDateString);
      if (!isNaN(parsedDate)) {
        return parsedDate.toLocaleDateString('en-GB');
      } else {
        const regex = /(\d{1,2})\w{2} ([a-zA-Z]+) (\d{4})/;
        const matches = singleDateString.match(regex);
        if (matches && matches.length === 4) {
          const monthIndex = monthNames.findIndex(month => month.toLowerCase() === matches[2].toLowerCase());
          if (monthIndex !== -1) {
            const month = (monthIndex + 1).toString().padStart(2, '0');
            const day = matches[1].padStart(2, '0');
            return `${day}/${month}/${matches[3]}`;
          }
        }
      }
      return dateString;
    };
    if (dateString.toLowerCase().includes('to')) {
      const dateParts = dateString.split('to');
      if (dateParts.length === 2) {
        const startDate = parseSingleDate(dateParts[0].trim());
        const endDate = parseSingleDate(dateParts[1].trim());
        return `${startDate} - ${endDate}`;
      }
    }
    return parseSingleDate(dateString);
  };

  useEffect(() => {
    let defaultPayment;
    switch (formType) {
      case 'Form A':
        defaultPayment = 'Admission Brochure Fees';
        break;
      case 'Form B':
        defaultPayment = 'Admission Fees';
        break;
      case 'Form C':
        defaultPayment = 'SE/TE/BE Fees';
        break;
      default:
        defaultPayment = 'select payment for';
    }
    setFormData1({ ...formData1, paymentAgainst: defaultPayment });
  }, [formType]);


  return (
    <div>
      <h1 className='center page-heading'>Banking Details For Payment</h1>
      <div className='container'>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Account Holder's Name</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  SIES Graduate School of Technology</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Account No.</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  520101005681101</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Bank Name</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  Union Bank of India</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Branch Name</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  Nerul, Navi Mumbai</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>IFSC Code</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  UBIN0905721</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Account Type</span>
              <span style={{ flex: '1', textAlign: 'left' }}>:  Savings</span>
            </div>
          </div>

          <br />
          <p>Please note that after making the payment, share the UTR No., so that we will be able to generate the fee receipt for you.</p>
        </div>
        <br />
      </div>

      <h1 className='center page-heading'>Transaction Details</h1>
      {dse !=="DSE ACAP" && ( <p><center>( A fee of Rs 2500 will be charged if Brochure form (Institute Level Form) is not filled .)</center></p>)}
     
      <form onSubmit={handleSubmit}>
        <div className='container'>
          <div className="inputs">
              

          <div className="input-field">
      <label htmlFor="paymentAgainst">Payment For:</label>
      <select
        id="paymentAgainst"
        className="dropdown-field"
        value={formData1.paymentAgainst}
        onChange={handleChange}
        name="paymentAgainst"
        disabled={true} // Disables the dropdown
      >
        <option value="select payment for">Select payment for</option>
        <option value="Admission Brochure Fees">Admission Brochure Fees</option>
        <option value="Admission Fees" selected >Admission Fees</option>
        <option value="SE/TE/BE Fees">SE/TE/BE Fees</option>
      </select>
    </div>

    
            <div className="input-field">
              <label htmlFor="paymentMode">Payment Mode:</label>
              <select id="paymentMode" className="dropdown-field"  value={formData1.paymentMode} onChange={handleChange} name="paymentMode">
                <option value="" disabled selected>Select payment for</option>
                
                <option value="online_payment">Online Payment</option>
                <option value="DD">DD</option>
              </select>
            </div>

            {formData1.paymentMode === 'DD' && (
              <div className='input-field'>
                <label htmlFor="draftedBy">Drafted By:</label>
                <input type="text" name="draftedBy" placeholder="Enter Drafted By" value={formData1.draftedBy} onChange={handleChange} />
              </div>
            )}

            <div className='input-fiels side-by-side'>
            <div className='input-field'>
              <label htmlFor="amount">Amount:</label>
              {/* {eligibility==="MSBSHSE" ?(<input type="text" name="amount" value={formData1.amount + "/-"} readOnly /> ):(<input type="text" name="amount" value={(formData1.amount+500 )+ "/-"} readOnly />)} */}
              <input type="text" name="amount" value={formData1.amount + "/-"} readOnly />
            </div>
            <div className='input-field'>
              <label htmlFor="date">Date of Transaction:</label>
              <DatePicker
                selected={formData1.date ? new Date(formData1.date.split('/').reverse().join('-')) : null}
                onChange={date => handleDateChange(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
              {formErrors.date && <div className="error">{formErrors.date}</div>}
            </div>

            </div>

            <div className='input-field'>
              <label htmlFor="transactionId">Transaction ID / DD Number:</label>
              <input type="text" name="transactionId" placeholder="Enter Transaction ID" value={formData1.transactionId} onChange={handleChange} />
              {formErrors.transactionId && <span className="error">{formErrors.transactionId}</span>}
            </div>



            {/* <div className='input-field'>
              <label htmlFor="file">Upload Proof (only* JPG format):</label>
              <input type="file" name="file" accept="image/*" onChange={handleChange} />
            </div> */}

            {loading && <p>Loading...</p>}

            {/* <div className='buttons'>
              <button type="submit">Submit</button>
            </div> */}
          </div>
          <div className='center page-heading'>
            {message && <p>{message}</p>}
          </div>
        </div>
      </form>
    </div>
  );
});

export default TransactionForm;