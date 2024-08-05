import React, { useState } from 'react';
import './FAQ.css'; // Create this CSS file with the same styles as above

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "If my payment method is 'by cash', What should I enter in transaction ID?",
      answer: "If the payment method is 'by cash' then keep the transaction ID field empty, You can conveniently navigate to the next page."
    },
    {
      question: "What should I type in the vocational subjects marks if it is out of 200?",
      answer: "If out of 200 then, convert it to 100 and then type that in the vocational subjects marks."
    },
    {
      question: "What is the procedure after I submit the online form?",
      answer: "After online application, The document verification in-person at the college office & confirmation of application from is to be done between: 22/07/2024 to 03/08/2024."
    },
    {
      question: "Why am I unable to select class?",
      answer: "The default value is supposed to be FE. So students need not to change the class."
    },
    {
      question: "Why am I unable to select Payment for?",
      answer: "The default value is supposed to be Admission form fees. So students need not to change the payment for."
    },
    {
      question: "Why am I unable to select Date of Birth using Calender?",
      answer: "If you are facing difficulty to use Calender you can directly type in the Date of Birth in format DD/MM/YYYY including the '/' ."
    },
    {
      question: "Can I refill the from after submission?",
      answer: "NO, You are not allowed to resubmit the form, Please contact the office for any further query."
    }
  ];

  return (
    <div className="container">
        <h1 className="center page-heading">FAQ's</h1>
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div className="faq" key={index}>
            <div className="question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className={`arrow ${activeIndex === index ? 'up' : 'down'}`}>▼</span>
            </div>
            <div className={`answer ${activeIndex === index ? 'show' : ''}`}>
                <b>
              {faq.answer}
              </b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
