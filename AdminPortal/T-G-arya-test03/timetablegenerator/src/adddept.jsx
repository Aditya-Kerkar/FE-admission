import React, {useState} from 'react';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDateInput from './CustomDateInput';

export default function Adddept() {
  const [selectedDate, setDate] = useState(null);

  const [filePreviews, setFilePreviews] = useState({});

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFilePreviews({
        ...filePreviews,
        [field]: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div>
    <form id = "add-dept-cont">
    <div className="inputs">
      <div className="input-field">
        <label for="department-name">Full Name:</label>
        <input type="text" id="department-name" placeholder="Enter department name" />
      </div>
      <div className="input-field">
        <label for="semester">Email:</label>
        <input type="text" id="semester" placeholder="Enter semester" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">Mobile number:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">Date of birth:</label>
          <Datepicker 
            selected={selectedDate} 
            onChange={date => setDate(date)} 
            customInput={<CustomDateInput />}
          />
        </div>
      </div>
      <div className="input-field">
        <label for="semester">Father's Name:</label>
        <input type="text" id="semester" placeholder="Enter semester" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">Father's Occupation:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">Father's Mobile Number:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-field">
        <label for="semester">Mother's Name:</label>
        <input type="text" id="semester" placeholder="Enter semester" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">Mother's Occupation:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">Mother's Mobile Number:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="sex">Sex:</label>
          <select id="sex" className="dropdown-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="input-field">
          <label for="semester">Annual Income:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-field">
        <label for="semester">Correspondence address:</label>
        <input type="text" id="semester" placeholder="Enter semester" />
      </div>
      <div className="input-field">
        <label for="semester">Permanent address:</label>
        <input type="text" id="semester" placeholder="Enter semester" />
      </div>
      <div className="input-field">
        <label for="sex">Area:</label>
        <select id="sex" className="dropdown-field">
          <option value="urban">Urban</option>
          <option value="rural">Rural</option>
        </select>
      </div>
      <div className="input-field">
          <label for="sex">Category:</label>
          <select id="sex" className="dropdown-field">
            <option value="male">General</option>
            <option value="other">OBC</option>
            <option value="female">SC</option>
            <option value="other">ST</option>
            <option value="other">EWS</option>
            <option value="other">EBC</option>
            <option value="other">MBC</option>
          </select>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">Nationality:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">Religion:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">Domicile:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">Mother tongue:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <br></br>

      <h1 className="center page-heading">Academic Details</h1>

      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">HSC maths marks:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">HSC physics marks:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">HSC chemistry marks:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">HSC PCM percentage:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-field">
        <label for="department-name">HSC vocational subject name:</label>
        <input type="text" id="department-name" placeholder="Enter department name" />
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">HSC vocational subject marks:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">HSC vocational subject percentage:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>        

      <label id="course-details">Course Details: </label>
    <table className="course-table">
      <thead>
        <tr>
          <th>Exam Passed</th>
          <th>Board / University</th>
          <th>Year of passing</th>
          <th>Total marks</th>
          <th>Marks obtained</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>S.S.C(10th)</th>
          <td><input type="text" className="course-code" /></td>
          <td><input type="text" className="course-name" /></td>
          <td><input type="text" className="theory-time" /></td>
          <td><input type="text" className="practical-time" /></td>
          <td><input type="text" className="tutorial-time" /></td>
        </tr>
        <tr>
          <th>H.S.C(12th) / Diploma</th>
          <td><input type="text" className="course-code" /></td>
          <td><input type="text" className="course-name" /></td>
          <td><input type="text" className="theory-time" /></td>
          <td><input type="text" className="practical-time" /></td>
          <td><input type="text" className="tutorial-time" /></td>
        </tr>
      </tbody>
    </table>
      <br></br>
      {/* CET DETAILS */}
      <h1 className="center page-heading">CET Details</h1>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">CET application ID:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">CET roll number:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">CET maths percentage:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">CET physics percentage:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">CET chemistry percentage:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">CET Percentile:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>


      <h1 className="center page-heading">JEE Details</h1>
      <div className="input-fields side-by-side">
        <div className="input-field">
          <label for="semester">JEE application number:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
        <div className="input-field">
          <label for="semester">JEE percentile:</label>
          <input type="text" id="semester" placeholder="Enter semester" />
        </div>
      </div>
      <br></br>
      {/* DOCUMENT UPLOADING */}
      <h1 className="center page-heading">Document Uploading</h1>

      <table className="course-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Upload</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Passport size photo", field: "photo" },
              { label: "10th Marksheet", field: "marksheet10" },
              { label: "12th Leaving Certificate", field: "leavingCertificate12" },
              { label: "12th Marksheet", field: "marksheet12" },
              { label: "CET Marksheet", field: "cetMarksheet" },
              { label: "JEE Marksheet", field: "jeeMarksheet" },
              { label: "Signature", field: "signature" },
            ].map((doc, index) => (
              <tr key={index}>
                <th>{doc.label}</th>
                <td><input type="file" name="files" onChange={(e) => handleFileChange(e, doc.field)} /></td>
                <td>
                  {filePreviews[doc.field] && (
                    <div>
                      {doc.field === "photo" || doc.field === "signature" ? (
                        <img src={filePreviews[doc.field]} alt={`${doc.label} preview`} width="100" />
                      ) : (
                        <a href={filePreviews[doc.field]} target="_blank" rel="noopener noreferrer">View {doc.label}</a>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
    </div>
    
    <br></br>
    
    <div className="center">
      <button className="add-course"><b>+ SUBMIT DATA</b></button>
    </div>
    </form>
    </div>
  );
}
