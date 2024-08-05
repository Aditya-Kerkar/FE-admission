import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import CustomDateInput from './CustomDateInput';

const PersonalDetails = forwardRef(({ formData, setFormData, setError }, ref) => {
  const [selectedDate, setDate] = useState(null);
  // const [formData, setFormData] = useState({
  //   fullName: '',
  //   email: '',
  //   mobileNumber: '',
  //   fathersName: '',
  //   fathersmobileNumber: '',
  //   fathersOccupation: '',
  //   mothersName: '',
  //   mothersOccupation: '',
  //   mothersmobileNumber: '',
  //   annualIncome: '',
  //   sex: '',
  //   corrAddr: '',
  //   perAddr: '',
  //   area: '',
  //   category: '',
  //   nationality: '',
  //   religion: '',
  //   domicile: '',
  //   mothersTongue: '',
  // });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, personalDetails: { ...prevFormData.personalDetails, [id]: value } }));
  };

  const handleDateChange = (date) => {
    setDate(date);
    setFormData((prevFormData) => ({...prevFormData, personalDetails: {...prevFormData.personalDetails, dateofBirth: date } }));
  };

  const validate = () => {
    const { 
        fullName,
        email,
        mobileNumber,
        fathersName, 
        fathersmobileNumber,
        fathersOccupation,
        mothersName,
        mothersOccupation,
        mothersmobileNumber,
        annualIncome,
        sex,
        corrAddr,
        perAddr,
        area,
        category,
        nationality,
        religion,
        domicile,
        mothersTongue,
        dateofBirth } = formData.personalDetails;

    if (!fullName || !email || !mobileNumber || !fathersName || !fathersmobileNumber ||
        !fathersOccupation ||
        !mothersName ||
        !mothersOccupation ||
        !mothersmobileNumber ||
        !annualIncome ||
        !sex ||
        !corrAddr ||
        !perAddr ||
        !area ||
        !category ||
        !nationality ||
        !religion ||
        !domicile ||
        !mothersTongue ||
        !dateofBirth) {
      alert('Please fill out all fields.');
      return false;
    }
    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate
  }));


  return (
    <div>
      <h1 className="center page-heading">Personal Details</h1>
      <div className="inputs">
        <div className="input-field">
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" value={formData.personalDetails.fullName} placeholder="Enter full name" onChange={handleChange} />
        </div>
        <div className="input-field">
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" value={formData.personalDetails.email} onChange={handleChange} placeholder="Enter email" />
        </div>
        <div className="input-fields side-by-side">
          <div className="input-field">
            <label htmlFor="mobileNumber">Mobile number:</label>
            <input type="text" id="mobileNumber" value={formData.personalDetails.mobileNumber} onChange={handleChange} placeholder="Enter mobile no" />
          </div>
          <div className="input-field">
            <label htmlFor="dateofBirth">Date of birth(dd/mm/yyyy):</label>
            <Datepicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="input-field">
        <label for="fathersName">Father's Name:</label>
        <input type="text" id="fathersName" value={formData.personalDetails.fathersName} onChange={handleChange} placeholder="Enter fathers name" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="fathersOccupation">Father's Occupation:</label>
          <input type="text" id="fathersOccupation" value={formData.personalDetails.fathersOccupation} onChange={handleChange} placeholder="Enter fathers Occupation" />
        </div>
        <div className="input-field">
          <label for="fathersmobileNumber">Father's Mobile Number:</label>
          <input type="text" id="fathersmobileNumber" value={formData.personalDetails.fathersmobileNumber} onChange={handleChange} placeholder="Enter mobile number" />
        </div>
      </div>
      <div className="input-field">
        <label for="mothersName">Mother's Name:</label>
        <input type="text" id="mothersName" value={formData.personalDetails.mothersName} onChange={handleChange} placeholder="Enter semester" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="mothersOccupation">Mother's Occupation:</label>
          <input type="text" id="mothersOccupation" value={formData.personalDetails.mothersOccupation} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="mothersmobileNumber">Mother's Mobile Number:</label>
          <input type="text" id="mothersmobileNumber" value={formData.personalDetails.mothersmobileNumber} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="sex">Sex:</label>
          <select id="sex" className="dropdown-field" value={formData.personalDetails.sex} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="input-field">
          <label for="annualIncome">Annual Income:</label>
          <input type="text" id="annualIncome" value={formData.personalDetails.annualIncome} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-field">
        <label for="corrAddr">Correspondence address:</label>
        <input type="text" id="corrAddr" value={formData.personalDetails.corrAddr} onChange={handleChange} placeholder="Enter semester" />
      </div>
      <div className="input-field">
        <label for="perAddr">Permanent address:</label>
        <input type="text" id="perAddr" value={formData.personalDetails.perAddr} onChange={handleChange} placeholder="Enter semester" />
      </div>
      <div className="input-field">
        <label for="area">Area:</label>
        <select id="area" className="dropdown-field" value={formData.personalDetails.area} onChange={handleChange}>
          <option value="urban">Urban</option>
          <option value="rural">Rural</option>
        </select>
      </div>
      <div className="input-field">
          <label for="category">Category:</label>
          <select id="category" className="dropdown-field" value={formData.personalDetails.category} onChange={handleChange}>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
            <option value="ebc">EBC</option>
            <option value="mbc">MBC</option>
          </select>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="nationality">Nationality:</label>
          <input type="text" id="nationality" value={formData.personalDetails.nationality} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="religion">Religion:</label>
          <input type="text" id="religion" value={formData.personalDetails.religion} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="domicile">Domicile:</label>
          <input type="text" id="domicile" value={formData.personalDetails.domicile} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="mothersTongue">Mother tongue:</label>
          <input type="text" id="mothersTongue" value={formData.personalDetails.mothersTongue} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      </div>
      <br></br>
    </div>
  );
});

export default PersonalDetails;