import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DownloadPDFButton from './DownloadPDFButton';
import './SelectedCertificates.css'; // Import the CSS file for styling

const SelectedCertificates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCertificates } = location.state || { selectedCertificates: [] };
  const [formData, setFormData] = useState({
    rollNo: '222a3065',
    studentName: 'Arshad',
    class: 'it',
    receiptDate: '20/12/2025',
    tuitionFees: '2000',
    developmentFees: '2000',
    examFees: '2000',
    miscellaneousFees: '2000',
    refno: '07',
    receiptNo: '20/12/2013',
  });

  const handleSubmit = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  return (
    <div>
      <div id="pdf-content">
        <div className="header">
          <img src='/sieslogo.jpeg' alt='SIES Logo' className="logo" />
          <div className="info">
            <h1>The South Indian Education Society</h1>
            <p>SIES Graduate School of Technology</p>
            <p>Sri Chandrasekarendra Saraswati Vidyapuram Sector-V, Nerul, Navi Mumbai, Maharashtra 400706</p>
            <p>Fee Receipt (Student Copy - Original)</p>
          </div>
        </div>
        <div className='body'>
          <form onSubmit={handleSubmit} style={{ margin: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Roll No:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.rollNo}</span>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Receipt Date:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.receiptDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Student Name:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.studentName}</span>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Ch.No/Neft Ref No:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.refno}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Class:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.class}</span>
              <span style={{ fontWeight: 'bold', flex: '1' }}>Receipt No:</span>
              <span style={{ flex: '1', textAlign: 'left' }}>{formData.receiptNo}</span>
            </div>

              {selectedCertificates.length > 0 ? (
                <table className="certificate-table">
                  <thead>
                    <tr>
                      <th>Submitted Original Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCertificates.map((certificate, index) => (
                      <tr key={index}>
                        <td>{certificate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No certificates selected.</p>
              )}
            <p>Signature</p>
            <p>(Account by: Vijayalakshami)</p>
          </form>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '50px' }}>
        <DownloadPDFButton formContent={'pdf-content'} />
        <button onClick={() => navigate(-1)} style={{background:' #ff8800',border: 'none', borderRadius:'5px',color:'white' ,fontSize: '16px', marginTop: '20px',width: '200px'}}>Back</button>
      </div>
    </div>
  );
};

export default SelectedCertificates;

