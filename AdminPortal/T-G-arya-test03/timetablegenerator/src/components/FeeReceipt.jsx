import { useRef, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './FeeReceipt.css'; // Assuming you have a CSS file for additional styling
import { useNavigate, useLocation } from 'react-router-dom';

function FeeReceipt() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const navigate = useNavigate();
  const location = useLocation();
  const receivedState = location.state;

  const formattedDate = `${day}-${month}-${year}`;
  const [formData] = useState({
    rollNo: '222a3065',
    studentName: 'Arshad',
    receiptDate: formattedDate
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'FeeReceipt',
    pageStyle: `
      @page {
        size: auto;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });

  const sendFeeReceipt = async () => {
    // Capture the component as an image
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL('image/png');

    // Convert image to PDF
    const pdf = new jsPDF();
    const margin = 10;
    const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');

    // Create FormData and append the PDF Blob
    const formData = new FormData();
    formData.append('email', receivedState.email);
    formData.append('file', pdfBlob, 'FeeReceipt.pdf');

    // Send the FormData to the backend
    try {
      const response = await fetch('http://localhost:3001/uploadfeereceipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert('PDF sent successfully');
      console.log(result);
    } catch (error) {
      console.error('There was an error sending the PDF!', error);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <button type="button" className="btn backbtn" onClick={() => { navigate('/') }}>Back</button>
        </div>
      </div>
      <div ref={componentRef} style={{ padding: '20px', margin: '20px' }}>
        <div className="header">
          <img src="/image.png" alt="SIES Logo" className="logo" />
          <div className="info">
            <h1>The South Indian Education Society</h1>
            <p>SIES Graduate School of Technology</p>
            <p>Sri Chandrasekarendra Saraswati Vidyapuram Sector-V, Nerul, Navi Mumbai, Maharashtra 400706</p>
            <p>Fee Receipt (Student Copy - Original)</p>
          </div>
        </div>
        <div className="body">
          <div className="row rowpay2">
            <div className="col colpay2">
              Admission form fees
            </div>
          </div>
          <div className="row rowpay">
            <div className="col colpay">
              User ID : {receivedState.uidtoSend}
            </div>
            <div className="col colpay">
              Student Name : {receivedState.fullName}
            </div>
          </div>
          <div className="row rowpay">
            <div className="col colpay">
              Receipt Date : {formData.receiptDate}
            </div>
            <div className="col colpay">
              Amount Paid : 2000
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="row rowpay">
            <div className="col colpay">
              <div className="signature">
                <p>Signature</p>
                <p>(Account by : Vijayalakshami )</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row row-send">
        <div className="col col-send">
          <button type="button" className="btn btn-send" onClick={sendFeeReceipt}>
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeeReceipt;