import React, { useState, forwardRef, useImperativeHandle } from 'react';

const CETDetails = forwardRef(({ formData, setFormData, setError }, ref) => {
  // const [formData, setFormData] = useState({
  //   cetappId: '',
  //   cetrollNo: '',
  //   cetmathsPer: '',
  //   cetphysicsPer: '',
  //   cetchemistryPer: '',
  //   jeeappNum: '',
  //   jeePer: '',
  // });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, cetDetails: { ...prevFormData.cetDetails, [id]: value } }));
  };

  const validate = () => {
    const { cetappId,
        cetrollNo,
        cetmathsPer,
        cetphysicsPer,
        cetchemistryPer,
        jeeappNum,
        jeePer  } = formData.cetDetails;
    if (!cetappId ||
        !cetrollNo ||
        !cetmathsPer ||
        !cetphysicsPer ||
        !cetchemistryPer ||
        !jeeappNum ||
        !jeePer) {
      setError('Please fill out all fields.');
      alert('Please fill out all fields.')
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
      <h1 className="center page-heading">CET Details</h1>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetappId">CET application ID:</label>
          <input type="text" id="cetappId" value={formData.cetDetails.cetappId} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="cetrollNo">CET roll number:</label>
          <input type="text" id="cetrollNo" value={formData.cetDetails.cetrollNo} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetmathsPer">CET maths percentage:</label>
          <input type="text" id="cetmathsPer" value={formData.cetDetails.cetmathsPer} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="cetphysicsPer">CET physics percentage:</label>
          <input type="text" id="cetphysicsPer" value={formData.cetDetails.cetphysicsPer} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="cetchemistryPer">CET chemistry percentage:</label>
          <input type="text" id="cetchemistryPer" value={formData.cetDetails.cetchemistryPer} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="cetPer">CET Percentile:</label>
          <input type="text" id="cetPer" value={formData.cetDetails.cetPer} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>


      <h1 className="center page-heading">JEE Details</h1>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="jeeappNum">JEE application number:</label>
          <input type="text" id="jeeappNum" value={formData.cetDetails.jeeappNum} onChange={handleChange} placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="jeePer">JEE percentile:</label>
          <input type="text" id="jeePer" value={formData.cetDetails.jeePer} onChange={handleChange} placeholder="Enter semester" />
        </div>
      </div>
      <br></br>
      {/* Add your CET details form fields here */}
    </div>
  );
});

export default CETDetails;
