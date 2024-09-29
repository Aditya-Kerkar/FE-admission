const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001; // or any other port you prefer

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

///To bypass security for email
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function mailsend(docName, email){
  const documentReject = docName;
  const emailtoSend = email;
  console.log(emailtoSend);
;  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'otp.graphicalauthenticator@gmail.com',
      pass: 'awdw yvwr unzw hqgj'
    }
  });
  
  const mailOptions = {
    from: 'otp.graphicalauthenticator@gmail.com',
    to: emailtoSend,
    subject: 'Rejected Documents',
    text: `${documentReject} Documnet Rejected \n Please visit admin office with correct softcopy of Corresponding document \n[File size < 250kb, File type allowed(pdf/jpeg/png) `,
    // attachments: [
    //   {
    //       path: 'E:/Desktop/attachment.txt'
    //   }
  // ]
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

//setting up file server
app.use('/files', express.static(path.join(__dirname, 'public')));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reg_portal' // Your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
let data = {};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const dirname = personalDetails.email.toString();
    console.log(dirname);
    console.log(typeof(dirname))
    
    const uploadPath = `public/${dirname}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // const fileString = this.filename;
    // console.log(file.fieldname.toString());
    // console.log(fileString); 
    const fileType = file.mimetype;
    if(fileType === 'application/pdf'){
      cb(null, `${file.fieldname.toString()}.pdf`);
    }
    else if(fileType === 'image/jpeg'){
      cb(null, `${file.fieldname.toString()}.jpeg`);
    }
    else if(fileType === 'image/png'){
      cb(null, `${file.fieldname.toString()}.png`);
    }

    
  }
});

  const upload = multer({ storage: storage });

app.post('/api/submit', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet10', maxCount: 1 },
  { name: 'leavingCertificate12', maxCount: 1 },
  { name: 'marksheet12', maxCount: 1 },
  { name: 'cetMarksheet', maxCount: 1 },
  { name: 'jeeMarksheet', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), (req, res) => {
  const personalDetails = JSON.parse(req.body.personalDetails);
  const academicDetails = JSON.parse(req.body.academicDetails);
  const cetDetails = JSON.parse(req.body.cetDetails);
  data = {
    id:1,
    fullname: personalDetails.fullName,
    email: personalDetails.email,
    mobile_number: personalDetails.mobileNumber,
    date_of_birth: personalDetails.dateofBirth,
    father_name: personalDetails.fathersName,
    father_occupation: personalDetails.fathersOccupation,
    father_mobile_number: personalDetails.fathersmobileNumber,
    mother_name: personalDetails.mothersName,
    mother_occupation: personalDetails.mothersOccupation,
    mother_mobile_number: personalDetails.mothersmobileNumber,
    sex: personalDetails.sex,
    annual_income: personalDetails.annualIncome,
    corres_address: personalDetails.corrAddr,
    permanent_address: personalDetails.perAddr,
    area: personalDetails.area,
    category: personalDetails.category,
    nationality: personalDetails.nationality,
    religion: personalDetails.religion,
    domicile: personalDetails.domicile,
    mother_tongue: personalDetails.mothersTongue,
    hsc_maths: academicDetails.hscmathsMarks,
    hsc_physics: academicDetails.hscphysicsMarks,
    hsc_chemistry: academicDetails.hscchemistryMarks,
    hsc_pcm_percentage: academicDetails.hscpcmPercentage,
    hsc_vocational_subject_name: academicDetails.hscvocationalSub,
    hsc_vocational_subject_percentage: academicDetails.hscvocationalsubjectPer,
    '10th_board_name': academicDetails.sscBoard,
    '10th_year_of_passing': academicDetails.sscyearofPass,
    '10th_total_marks': academicDetails.ssctotalMarks,
    '10th_marks_obtained': academicDetails.sscmarksObtained,
    '10th_percentage': academicDetails.sscPercentage,
    '12th_board_name': academicDetails.hscBoard,
    '12th_year_of_passing': academicDetails.hscyearofPass,
    '12th_total_marks': academicDetails.hsctotalMarks,
    '12th_marks_obtained': academicDetails.hscmarksObtained,
    '12th_percentage': academicDetails.hscPercentage,
    cet_application_id: cetDetails.cetappId,
    cet_roll_number: cetDetails.cetrollNo,
    cet_maths_percentile: cetDetails.cetmathsPer,
    cet_physics_percentile: cetDetails.cetphysicsPer,
    cet_chemistry_percentile: cetDetails.cetchemistryPer,
    jee_application_number: cetDetails.jeeappNum,
    jee_percentile: cetDetails.jeePer,
    marksheet10: req.files['marksheet10'] ? req.files['marksheet10'][0].path : null,
    leavingCertificate12: req.files['leavingCertificate12'] ? req.files['leavingCertificate12'][0].path : null,
    marksheet12: req.files['marksheet12'] ? req.files['marksheet12'][0].path : null,
    cetMarksheet: req.files['cetMarksheet'] ? req.files['cetMarksheet'][0].path : null,
    jeeMarksheet: req.files['jeeMarksheet'] ? req.files['jeeMarksheet'][0].path : null,
    signature: req.files['signature'] ? req.files['signature'][0].path : null
  };

  // const query = 'INSERT INTO user_details SET ?';
  console.log(data)
  return res.render(data);

  // db.query(query, data, (err, result) => {
  //   if (err) {
  //     console.error('Error inserting data:', err);
  //     return res.status(500).json({ message: 'Error inserting data' }); // Send JSON response on error
  //   }

  //   res.status(200).json({ message: 'Data inserted successfully' }); // Send JSON response on success
  // });
});


//Admin portal data fetching
// Create an endpoint to fetch data
app.get('/data', (req, res) => {
  const query = 'SELECT id, fullname, cet_application_id, documentsApproved, transactionproofStatus FROM user_details';
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

//Docverification page get and fetching
app.get('/docverification/:uid', (req, res) => {
  const userId = req.params.uid;
  console.log(userId);
  const query = `SELECT id, fullname, email, mobile_number, annual_income, category, cet_application_id, jee_application_number, photo, marksheet10, leavingCertificate12, marksheet12, cetMarksheet, jeeMarksheet, signature, domicilecert, castecertificate, castevalidity, noncreamylayer, income, other, photoStatus, leavingCertificate12Status, marksheet10Status, marksheet12Status, cetMarksheetStatus, jeeMarksheetStatus, signatureStatus, domicilecertStatus, castecertificateStatus, castevalidityStatus, noncreamylayerStatus, incomeStatus, otherStatus, transactionproofStatus, documentsApproved FROM user_details WHERE id = '${userId}';`;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

//Fetching documents URL and send the URL back to React
app.get('/docverification/:uid/:docname', (req, res) => {
  const userId = req.params.uid;
  const docname = req.params.docname;
  console.log(userId);
  console.log(docname)
  const query = `SELECT ${docname} FROM user_details WHERE id = '${userId}';`;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

//Document verification page making updation request to make document status to approve
app.put('/approveDoc/:uid/:docName', (req, res) => {
  const  uid  = req.params.uid;
  const  docName  = req.params.docName;

  const sql = `UPDATE user_details SET ${docName}Status = 'Approved' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details SET ${docName}Status = 'Approved' WHERE id = ${uid}`;
  console.log(sqlQuery);
 
  const values = [uid];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating entry: ' + err.stack);
      res.status(500).send('Error updating entry');
      return;
    }
    console.log('Updated entry with ID ' + uid);
    res.send('Entry updated successfully');
  });
});

//Document verification page making updation request to make document status to Reject
app.put('/rejectDoc/:uid/:email/:docName', (req, res) => {
  const  uid  = req.params.uid;
  const  docName  = req.params.docName;
  const  email = req.params.email;

  console.log(email)
  mailsend(docName, email);
  const sql = `UPDATE user_details SET ${docName}Status = 'Rejected' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details SET ${docName}Status = 'Rejected' WHERE id = ${uid}`;
  console.log(sqlQuery);
  const values = [uid];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating entry: ' + err.stack);
      res.status(500).send('Error updating entry');
      return;
    }
    console.log('Updated entry with ID ' + uid);
    res.send('Entry updated successfully');
  });
});

//Update all Document status to Approved
app.put('/DocumentsApproved/:uid', (req, res) => {
  const  uid  = req.params.uid;
  
  const sql = `UPDATE user_details SET documentsApproved = 'Approved' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details SET documentsApproved = 'Approved' WHERE id = ${uid}`;
  console.log(sqlQuery);
 
  const values = [uid];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating entry: ' + err.stack);
      res.status(500).send('Error updating entry');
      return;
    }
    console.log("All documents Approved sucessfully");
    res.send('Entry updated successfully');
  });
});

// Endpoint to handle file Reupload at Admin side
app.post('/reupload', upload.single('file'), (req, res) => {
  // Multer adds a 'file' object to the request object
  const file = req.file;
  if (!file) {
      return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
