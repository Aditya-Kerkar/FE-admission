import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CertificateList.css'; // Import the CSS file for styling

const CertificateList = () => {
  const certificates = [
    'SSC (Std.X) mark sheet.',
    'HSC/Diploma/B. Sc. mark sheet.',
    'JEE Score card',
    'MHCET Score card',
    'Leaving Certificate',
    'Domicile Certificate',
    'Birth Certificate',
    'Migration Certificate',
    'Income Certificate',
    'Cast/ Tribe Certificate',
    'Caste/Tribe validity certificate',
    'Non creamy layer certificate',
    'Gap Certificate',
    'Provisional Certificate',
    'Marksheet of Diploma',
    'Diploma convocation certificate',
  ];

  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (certificate) => {
    if (selectedCertificates.includes(certificate)) {
      setSelectedCertificates(selectedCertificates.filter(item => item !== certificate));
    } else {
      setSelectedCertificates([...selectedCertificates, certificate]);
    }
  };

  const handleNextClick = () => {
    navigate('/selected', { state: { selectedCertificates } });
  };

 

  return (
    <div className="container" style={{background:'none', borderRadius:"none", boxShadow:'none'}}>
      <h1>Documents Collected By College</h1>
      <ul className="certificate-list">
        {certificates.map((certificate, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                value={certificate}
                onChange={() => handleCheckboxChange(certificate)}
              />
              {certificate}
            </label>
          </li>
        ))}
      </ul>
      <div style={{display:'flex',justifyContent:'center',}}>
      <button className="next-button" onClick={handleNextClick}style={{background:' #ff8800',border: 'none', borderRadius:'5px',color:'white' ,fontSize: '16px', marginTop: '50px',width: '200px'}}>Next</button>
      <button className="next-button" style={{background:' #ff8800',border: 'none', borderRadius:'5px',color:'white' ,fontSize: '16px', marginTop: '50px',width: '200px', marginLeft:'100px'}}>Back</button>
      </div>
    </div>
  );
};

export default CertificateList;