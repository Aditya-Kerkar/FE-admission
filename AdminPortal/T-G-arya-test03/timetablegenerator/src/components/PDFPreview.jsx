import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PdfPreview = ({ fileURL }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`https://lunch-frozen-norwegian-radiation.trycloudflare.com/files/${fileURL}`, {
          responseType: 'blob',
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [fileURL]);

  return pdfUrl ? (
    <iframe src={pdfUrl} width="100%" height="500px" title="PDF Preview"></iframe>
  ) : (
    <p>Loading PDF...</p>
  );
};

export default PdfPreview;
