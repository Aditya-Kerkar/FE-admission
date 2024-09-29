import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadPDFButton = ({ formContent }) => {
  const downloadPDF = () => {
    const input = document.getElementById(formContent);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('fee_receipt.pdf');
    });
  };

  return (
    <button type="button" onClick={downloadPDF} style={{background:' #ff8800',border: 'none', borderRadius:'5px',color:'white' ,fontSize: '16px', marginTop: '20px',width: '200px', height:'50px'}}>
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;

