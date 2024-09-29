const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const mysql2 = require('mysql2/promise');
const util = require('util');
const { Console } = require('console');
// const { default: AdmissionForm } = require('../AdmissionForm');
const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dhadgepavans',
  database: 'reg_portal'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Temporary storage for OTPs (consider using a more robust solution in production)
const otps = {};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asiesgst@gmail.com',
    pass: 'ilnb jboi ekcf lyfp'
  }
});


const transporter2 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asiesgst@gmail.com',
    pass: 'ilnb jboi ekcf lyfp'
  }
});

app.post('/api/generate-key-and-send-otp2', (req, res) => {
  const { gst, email, userId } = req.body;



  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store user details temporarily with the OTP and unique key
  otps[gst] = { otp, userId };

  // Send OTP via email
  const mailOptions = {
    from: 'asiesgst@gmail.com',
    to: gst,
    subject: 'Your OTP Code for GST Email Verification',
    text: `Your OTP code is ${otp}`,
  };

  transporter2.sendMail(mailOptions, (error, info) => {
    if (error) {

      console.error('Error sending OTP:', error);
      return res.status(500).json({ message: 'Error sending OTP' });
    }

    res.status(200).json({ message: 'OTP sent successfully', key: userId });
  });
});

// Endpoint to verify OTP and store in database
app.post('/api/verify-otp-and-store2', (req, res) => {
  const { gst, otp, email } = req.body;

  // Log received OTP verification request
  console.log('Received OTP verification request for GST:', gst);
  console.log('Received OTP from client:', otp);


  // Verify OTP
  if (otps[gst] && otps[gst].otp.trim() === otp.trim()) {
    console.log('Correct otp')
    const { userId } = otps[gst];

    // Log stored OTP
    console.log('Stored OTP:', otps[gst].otp);

    // Insert user into database
    const query = 'INSERT INTO gst (gst, email, id) VALUES (?, ?, ?)';
    db.query(query, [gst, email, userId], (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        return res.status(500).json({ message: 'Error inserting data' });
      }
      // OTP verified and user stored in database, remove OTP from temporary store
      delete otps[gst];
      res.status(200).json({ success: true });
    });
  } else {
    // Invalid OTP
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});




app.post('/api/generate-key-and-send-otp', (req, res) => {
  const { email, password } = req.body;

  // Generate unique key
  const uniqueKey = Date.now();

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store user details temporarily with the OTP
  otps[email] = { password, otp, uniqueKey };

  // Send OTP via email
  const mailOptions = {
    from: 'asiesgst@gmail.com',
    to: email,
    subject: 'Your OTP Code for SIESGST Admission Portal',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending OTP' + info });
    }
    res.status(200).json({ message: 'OTP sent successfully', key: uniqueKey });
  });
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Verify OTP
  if (otps[email] && otps[email].otp == otp) {
    // OTP is correct, store user in database
    const { password, uniqueKey } = otps[email];
    const query = 'INSERT INTO user_registration (email, password, id) VALUES (?, ?, ?)';
    db.query(query, [email, password, uniqueKey], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error inserting data' });
      }
      // OTP is correct, remove it from the temporary store
      delete otps[email];
      res.status(200).json({ success: true });
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists and the password matches
  const query = 'SELECT id FROM user_registration WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length > 0) {
      const userId = results[0].id;
      res.status(200).json({ success: true, userData: { email, uniqueKey: results[0].unique_key, userId } });
    } else {
      res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
  });
});


app.post('/api/request-reset-password', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT id FROM user_registration WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Not a registered user' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { otp };

    const mailOptions = {
      from: 'asiesgst@gmail.com',
      to: email,
      subject: 'Your Password Reset OTP for SIES Admission Portal',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP' });
      }

      res.status(200).json({ message: 'OTP sent successfully' });
    });
  });
});


app.post('/api/check-verification-status', (req, res) => {
  const { gst, email } = req.body;

  // Example: Query your database to check if user is registered
  const query = 'SELECT COUNT(*) AS count FROM gst WHERE gst = ? AND email = ?';
  db.query(query, [gst, email], (err, result) => {
    if (err) {
      console.error('Error checking verification status:', err);
      return res.status(500).json({ verified: false, message: 'Internal server error' });
    }

    if (result[0].count > 0) {
      // User is registered
      res.status(200).json({ verified: true });
    } else {
      // User is not registered
      res.status(200).json({ verified: false });
    }
  });
});

////////////////////////////////prathamesh trial 3

app.post('/api/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (otps[email] && otps[email].otp == otp) {
    const query = 'UPDATE user_registration SET password = ? WHERE email = ?';
    db.query(query, [newPassword, email], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Error updating password' });
      }

      delete otps[email];
      res.status(200).json({ message: 'Password reset successfully' });
    });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});
//user_details_admission_SETEBE
app.post('/api/check', (req, res) => {
  const { email, formType } = req.body;
  let query;
  if (formType === 'Form A') {
    query = 'SELECT * FROM user_details WHERE email = ? AND formType = ?';
  } else if (formType === 'Form B') {
    query = 'SELECT * FROM user_details_admission1 WHERE email = ? AND formType = ?';
  } else if (formType === 'Form C') {
    query = 'SELECT * FROM user_details_admission_setebe WHERE email = ? AND formType = ?';
  }
  else {
    return res.status(400).json({ message: 'Invalid form type' });
  }
  db.query(query, [email, formType], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length > 0) {
      res.status(200).json({ success: true, key: 0 });
    } else {
      res.status(200).json({ success: true, key: 1 });
    }
  });
});




// FEE details display

app.get('/api/years', (req, res) => {
  db.query('SELECT admission_year FROM fee_structure', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query error');
    } else {
      const years = results.map(row => row.admission_year);
      //console.log('Years from database:', years);
      res.json(years);
    }
  });
});

// Endpoint to get fee structure for a specific year
app.get('/api/fee-structure/:year', (req, res) => {
  const year = parseInt(req.params.year);
  db.query('SELECT * FROM fee_structure WHERE admission_year = ?', [year], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query error');
    } else if (results.length > 0) {
      //console.log('Fee structure for year:', year, results[0]);
      res.json(results[0]);
    } else {
      console.log('Fee structure not found for year:', year);
      res.status(404).send('Fee structure not found');
    }
  });
});


////////////////data retrival for fe admission from broucher form 
app.use('/admissionfiles', express.static(path.join(__dirname, 'admissions')));

app.post('/api/retrivedata', (req, res) => {
  const email = req.body.email;
  const query = 'SELECT * FROM user_details WHERE email = ?'
  try {
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error occurred'
        });
      }
      if (result.length > 0) {
        const data = result;
        console.log(data);
        res.status(200).json({
          success: true,
          userData: data,
        });
      } else {
        console.log('No data found for email:', email);
        res.status(404).json({
          success: false,
          error: 'No data found for this email'
        });
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err
    })
  }
})


// let data = {};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const dirname = personalDetails.email.toString();
    console.log(dirname);
    console.log(typeof (dirname))

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
    if (fileType === 'application/pdf') {
      cb(null, `${file.fieldname.toString()}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      cb(null, `${file.fieldname.toString()}.jpeg`);
    }
    else if (fileType === 'image/png') {
      cb(null, `${file.fieldname.toString()}.png`);
    }


  }
});

const upload = multer({ storage: storage });


////////////multer and upload for fe admission 

const admissionStorage = multer.diskStorage({

  destination: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const dirname = personalDetails.email.toString();
    console.log(dirname);
    console.log(typeof (dirname))

    const uploadPath = `admissions/${dirname}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // const fileString = this.filename;
    // console.log(file.fieldname.toString());
    // console.log(fileString); 
    console.log("worked");
    const fileType = file.mimetype;
    if (fileType === 'application/pdf') {
      cb(null, `${file.fieldname.toString()}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      cb(null, `${file.fieldname.toString()}.jpeg`);
    }
    else if (fileType === 'image/png') {
      cb(null, `${file.fieldname.toString()}.png`);
    }


  }
});

const admissionUpload = multer({ storage: admissionStorage });

////////copy doc from broucher folder to admission forlder 
// async function copyToAdmissionFolder(srcEmail) {

//   const sourceFolder = path.join(__dirname,'public', srcEmail);
//   const destinationFolder = path.join(__dirname, 'admissions',srcEmail);
//   try {
//       console.log(sourceFolder)
//       console.log(destinationFolder)
//       // Ensure destination folder exists
//       await fs.ensureDir(destinationFolder);

//       if (!await fs.pathExists(sourceFolder)) {
//         throw new Error(`Source folder does not exist: ${sourceFolder}`);
//       }
//       // Copy the source folder to the destination
//       await fs.copy(sourceFolder, destinationFolder);

//       console.log(`Folder copied from ${sourceFolder} to ${destinationFolder}`);
//     } catch (err) {
//       console.error('Error copying folder:', err);
//     }
//   }

//   app.post('/admission/movedoc',async (req,res)=>{

//     const { srcEmail} = req.body;
//     console.log(srcEmail)

//     // Validate input
//     if (!srcEmail) {
//       return res.status(400).json({success: false,message :"email missing"});
//     }

//     try {
//       // Call the copy function
//       const movecheck = await copyToAdmissionFolder(srcEmail);
//       console.log(movecheck)
//       res.status(200).json({success: true,message :'folder miovied successfully !!!'});
//     } catch (err) {
//       console.log(err)
//       res.status(500).json({success: false,message :err});
//     }

//   })

async function copyToAdmissionFolder(srcEmail) {
  const sourceFolder = path.join(__dirname, 'public', srcEmail);
  const destinationFolder = path.join(__dirname, 'admissions', srcEmail);

  try {
    console.log('Source Folder:', sourceFolder);
    console.log('Destination Folder:', destinationFolder);

    // Ensure the destination folder exists (create if not)
    await fs.ensureDir(destinationFolder);

    // Check if the source folder exists
    if (!await fs.pathExists(sourceFolder)) {
      throw new Error(`Source folder does not exist: ${sourceFolder}`);
    }

    // Copy the source folder to the destination
    await fs.copy(sourceFolder, destinationFolder);

    console.log(`Folder copied from ${sourceFolder} to ${destinationFolder}`);
    return { success: true, message: 'Folder copied successfully!' };
  } catch (err) {
    console.error('Error copying folder:', err);
    throw err;  // Re-throw the error so the calling function can handle it
  }
}

app.post('/admission/movedoc', async (req, res) => {
  const { srcEmail } = "professional0012345@gmail.com";
  console.log("email check before copy :", srcEmail);

  // Validate input
  if (!srcEmail) {
    return res.status(400).json({ success: false, message: "Email missing" });
  }

  try {
    // Call the copy function
    const movecheck = await copyToAdmissionFolder(srcEmail);
    console.log("check after move", movecheck);
    res.status(200).json({ success: true, message: 'Folder moved successfully!!!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



//event
const storageEvents = multer.diskStorage({
  destination: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const dirname = personalDetails.email.toString();
    const uploadPath = path.join('public', dirname);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const fileType = file.mimetype;
    let extension = '';

    if (fileType === 'application/pdf') {
      extension = '.pdf';
    } else if (fileType === 'image/jpeg') {
      extension = '.jpeg';
    } else if (fileType === 'image/png') {
      extension = '.png';
    }

    let index = 1;
    const uploadPath = path.join('public', personalDetails.email.toString());

    // Check for existing files with different extensions
    const existingFiles = fs.readdirSync(uploadPath);
    const fileIndexes = existingFiles
      .filter(filename => filename.startsWith('image'))
      .map(filename => {
        const match = filename.match(/image(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

    // Increment index to the next available number
    while (fileIndexes.includes(index)) {
      index++;
    }

    // Generate filename based on the found index and extension
    const filename = `image${index}${extension}`;

    cb(null, filename);
  }
});

const uploadEvents = multer({ storage: storageEvents });

// Define the /api/events endpoint
app.post('/api/events/', uploadEvents.single('image'), (req, res) => {
  const { name, date, time, duration, summary, uid } = req.body;

  let personalDetails;

  try {
    personalDetails = JSON.parse(req.body.personalDetails);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid personal details format' });
  }

  const email = personalDetails.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required in personal details' });
  }

  const dirname = email.toString();
  const image = req.file ? req.file.filename : null;
  const fullPath = image ? path.join('public', dirname, image) : null;

  // const image = req.file ? req.file.filename : null;

  const query = 'INSERT INTO events (id, name, date, time, duration, summary, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
  // const values = [uid, name, date, time, summary, image];
  const values = [uid, name, date, time, duration, summary, fullPath];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error saving event detail:', err);
      res.status(500).json({ error: 'Error saving event detail' });
      return;
    }
    res.status(200).json({ message: 'Event saved successfully!' });
  });
});

app.post('/api/upload-file', upload.single('file'), (req, res) => {
  const file = req.file;
  const filePath = `/public/${req.user.email}/${file.originalname}`;
  fs.writeFileSync(filePath, file.buffer);
  res.json({ fileUrl: filePath });
});


app.post('/api/submit', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet10', maxCount: 1 },
  { name: 'leavingCertificate12', maxCount: 1 },
  { name: 'marksheet12', maxCount: 1 },
  { name: 'cbse12admitcard', maxCount: 1 },
  { name: 'cetMarksheet', maxCount: 1 },
  { name: 'jeeMarksheet', maxCount: 1 },
  { name: 'domicilecert', maxCount: 1 },
  { name: 'castecertificate', maxCount: 1 },
  { name: 'castevalidity', maxCount: 1 },
  { name: 'noncreamylayer', maxCount: 1 },
  { name: 'income', maxCount: 1 },
  { name: 'transactionproof', maxCount: 1 },
  { name: 'fcregistrationcopy', maxCount: 1 },
  { name: 'other', maxCount: 1 },
  { name: 'signature', maxCount: 1 },

  { name: 'admissionForm', maxCount: 1 }
]), (req, res) => {
  const personalDetails = JSON.parse(req.body.personalDetails);
  const academicDetails = JSON.parse(req.body.academicDetails);
  const cetDetails = JSON.parse(req.body.cetDetails);
  const preferences = req.body.preferences ? JSON.parse(req.body.preferences) : []; // Parse preferences
  const formData1 = JSON.parse(req.body.formData1);
  const formType = req.body.formType;
  const preference = req.body.preference;

  // const transactionDetails = JSON.parse(req.body.transactionDetails);

  // Retrieve the user's id from the user_registration table using the email
  const getUserQuery = 'SELECT id FROM user_registration WHERE email = ?';
  db.query(getUserQuery, [personalDetails.email], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length > 0) {
      const userId = results[0].id;


      const data = {
        id: userId, // Add the id field
        fullname: personalDetails.fullName,
        email: personalDetails.email,
        mobile_number: personalDetails.mobileNumber,
        date_of_birth: personalDetails.dateofBirth,
        birth_place: personalDetails.birthPlace,
        father_name: personalDetails.fathersName,
        father_occupation: personalDetails.fathersOccupation,
        father_mobile_number: personalDetails.fathersmobileNumber,
        mother_name: personalDetails.mothersName,
        mother_occupation: personalDetails.mothersOccupation,
        mother_mobile_number: personalDetails.mothersmobileNumber,
        sex: personalDetails.sex,
        annual_income: personalDetails.annualIncome.replace(/₹/g, ''),
        corres_address: personalDetails.corrAddr,
        permanent_address: personalDetails.perAddr,
        area: personalDetails.area,
        state: personalDetails.state,
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
        hsc_vocational_subject_marks: academicDetails.hscvocationalsubjectMarks,
        hsc_vocational_subject_percentage: academicDetails.hscvovationalsubjectPer,
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
        cbse_admit_card_id: academicDetails.admitCardId,
        cet_application_id: cetDetails.cetappId,
        cet_roll_number: cetDetails.cetrollNo,
        cet_percentile: cetDetails.cetPer,
        cet_maths_percentile: cetDetails.cetmathsPer,
        cet_physics_percentile: cetDetails.cetphysicsPer,
        cet_chemistry_percentile: cetDetails.cetchemistryPer,
        jee_application_number: cetDetails.jeeappNum,
        jee_percentile: cetDetails.jeePer,
        photo: req.files['photo'] ? req.files['photo'][0].path : null,
        marksheet10: req.files['marksheet10'] ? req.files['marksheet10'][0].path : null,
        leavingCertificate12: req.files['leavingCertificate12'] ? req.files['leavingCertificate12'][0].path : null,
        marksheet12: req.files['marksheet12'] ? req.files['marksheet12'][0].path : null,
        cbse_admit_card_id: req.files['cbse12admitcard'] ? req.files['cbse12admitcard'][0].path : null,
        cetMarksheet: req.files['cetMarksheet'] ? req.files['cetMarksheet'][0].path : null,
        jeeMarksheet: req.files['jeeMarksheet'] ? req.files['jeeMarksheet'][0].path : null,
        domicilecert: req.files['domicilecert'] ? req.files['domicilecert'][0].path : null,
        castecertificate: req.files['castecertificate'] ? req.files['castecertificate'][0].path : null,
        castevalidity: req.files['castevalidity'] ? req.files['castevalidity'][0].path : null,
        noncreamylayer: req.files['noncreamylayer'] ? req.files['noncreamylayer'][0].path : null,
        income: req.files['income'] ? req.files['income'][0].path : null,
        transactionproof: req.files['transactionproof'] ? req.files['transactionproof'][0].path : null,
        fcregistrationcpy: req.files['fcregistrationcopy'] ? req.files['fcregistrationcopy'][0].path : null,
        other: req.files['other'] ? req.files['other'][0].path : null,
        signature: req.files['signature'] ? req.files['signature'][0].path : null,
        admissionForm: req.files['admissionForm'] ? req.files['admissionForm'][0].path : null,
        preferences: JSON.stringify(preferences).replace(/'/g, '"'),
        // preference: preference,
        transaction_date: formData1.date,
        transaction_amount: formData1.amount,
        transaction_id: formData1.transactionId,
        transaction_against: formData1.paymentAgainst,
        transactionmode: formData1.paymentMode,
        formType: personalDetails.admissionType,
        class: personalDetails.class,
        juniorCollege: personalDetails.juniorCollege
      };
      console.log(req.files['admissionForm'][0].path)
      const query = 'INSERT INTO user_details SET ?';
      db.query(query, data, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ message: 'Error inserting data' });
        }

        res.status(200).json({ message: 'Data inserted successfully' });
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
});


app.post('/api/submit2', admissionUpload.fields([
  { name: 'FEadmission', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet10', maxCount: 1 },
  { name: 'leavingCertificate12', maxCount: 1 },
  { name: 'marksheet12', maxCount: 1 },
  { name: 'cbse12admitcard', maxCount: 1 },
  { name: 'cetMarksheet', maxCount: 1 },
  { name: 'jeeMarksheet', maxCount: 1 },
  { name: 'domicilecert', maxCount: 1 },
  { name: 'castecertificate', maxCount: 1 },
  { name: 'castevalidity', maxCount: 1 },
  { name: 'noncreamylayer', maxCount: 1 },
  { name: 'income', maxCount: 1 },
  { name: 'transactionproof', maxCount: 1 },
  { name: 'fcverificationcopy', maxCount: 1 },
  { name: 'other', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'capAllotmentLetter', maxCount: 1 },
  { name: 'diplomaProvisionalMarksheetEquivalent', maxCount: 1 },
  { name: 'migration', maxCount: 1 },

]), (req, res) => {
  const personalDetails = JSON.parse(req.body.personalDetails);
  const academicDetails = JSON.parse(req.body.academicDetails);
  const cetDetails = JSON.parse(req.body.cetDetails);
  const preferences = req.body.preferences ? JSON.parse(req.body.preferences) : []; // Parse preferences
  const formData1 = JSON.parse(req.body.formData1);
  const formType = req.body.formType;
  const preference = req.body.preference;
  // const transactionDetails = JSON.parse(req.body.transactionDetails);


  const adjustDateForTimezone = (inputdate) => {
    console.log("check 1");
    // console.log(date);
    const date = new Date(inputdate);
    if (!(date instanceof Date) || isNaN(date)) {
      console.log("date returned")
      return date; // Return original date if it's not a valid Date object
    }

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based index
    const day = ("0" + date.getDate()).slice(-2);

    return `${day}-${month}-${year}`;
  };


  const dob = adjustDateForTimezone(personalDetails.dateofBirth);
  console.log(dob)
  // dob = JSON.parse(dob);
  // setFormDataB(dob);


  // Retrieve the user's id from the user_registration table using the email
  const getUserQuery = 'SELECT id FROM user_registration WHERE email = ?';
  db.query(getUserQuery, [personalDetails.email], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length > 0) {
      const userId = results[0].id;


      const data = {
        id: userId, // Add the id field
        fullname: personalDetails.fullName,
        email: personalDetails.email,
        mobile_number: personalDetails.mobileNumber,
        date_of_birth: dob,
        birth_place: personalDetails.birthPlace,
        bloodGroup: personalDetails.bloodGroup,
        admission_type: personalDetails.admissionType,
        father_name: personalDetails.fathersName,
        father_occupation: personalDetails.fathersOccupation,
        father_mobile_number: personalDetails.fathersmobileNumber,
        mother_name: personalDetails.mothersName,
        mother_occupation: personalDetails.mothersOccupation,
        mother_mobile_number: personalDetails.mothersmobileNumber,
        sex: personalDetails.sex,
        annual_income: personalDetails.annualIncome.replace(/₹/g, ''),
        corres_address: personalDetails.corrAddr,
        permanent_address: personalDetails.perAddr,
        state: personalDetails.state,
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
        hsc_vocational_subject_marks: academicDetails.hscvocationalsubjectMarks,
        hsc_vocational_subject_percentage: academicDetails.hscvovationalsubjectPer,
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
        cbse_admit_card_id: academicDetails.admitCardId,
        cet_application_id: cetDetails.cetappId,
        cet_roll_number: cetDetails.cetrollNo,
        cet_percentile: cetDetails.cetPer,
        cet_maths_percentile: cetDetails.cetmathsPer,
        cet_physics_percentile: cetDetails.cetphysicsPer,
        cet_chemistry_percentile: cetDetails.cetchemistryPer,
        jee_application_number: cetDetails.jeeappNum,
        jee_percentile: cetDetails.jeePer,
        photo: req.files['photo'] ? req.files['photo'][0].path : null,
        marksheet10: req.files['marksheet10'] ? req.files['marksheet10'][0].path : null,
        leavingCertificate12: req.files['leavingCertificate12'] ? req.files['leavingCertificate12'][0].path : null,
        marksheet12: req.files['marksheet12'] ? req.files['marksheet12'][0].path : null,
        cbse_admit_card: req.files['cbse12admitcard'] ? req.files['cbse12admitcard'][0].path : null,
        cetMarksheet: req.files['cetMarksheet'] ? req.files['cetMarksheet'][0].path : null,
        jeeMarksheet: req.files['jeeMarksheet'] ? req.files['jeeMarksheet'][0].path : null,
        domicilecert: req.files['domicilecert'] ? req.files['domicilecert'][0].path : null,
        castecertificate: req.files['castecertificate'] ? req.files['castecertificate'][0].path : null,
        castevalidity: req.files['castevalidity'] ? req.files['castevalidity'][0].path : null,
        noncreamylayer: req.files['noncreamylayer'] ? req.files['noncreamylayer'][0].path : null,
        income: req.files['income'] ? req.files['income'][0].path : null,
        transactionproof: req.files['transactionproof'] ? req.files['transactionproof'][0].path : null,
        fcregistrationcpy: req.files['fcregistrationcopy'] ? req.files['fcregistrationcopy'][0].path : null,
        other: req.files['other'] ? req.files['other'][0].path : null,
        signature: req.files['signature'] ? req.files['signature'][0].path : null,
        pdf: req.files['FEadmission'] ? req.files['FEadmission'][0].path : null,
        capAllotmentLetter: req.files['capAllotmentLetter'] ? req.files['capAllotmentLetter'][0].path : null,
        migration: req.files['	migration'] ? req.files['	migration'][0].path : null,
        diplomaProvisionalMarksheetEquivalent: req.files['diplomaProvisionalMarksheetEquivalent'] ? req.files['diplomaProvisionalMarksheetEquivalent'][0].path : null,
        // pdf:req.files['pdf'] ? req.files['pdf'][0].path : null,
        dse_acap_preferences: JSON.stringify(preferences).replace(/'/g, '"'),
        allotedBranch: preference,
        transaction_date: formData1.date,
        transaction_amount: formData1.amount,
        transaction_id: formData1.transactionId,
        transaction_against: formData1.paymentAgainst,
        formType: formType,
        class: personalDetails.class,
        juniorCollege: personalDetails.juniorCollege,
        paymentMode: formData1.paymentMode,
        draftedBy: formData1.draftedBy,
        diplomapassingyear: academicDetails.diplomapassingyear,
        diplomatotalMarks: academicDetails.diplomatotalMarks,
        diplomamarksObtained: academicDetails.diplomamarksObtained,
        diplomaPercentage: academicDetails.diplomaPercentage,
        diplomacollage: academicDetails.diplomacollage,
        diploma_board_or_university: academicDetails.diplomaBoardOrUniversity,


      };

      const query = 'INSERT INTO user_details_admission1 SET ?';
      db.query(query, data, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ message: 'Error inserting data' });
        }

        res.status(200).json({ message: 'Data inserted successfully' });
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
});


// , upload.fields([
//   { name: 'photo', maxCount: 1 },
//   { name: 'leavingCertificate12', maxCount: 1 },
//   { name: 'transactionproof', maxCount: 1 },
//   { name: 'signature', maxCount: 1 }
// ]



const setebeStorage = multer.diskStorage({

  destination: function (req, file, cb) {
    const personalDetails = JSON.parse(req.body.personalDetails);
    const dirname = "prn"+personalDetails.prn.toString();
    console.log(dirname);
    console.log(typeof (dirname))

    const uploadPath = `setebe/${dirname}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // const fileString = this.filename;
    // console.log(file.fieldname.toString());
    // console.log(fileString); 
    console.log("worked");
    const fileType = file.mimetype;
    if (fileType === 'application/pdf') {
      cb(null, `${file.fieldname.toString()}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      cb(null, `${file.fieldname.toString()}.jpeg`);
    }
    else if (fileType === 'image/png') {
      cb(null, `${file.fieldname.toString()}.png`);
    }


  }
});

const setebeUpload = multer({ storage: setebeStorage });

app.post('/api/submitsetebe', setebeStorage.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'leavingCertificate12', maxCount: 1 },
  { name: 'transactionproof', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]), (req, res) => {
  const personalDetails = JSON.parse(req.body.personalDetails);
  const academicDetails = JSON.parse(req.body.academicDetails);
  const cetDetails = JSON.parse(req.body.cetDetails);
  const preferences = req.body.preferences ? JSON.parse(req.body.preferences) : []; // Parse preferences
  const formData1 = JSON.parse(req.body.formData1);
  const formType = req.body.formType;
  const ktDetails  = JSON.parse(req.body.ktDetails)
  const preference = req.body.preference;
  // const transactionDetails = JSON.parse(req.body.transactionDetails);

  console.log("recived data is : ",personalDetails,academicDetails,cetDetails,preference,formData1,ktDetails,formType)
  const adjustDateForTimezone = (inputdate) => {
    console.log("check 1");
    // console.log(date);
    const date = new Date(inputdate);
    if (!(date instanceof Date) || isNaN(date)) {
      console.log("date returned")
      return date; // Return original date if it's not a valid Date object
    }

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based index
    const day = ("0" + date.getDate()).slice(-2);

    return `${day}-${month}-${year}`;
  };


  const dob = adjustDateForTimezone(personalDetails.dateofBirth);
  console.log(dob)
  // dob = JSON.parse(dob);
  // setFormDataB(dob);


  // Retrieve the user's id from the user_registration table using the email
  const getUserQuery = 'SELECT id FROM user_registration WHERE email = ?';
  db.query(getUserQuery, [personalDetails.email], (err, results) => {
    if (err) {
      console.error('Error querying data:', err);
      return res.status(500).json({ message: 'Error querying data' });
    }

    if (results.length > 0) {
      const userId = results[0].id;


      const data = {
        id: userId, // Add the id field
        fullname: personalDetails.fullName,
        email: personalDetails.email,
        mobile_number: personalDetails.mobileNumber,
        date_of_birth: personalDetails.dateofBirth,
        admission_type: personalDetails.admissionType,
        prn: personalDetails.prn,
        father_email: personalDetails.fathersEmail,
        mother_email: personalDetails.mothersEmail,
        dob_in_words: personalDetails.DOBinwords,
        father_name: personalDetails.fathersName,
        father_occupation: personalDetails.fathersOccupation,
        father_mobile_number: personalDetails.fathersmobileNumber,
        mother_name: personalDetails.mothersName,
        mother_occupation: personalDetails.mothersOccupation,
        mother_mobile_number: personalDetails.mothersmobileNumber,
        sex: personalDetails.sex,
        annual_income: personalDetails.annualIncome.replace(/₹/g, ''),
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
        hsc_vocational_subject_percentage: academicDetails.hscvovationalsubjectPer,
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
        cet_percentile: cetDetails.cetPer,
        cet_maths_percentile: cetDetails.cetmathsPer,
        cet_physics_percentile: cetDetails.cetphysicsPer,
        cet_chemistry_percentile: cetDetails.cetchemistryPer,
        jee_application_number: cetDetails.jeeappNum,
        jee_percentile: cetDetails.jeePer,
        photo: req.files['photo'] ? req.files['photo'][0].path : null,
        leavingCertificate12: req.files['leavingCertificate12'] ? req.files['leavingCertificate12'][0].path : null,
        transaction_proof: req.files['transactionproof'] ? req.files['transactionproof'][0].path : null,
        signature: req.files['signature'] ? req.files['signature'][0].path : null,
        pdf: req.files['FEadmission'] ? req.files['FEadmission'][0].path : null,

        // preferences: JSON.stringify(preferences).replace(/'/g, '"'),
        preference: preference,
        transaction_date: formData1.date,
        transaction_amount: formData1.amount,
        transaction_id: formData1.transactionId,
        transaction_against: formData1.paymentAgainst,
        formType: formType,
        class: personalDetails.class,
        juniordseCollege: personalDetails.juniordseCollege,
        dsePercentage: academicDetails.dsePercentage,
        current_semester: ktDetails.currentSemester,
        sem1_cgpa: ktDetails.cgpaData["1"].cgpa,
        sem2_cgpa: ktDetails.cgpaData["2"].cgpa,
        sem3_cgpa: ktDetails.cgpaData["3"].cgpa,
        sem4_cgpa: ktDetails.cgpaData["4"].cgpa,
        sem5_cgpa: ktDetails.cgpaData["5"].cgpa,
        sem6_cgpa: ktDetails.cgpaData["6"].cgpa,
        sem7_cgpa: ktDetails.cgpaData["7"].cgpa,
        sem8_cgpa: ktDetails.cgpaData["8"].cgpa,
        sem1_attempts: ktDetails.attemptData["1"].attempts,
        sem2_attempts: ktDetails.attemptData["2"].attempts,
        sem3_attempts: ktDetails.attemptData["3"].attempts,
        sem4_attempts: ktDetails.attemptData["4"].attempts,
        sem5_attempts: ktDetails.attemptData["5"].attempts,
        sem6_attempts: ktDetails.attemptData["6"].attempts,
        sem7_attempts: ktDetails.attemptData["7"].attempts,
        sem8_attempts: ktDetails.attemptData["8"].attempts,
        sem1_kt: ktDetails.attemptData["1"].kts, // this is an array data type
        sem2_kt: ktDetails.attemptData["2"].kts,
        sem3_kt: ktDetails.attemptData["3"].kts,
        sem4_kt: ktDetails.attemptData["4"].kts,
        sem5_kt: ktDetails.attemptData["5"].kts,
        sem6_kt: ktDetails.attemptData["6"].kts,
        sem7_kt: ktDetails.attemptData["7"].kts,
        sem8_kt: ktDetails.attemptData["8"].kts,
      };
      const query = 'INSERT INTO user_details_admission1 SET ?';
      db.query(query, data, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ message: 'Error inserting data' });
        }

        res.status(200).json({ message: 'Data inserted successfully' });
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
});



app.post('/insertData', (req, res) => {

  const { id, currentSemester, attemptsData } = req.body;
  // const formdata = req.body;
  // console.log(formdata);
  // const id = 1236544987;
  console.log(id);
  console.log(attemptsData);
  console.log(currentSemester);
  console.log(attemptsData[1]?.kts);
  console.log(attemptsData[1]?.attemptDate);
  // const attemptsData = {
  //   "1": {
  //     "attempts": 2,
  //     "kts": [
  //       {
  //         "subject": "hgh",
  //         "clearedDate": "2024-06-10"
  //       },
  //       {
  //         "subject": "fbb",
  //         "clearedDate": ""
  //       }
  //     ]
  //   },
  //   "2": {
  //     "attempts": 1,
  //     "kts": []
  //   },
  //   "3": {
  //     "attempts": 0,
  //     "kts": []
  //   }
  // };
  // Array to store all sem_info insert queries
  const semInfoInsertQueries = [];
  // Array to store all kt_info insert queries
  const ktInfoInsertQueries = [];

  // Iterate through attemptsData for each semester
  Object.keys(attemptsData).forEach(sem => {
    const semData = attemptsData[sem];

    // Prepare sem_info insert query
    const semInfoQuery = {
      sql: `INSERT INTO sem_info (id, sem, num_of_attempt, num_of_kt, kt_date) VALUES (?, ?, ?, ?,?)`,
      values: [id, sem, semData.attempts, semData.kts.length, semData.attemptDate]
    };

    semInfoInsertQueries.push(semInfoQuery);

    // Prepare kt_info insert queries for each KT subject
    semData.kts.forEach(kt => {
      const ktInfoQuery = {
        sql: `INSERT INTO kt_info (id, sem, subject, cleardate, update_date) VALUES (?, ?, ?, ?, ?)`,
        values: [id, sem, kt.subject, kt.clearedDate, new Date().toISOString()]
      };

      ktInfoInsertQueries.push(ktInfoQuery);
    });
  });

  // Execute all sem_info and kt_info insert queries using transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error beginning transaction:', err);
      res.status(500).json({ error: 'Failed to begin transaction' });
      return;
    }

    // Insert sem_info queries
    const semQueryPromises = semInfoInsertQueries.map(query => {
      return new Promise((resolve, reject) => {
        db.query(query, (error, results, fields) => {
          if (error) {
            console.error('Error inserting sem_info:', error);
            db.rollback(() => {
              reject(error);
            });
          } else {
            resolve();
          }
        });
      });
    });

    // Insert kt_info queries
    const ktQueryPromises = ktInfoInsertQueries.map(query => {
      return new Promise((resolve, reject) => {
        db.query(query, (error, results, fields) => {
          if (error) {
            console.error('Error inserting kt_info:', error);
            db.rollback(() => {
              reject(error);
            });
          } else {
            resolve();
          }
        });
      });
    });

    // Execute all queries
    Promise.all([...semQueryPromises, ...ktQueryPromises])
      .then(() => {
        db.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);
            db.rollback(() => {
              res.status(500).json({ error: 'Transaction rollback' });
            });
          } else {
            res.status(200).json({ message: 'Data inserted successfully' });
          }
        });
      })
      .catch(error => {
        console.error('Transaction failed:', error);
        db.rollback(() => {
          res.status(500).json({ error: 'Transaction rollback' });
        });
      });
  });
});

app.post('/api/save-pdf', upload.single('pdf'), (req, res) => {
  const email = req.body.email;
  const file = req.file;

  if (file && email) {
    // Create user-specific directory if it doesn't exist
    const userDir = path.join('public', email);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Move the file to the user-specific directory
    const newPath = path.join(userDir, file.originalname);
    fs.rename(file.path, newPath, (err) => {
      if (err) return res.status(500).json({ message: 'Error saving file' });
      res.status(200).json({ message: 'File saved successfully' });
    });
  } else {
    res.status(400).json({ message: 'Invalid file or email' });
  }
});





app.get('/api/downloadPDF', (req, res) => {
  const { email, formType } = req.query;

  if (!email || !formType) {
    return res.status(400).json({ message: 'Missing email or formType' });
  }

  const fileName = 'FEadmission.pdf'; // Assuming the PDF file name is constant
  const filePath = path.resolve(__dirname, 'public', email, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error occurred while downloading PDF:', err);
        res.status(500).json({ message: 'Error occurred while downloading PDF' });
      }
    });
  });
});


app.get('/api/admissionDownloadPDF', (req, res) => {
  const { email, formType } = req.query;

  if (!email || !formType) {
    return res.status(400).json({ message: 'Missing email or formType' });
  }

  const fileName = 'FEadmission.pdf'; // Assuming the PDF file name is constant
  const filePath = path.resolve(__dirname, 'admissions', email, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error occurred while downloading PDF:', err);
        res.status(500).json({ message: 'Error occurred while downloading PDF' });
      }
    });
  });
});

//Admin portal data fetching

///To bypass security for email
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function mailsend(docName, email) {
  const documentReject = docName;
  const emailtoSend = email;
  console.log(emailtoSend);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'asiesgst@gmail.com',
      pass: 'ilnb jboi ekcf lyfp'
    }
  });

  const mailOptions = {
    from: 'asiesgst@gmail.com',
    to: emailtoSend,
    subject: 'Rejected Documents',
    text: `${documentReject} Documnet Rejected \nPlease visit admin office with correct softcopy of Corresponding document \n[File size < 250kb, File type allowed(pdf/jpeg/png) `,
    // attachments: [
    //   {
    //       path: 'E:/Desktop/attachment.txt'
    //   }
    // ]
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

//sending fee receipt in mail
function mailsendFeeReceipt(email) {
  const documentReject = 'FeeReceipt';
  const emailtoSend = email;
  console.log(emailtoSend);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'asiesgst@gmail.com',
      pass: 'ilnb jboi ekcf lyfp'
    }
  });

  const mailOptions = {
    from: 'otp.graphicalauthenticator@gmail.com',
    to: emailtoSend,
    subject: 'Brochure form fee receipt',
    text: `Successfull payment for Brochure form `,
    attachments: [
      {
        path: `./public/${email}/FeeReceipt.pdf`,
      }
    ]
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


//setting up file server
app.use('/files', express.static(path.join(__dirname, 'public')));

//setting up file server for admission FE
app.use('/admissions', express.static(path.join(__dirname, 'admissions')));

// Create an endpoint to fetch data
app.get('/brochuredata', (req, res) => {
  const query = 'SELECT id, fullname, cet_application_id, documentsApproved, transactionproofStatus  FROM user_details WHERE formType = "Brochure Form"';

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

// Create an endpoint to fetch data against CAP
app.get('/brochuredataAgainstCAP', (req, res) => {
  const query = 'SELECT id, fullname, cet_application_id, documentsApproved, transactionproofStatus  FROM user_details WHERE formType = "Application for cap against vacancy";';

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});
//FE Admission data for minority
app.get('/admissiondataMinority', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, transactionproofStatus, class FROM user_details_admission1 WHERE admission_type = "Minority Level"';
  console.log('Admission STUDENTS MINORITY');
  // res.sendStatus(200).send('Admission data fetch');
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

//FE TFWS aDMISSION 
app.get('/admissiondataFETFWS', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, transactionproofStatus, class FROM user_details_admission1 WHERE admission_type = "CAP TFWS"';
  console.log('Admission STUDENTS tfws');
  // res.sendStatus(200).send('Admission data fetch');
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});
//FE Admission data for CAP
app.get('/FEadmissionCAP', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, transactionproofStatus, class FROM user_details_admission1 WHERE admission_type = "CAP Level"';
  console.log('Admission STUDENTS MINORITY');
  // res.sendStatus(200).send('Admission data fetch');
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});


//Admision FE get request
app.get('/FEadmissiondataInstituteLevel', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, transactionproofStatus, class FROM user_details_admission1 WHERE admission_type = "Institute Level"';
  console.log('Admission brochure');
  // res.sendStatus(200).send('Admission data fetch');
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});


//Admision FE against CAP vacancy
app.get('/FEadmissionAgainstCAPvacancy', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, transactionproofStatus, class FROM user_details_admission1 WHERE admission_type = "Admission Against Vacancy"';
  console.log('Admission brochure');
  // res.sendStatus(200).send('Admission data fetch');
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});



//SE TE BE get request
app.get('/higheradmissiondata', (req, res) => {
  const query = 'SELECT id, fullname, documentsApproved, admissiontransactionproofStatus, class FROM user_details_admission_setebe';
  console.log(' SE TE BE Admission brochure');
  // res.sendStatus(200).send('Admission data fetch');
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
  const query = `SELECT id, fullname, email, mobile_number, annual_income, category, cet_application_id, transactionmode, photo, marksheet10, leavingCertificate12, marksheet12, cetMarksheet, jeeMarksheet, signature, domicilecert, castecertificate, castevalidity, noncreamylayer, income, other, cbse_admit_card_id, fcregistrationcpy,cbse_admit_card_idStatus, fcregistrationcpyStatus,photoStatus, leavingCertificate12Status, marksheet10Status, marksheet12Status, cetMarksheetStatus, jeeMarksheetStatus, signatureStatus, domicilecertStatus, castecertificateStatus, castevalidityStatus, noncreamylayerStatus, incomeStatus, otherStatus, transactionproofStatus, documentsApproved FROM user_details WHERE id = '${userId}';`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

//DocverificationFEAdmission page get and fetching
//Docverification page get and fetching
app.get('/docverificationFEAdmission/:uid', (req, res) => {
  const userId = req.params.uid;
  console.log(userId);
  const query = `SELECT id, fullname, email, mobile_number, annual_income, category, photo, marksheet10, leavingCertificate12, marksheet12, cetMarksheet, jeeMarksheet, signature, domicilecert, castecertificate, castevalidity, noncreamylayer, income, other, cbse_admit_card_id, fcverificationcopy, capAllotmentLetter, fcverificationcopyStatus, capAllotmentLetterStatus,cbse_admit_card_idStatus,photoStatus, leavingCertificate12Status, marksheet10Status, marksheet12Status, cetMarksheetStatus, jeeMarksheetStatus, signatureStatus, domicilecertStatus, castecertificateStatus, castevalidityStatus, noncreamylayerStatus, incomeStatus, otherStatus, transactionproofStatus, documentsApproved, paymentMode FROM user_details_admission1 WHERE id = '${userId}';`;

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


//Fetching documents URL and send the URL back to React
app.get('/docverificationFEAdmission/:uid/:docname', (req, res) => {
  const userId = req.params.uid;
  const docname = req.params.docname;
  console.log(userId);
  console.log(docname);
  console.log('FE ADMISSION PREVIEW');
  const query = `SELECT ${docname} FROM user_details_admission1 WHERE id = '${userId}';`;

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
  const uid = req.params.uid;
  const docName = req.params.docName;

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

//Document verification page making updation request to make document status to Not Applicable
app.put('/NotApplicableDoc/:uid/:docName', (req, res) => {
  const uid = req.params.uid;
  const docName = req.params.docName;

  const sql = `UPDATE user_details SET ${docName}Status = 'Not Applicable' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details SET ${docName}Status = 'Not Applicable' WHERE id = ${uid}`;
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

//FE Admission Document verification page making updation request to make document status to approve
app.put('/approveDocFEAdmission/:uid/:docName', (req, res) => {
  const uid = req.params.uid;
  const docName = req.params.docName;

  const sql = `UPDATE user_details_admission1 SET ${docName}Status = 'Approved' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details_admission1 SET ${docName}Status = 'Approved' WHERE id = ${uid}`;
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
  const uid = req.params.uid;
  const docName = req.params.docName;
  const email = req.params.email;
  const documents = [
    {
      id: 1,
      name: "12th Marksheet",
      dbcol: "marksheet12",
      preview: "This is the preview of Document 1",
    },
    {
      id: 2,
      name: "CBSE 12 Admit card",
      dbcol: "cbse_admit_card_id",
      preview: "This is the preview of Document 1",
    },
    {
      id: 3,
      name: "10th Marksheet",
      dbcol: "marksheet10",
      preview: "This is the preview of Document 2",
    },
    {
      id: 4,
      name: "CET Marksheet",
      dbcol: "cetMarksheet",
      preview: "This is the preview of Document 3",
    },
    {
      id: 5,
      name: "JEE Marksheet",
      dbcol: "jeeMarksheet",
      preview: "This is the preview of Document 4",
    },
    {
      id: 6,
      name: "Caste Certificate",
      dbcol: "castecertificat",
      preview: "This is the preview of Document 5",
    },
    {
      id: 7,
      name: "Signature",
      dbcol: "signature",
      preview: "This is the preview of Document 6",
    },
    {
      id: 8,
      name: "Domicile Certificate",
      dbcol: "domicilecert",
      preview: "This is the preview of Document 7",
    },
    {
      id: 9,
      name: "Caste Validity",
      dbcol: "castevalidity",
      preview: "This is the preview of Document 8",
    },
    {
      id: 10,
      name: "Non Creamy Layer",
      dbcol: "noncreamylayer",
      preview: "This is the preview of Document 9",
    },
    {
      id: 11,
      name: "12th Leaving Certificate",
      dbcol: "leavingCertificate12",
      preview: "This is the preview of Document 10",
    },
    {
      id: 12,
      name: "Income Certificate",
      dbcol: "income",
      preview: "This is the preview of Document 11",
    },
    {
      id: 13,
      name: "Passport-size photo",
      dbcol: "photo",
      preview: "This is the preview of Document 12",
    },
    {
      id: 14,
      name: "FC Registration copy",
      dbcol: "fcregistrationcpy",
      preview: "This is the preview of Document 13",
    },
    {
      id: 15,
      name: "Other Document",
      dbcol: "other",
      preview: "This is the preview of Document 14",
    },
    {
      id: 16,
      name: "Transaction Proof",
      dbcol: "transactionproof",
      preview: "This is the preview of Document 15",
    }
  ];

  function getNameByDbCol(dbcol) {
    const document = documents.find(doc => doc.dbcol === dbcol);
    return document ? document.name : null;
  }
  console.log(email)
  mailsend(getNameByDbCol(docName), email);
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


//FE Admission Document verification page making updation request to make document status to Reject
app.put('/rejectDocFEAdmission/:uid/:email/:docName', (req, res) => {
  const uid = req.params.uid;
  const docName = req.params.docName;
  const email = req.params.email;

  console.log(email)
  mailsend(docName, email);
  const sql = `UPDATE user_details_admission1 SET ${docName}Status = 'Rejected' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details_admission1 SET ${docName}Status = 'Rejected' WHERE id = ${uid}`;
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

  if (docName === 'transactionproof') {
    console.log('Trajskdjasdhaskdalsf;KFH');
    const query = `INSERT `
  }
});

//Update all Document status to Approved
app.put('/DocumentsApproved/:uid', (req, res) => {
  const uid = req.params.uid;

  const sql = `UPDATE user_details SET documentsApproved = 'Approved', addedToMerit = true WHERE id = ?`;
  const sqlQuery = `UPDATE user_details SET documentsApproved = 'Approved',  addedToMerit = 1 WHERE id = ${uid}`;
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

  ///Fetching data from user_details to add to merit list table
  const query = util.promisify(db.query).bind(db);
  var cet_percentile = '';


});

//Update all Document status to Approved for FE admission
app.put('/DocumentsApprovedFE/:uid', (req, res) => {
  const uid = req.params.uid;

  const sql = `UPDATE user_details_admission1 SET documentsApproved = 'Approved' WHERE id = ?`;
  const sqlQuery = `UPDATE user_details_admission1 SET documentsApproved = 'Approved' WHERE id = ${uid}`;
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



// const storage2 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     //  const dirname =  'dirname'//req.body;///JSON.parse(req.body.email);
//     // console.log('Dirname : ',dirname);
//     const email = JSON.stringify(req.body.email);
//     const body = req.body;
//     // Use email to dynamically create upload path
//     const dirname = email || 'default'; 
//     console.log("Email : ",email);
//     console.log("dirnam : ",dirname);
//     console.log("Body : ", typeof(body));
//     // Use 'default' if email is undefined
//     // console.log('Dirname : ', dirname);

//     // console.log(JSON.parse(req.body));

//     const uploadPath = `public/${dirname}`;
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {

//     // console.log(req.body.email);
//     const reuploadName = 'reuploads';
//     const fileString = file.fieldname.toString();
//     console.log(reuploadName);
//     console.log(fileString); 
//     const fileType = file.mimetype;
//     if(fileType === 'application/pdf'){
//       cb(null, `${reuploadName}.pdf`);
//     }
//     else if(fileType === 'image/jpeg'){
//       cb(null, `${reuploadName}.jpeg`);
//     }
//     else if(fileType === 'image/png'){
//       cb(null, `${reuploadName}.png`);
//     }
//   }
// });
// const upload2 = multer({ storage: storage2 });

// // Endpoint to handle file Reupload at Admin side
// app.post('/reupload', upload2.fields([
//   {name:'file', maxCount:1}
// ]), (req, res) => {
//   // Multer adds a 'file' object to the request object
//   const file = req.file;
//   const email = req.body;
//   const docName = req.body.docName;

//   // response.append(req.body);
//   console.log('Email : ',email);
//   console.log('Document Name : ',docName );
//   if (!file) {
//       return res.status(400).send('No file uploaded.');
//   }
//   // res.send('File uploaded successfully.');


//    response = { message: 'Response body received:', data: req.body };

//   // Sending the response with the appended req.body
//   res.send(response);


// });

///Merit list testing
// Fetch students from the database

// BACKUP CODE

// Configure multer storage for re-uploads
// const reuploadStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const email = req.body.email;
//     console.log(email);
//     console.log(file.mimetype);
//     console.log(file.fieldname);







//     const uploadPath = path.join(__dirname, 'public', email);
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const docName = req.body.docName;
//     console.log(docName);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, `${docName}${fileExtension}`);
//   }
// });

// // const reupload = multer({ storage: reuploadStorage });
// const reupload = multer({ storage: reuploadStorage }).fields([
//   { name: 'file', maxCount: 1 },
//   { name: 'email', maxCount: 1 },
//   { name: 'docName', maxCount: 1 }
// ]);

// // Endpoint to handle file re-upload
// app.post('/reupload', reupload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const email = (req.body.email);
//   const docName = (req.body.docName);
//   const filePath = (req.file.path);
//   console.log(req.body);
//   console.log(email);
//   console.log(docName);
//   console.log(filePath);

//   // Here you can add any database update logic if needed
//   console.log(`File uploaded for ${email}: ${filePath}`);

//   res.send({ message: 'File uploaded successfully', filePath });
// });


const reuploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email;
    // const parameters = req.params.email;
    // console.log(parameters);
    console.log('email :', email);
    console.log(file.originalname);

    // if (!email) {
    //   return cb(new Error('Email is required'));
    // }

    const uploadPath = path.join(__dirname, 'public', email);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const docName = req.body.docName;
    console.log('Document name:', docName);
    const fileType = file.mimetype;
    if (fileType === 'application/pdf') {
      console.log(`Uploaded ${docName}.pdf`)
      cb(null, `${docName}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      console.log(`Uploaded ${docName}.jpeg`)
      cb(null, `${docName}.jpeg`);
    }
    else if (fileType === 'image/png') {
      console.log(`Uploaded ${docName}.png`)
      cb(null, `${docName}.png`);
    }

    // if (!docName) {
    //   return cb(new Error('Document name is required'));
    // }

    const fileExtension = path.extname(file.originalname);
    cb(null, `${docName}${fileExtension}`);
  }
});

const reupload = multer({ storage: reuploadStorage });
//Reupload from brochure form
app.post('/reupload', reupload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const email = req.body.email;
  const docName = req.body.docName;
  const filePath = req.file.fieldname;
  const filetype = req.file.mimetype;

  console.log(req.body);
  console.log(email);
  console.log(docName);
  console.log(filePath);
  console.log(filetype);

  // Retrieving the previous location of file to delete it
  const retrieveQuery = `SELECT ${docName} FROM user_details WHERE email = '${email}';`;
  console.log(retrieveQuery);
  const values = [docName, email];

  // Promisify the db.query function
  const query = util.promisify(db.query).bind(db);
  var fileExtension = '';
  var resultQuery = '';
  try {
    const result = await query(retrieveQuery, values);

    console.log('DOCUMENT REUPLOADED');
    console.log(result);
    ///////////////////

    resultQuery = Object.values(result[0])[0];
    console.log(resultQuery);
    const parts = resultQuery?.split('\\');
    console.log(parts);
    const fileName = parts[parts.length - 1];
    console.log(fileName);

    // Split the file name by dot and get the last part (file extension)
    const fileNameParts = fileName.split('.');
    fileExtension = fileNameParts[fileNameParts.length - 1];
    console.log(fileExtension);


  } catch (err) {
    console.error('Error updating entry: ' + err.stack);
    res.status(500).send('Error updating entry');
  }

  const filetypemap = { 'png': 'image/png', 'pdf': 'application/pdf', 'jpeg': 'image/jpeg' }
  const reverseFileType = { 'image/png': 'png', 'application/pdf': 'pdf', 'image/jpeg': 'jpeg' }
  console.log(filetypemap[fileExtension]);
  console.log(filetype);

  if (filetype === filetypemap[fileExtension]) {
    console.log("Not path updates in database");

  }
  else {
    const reuploadURL = `public\\${email}\\${docName}.${reverseFileType[filetype]}`;
    console.log(reuploadURL);
    const query = `UPDATE user_details SET ${docName} = ? WHERE email = ?`;
    const values = [reuploadURL, email];
    console.log(query);
    db.query(query, values, (err, result) => {
      if (err) {
        console.log("Error found : ", error);
      } else {
        console.log(result);
        res.send('Reupload URL in database updated');
      }
    });
  }
});




//////////////////////////////////////////////////////////Reupload from FE Admission form //////////////////////////////////////////////////////////////
const reuploadStorage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email;
    // const parameters = req.params.email;
    // console.log(parameters);
    console.log('email :', email);
    console.log(file.originalname);

    // if (!email) {
    //   return cb(new Error('Email is required'));
    // }

    const uploadPath = path.join(__dirname, 'admissions', email);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const docName = req.body.docName;
    console.log('Document name:', docName);
    const fileType = file.mimetype;
    if (fileType === 'application/pdf') {
      console.log(`Uploaded ${docName}.pdf`)
      cb(null, `${docName}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      console.log(`Uploaded ${docName}.jpeg`)
      cb(null, `${docName}.jpeg`);
    }
    else if (fileType === 'image/png') {
      console.log(`Uploaded ${docName}.png`)
      cb(null, `${docName}.png`);
    }

    // if (!docName) {
    //   return cb(new Error('Document name is required'));
    // }

    const fileExtension = path.extname(file.originalname);
    cb(null, `${docName}${fileExtension}`);
  }
});

const reupload2 = multer({ storage: reuploadStorage2 });
app.post('/reuploadFEAdmission', reupload2.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const email = req.body.email;
  const docName = req.body.docName;
  const filePath = req.file.fieldname;
  const filetype = req.file.mimetype;

  console.log(req.body);
  console.log(email);
  console.log(docName);
  console.log(filePath);
  console.log(filetype);

  // Retrieving the previous location of file to delete it
  const retrieveQuery = `SELECT ${docName} FROM user_details_admission1 WHERE email = '${email}';`;
  console.log(retrieveQuery);
  const values = [docName, email];

  // Promisify the db.query function
  const query = util.promisify(db.query).bind(db);
  var fileExtension = '';
  var resultQuery = '';
  try {
    const result = await query(retrieveQuery, values);

    console.log('DOCUMENT REUPLOADED from FE Admission');
    console.log(result);

    resultQuery = Object.values(result[0])[0];
    console.log(resultQuery);
    const parts = resultQuery.split('\\');
    console.log(parts);
    const fileName = parts[parts.length - 1];
    console.log(fileName);

    // Split the file name by dot and get the last part (file extension)
    const fileNameParts = fileName.split('.');
    fileExtension = fileNameParts[fileNameParts.length - 1];
    console.log(fileExtension);


  } catch (err) {
    console.error('Error updating entry: ' + err.stack);
    res.status(500).send('Error updating entry');
  }

  const filetypemap = { 'png': 'image/png', 'pdf': 'application/pdf', 'jpeg': 'image/jpeg' }
  const reverseFileType = { 'image/png': 'png', 'application/pdf': 'pdf', 'image/jpeg': 'jpeg' }
  console.log(filetypemap[fileExtension]);
  console.log(filetype);

  if (filetype === filetypemap[fileExtension]) {
    console.log("Not path updates in database");

  }
  else {
    const reuploadURL = `admissions\\${email}\\${docName}.${reverseFileType[filetype]}`;
    console.log(reuploadURL);
    const query = `UPDATE user_details_admission1 SET ${docName} = ? WHERE email = ?`;
    const values = [reuploadURL, email];
    console.log(query);
    db.query(query, values, (err, result) => {
      if (err) {
        console.log("Error found : ", error);
      } else {
        console.log(result);
        res.send('Reupload URL in database updated');
      }
    });
  }
});

async function fetchStudents() {
  const connection = await mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'reg_portal' // Your database name
  });

  const [rows] = await connection.execute('SELECT fullname, cet_percentile, cet_maths_percentile, cet_physics_percentile, cet_chemistry_percentile, 12th_marks_obtained, preferences, Alloted_branch, AllotedBy, id FROM user_details WHERE addedToMerit = true AND cet_percentile <> 0.0000000;');
  await connection.end();
  return rows;
}

// Compare students based on various attributes
function compareStudents(studentA, studentB) {
  const attributes = ["cet_percentile", "cet_maths_percentile", "cet_physics_percentile", "cet_chemistry_percentile", "12th_marks_obtained"];
  for (let attr of attributes) {
    const valA = parseFloat(studentA[attr])
    const valB = parseFloat(studentB[attr])
    if (valA > valB) {
      return -1;
    } else if (valA < valB) {
      return 1;
    }
  }
  return 0;
}

// Generate merit list
function generateMeritList(students) {
  const sortedStudents = students.slice().sort(compareStudents);

  sortedStudents.forEach((student, index) => {
    student.meritNumber = index + 1;
  });

  return sortedStudents;
}

// API endpoint to get merit list
app.get('/meritList', async (req, res) => {
  try {
    const students = await fetchStudents();
    const meritList = generateMeritList(students);
    console.log(meritList);
    res.json(meritList);
  } catch (error) {
    console.error('Error fetching or processing students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fee structure upload endpoint
app.post('/fee-structure-upload', (req, res) => {
  const query = `INSERT INTO fee_structure (admission_year, tuition_fee, development_fee, exam_fee, misc_fee, enrollment_fee, eligibility_fee, interim_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  // const { admissionYear, tuitionFee, developmentFee, examFee, miscellaneousFee } = req.body;
  const tuitionFee = req.body.tuitionFee;
  const admissionYear = req.body.admissionYear;
  const developmentFee = req.body.developmentFee;
  const examFee = req.body.examFee;
  const miscellaneousFee = req.body.miscellaneousFee;
  const enrollment_fee = req.body.enrollmentFee;
  const eligibility_fee = req.body.eligibilityFee;
  const interim_fee = req.body.interimFee;
  console.log(req.body);
  const values = [admissionYear, tuitionFee, developmentFee, examFee, miscellaneousFee, enrollment_fee, eligibility_fee, interim_fee];
  console.log(values);
  db.query(query, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.error('Duplicate entry error: ' + err.stack);
        res.status(409).send('Duplicate entry: Admission year already exists');
      } else {
        console.error('Error updating entry: ' + err.stack);
        res.status(500).send('Error updating entry');
      }
    } else {
      console.log('Entry updated successfully');
      console.log(result);
      res.send('Entry updated successfully');
    }
  });
});

app.put('/fee-structure-update', (req, res) => {
  const query = `UPDATE fee_structure SET development_fee = ?,exam_fee = ?, misc_fee = ?, enrollment_fee = ?, eligibility_fee = ?, interim_fee = ?, tuition_fee = ?  WHERE admission_year = ?`;

  const admissionYear = req.body.admissionYear;
  const developmentFee = req.body.developmentFee;
  const examFee = req.body.examFee;
  const miscellaneousFee = req.body.miscellaneousFee;
  const enrollment_fee = req.body.enrollmentFee;
  const eligibility_fee = req.body.eligibilityFee;
  const interim_fee = req.body.interimFee;
  const tuition_fee = req.body.tuitionFee;
  console.log(req.body);
  console.log(developmentFee, examFee, miscellaneousFee, enrollment_fee, eligibility_fee, interim_fee);
  const values = [Number(developmentFee), Number(examFee), Number(miscellaneousFee), Number(enrollment_fee), Number(eligibility_fee), Number(interim_fee), Number(tuition_fee), Number(admissionYear)];
  console.log(values);
  db.query(query, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.error('Duplicate entry error: ' + err.stack);
        res.status(409).send('Duplicate entry: Admission year already exists');
      } else {
        console.error('Error updating entry: ' + err.stack);
        res.status(500).send('Error updating entry');
      }
    } else {
      console.log('Entry updated successfully');
      console.log(result);
      res.send('Entry updated successfully');
    }
  });
});

app.get('/feeStructure', (req, res) => {
  const query = `SELECT * FROM fee_structure ;`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
})
app.get('/clientfeeStructure/:year', (req, res) => {
  const year = req.params.year;
  const query = `SELECT * FROM fee_structure where admission_year = ${year} or admission_year = ${year - 1}  ;`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
})
///Branch alottment updates
app.put('/branchallotment', (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const Alloted_branch = req.body.Alloted_branch;
  const values = [Alloted_branch, id]
  console.log(values);
  const query = `UPDATE user_details SET Alloted_branch = ? WHERE id = ?`;
  console.log(query);
  db.query(query, values, (err, result) => {
    if (err) {
      console.log("Error while alloting branch : ", err);
    } else {
      console.log('Branch Alloted successfully');
      console.log(result);
      res.send('Branch Alloted successfully');
    }
  });
})




///Multer config for saving fee receipt
const feeuploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email;
    // const parameters = req.params.email;
    // console.log(parameters);
    console.log('email :', email);


    // if (!email) {
    //   return cb(new Error('Email is required'));
    // }

    const uploadPath = path.join(__dirname, 'public', email);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const docName = 'FeeReceipt';
    console.log('Document name:', docName);
    const fileType = file.mimetype;
    if (fileType === 'application/pdf') {
      cb(null, `${docName}.pdf`);
    }
    else if (fileType === 'image/jpeg') {
      cb(null, `${docName}.jpeg`);
    }
    else if (fileType === 'image/png') {
      cb(null, `${docName}.png`);
    }

    // if (!docName) {
    //   return cb(new Error('Document name is required'));
    // }

    const fileExtension = path.extname(file.originalname);
    cb(null, `${docName}${fileExtension}`);
  }
});

const feeupload = multer({ storage: feeuploadStorage });

///Saving fee receipt and sending it to the person.
// app.post('/uploadfeereceipt',feeupload.single("file"))
app.post('/uploadfeereceipt', feeupload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  else {
    console.log(req.body);
    const email = req.body.email;
    mailsendFeeReceipt(email);
  }
});

//To get request for admission form view
app.get('/getAdmissionForm/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM user_details WHERE id = ? ;'
  db.query(query, id, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      res.send(result);
      console.log(result);
    }
  })
})

app.get('/getDataBrochure', (req, res) => {
  const query = 'SELECT * FROM user_details ;';
  db.query(query, (err, result) => {
    if (err) {
      console.log("Error while fetching data : ", err);
    }
    else {
      res.send(result);
    }
  })
})

///Transaction rejected ENDPOINTS

app.get('/getTransactionRejectList', (req, res) => {

  const query = `SELECT * FROM transaction_reject_list ;`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
      console.log(results);
    }
  });
})

app.put('/updateInstallment/:id', (req, res) => {
  const id = req.params.id;
  const installmentStatus = req.body.installment;
  const totalAmount = req.body.total_amount;
  console.log(`Id to updated : ${id} \nInstallment status recieved : ${installmentStatus} \nTotal fees : ${totalAmount}`)

  if (installmentStatus === false) {
    const query = 'UPDATE transaction_reject_list SET installment = false, installment1 = NULL, installment2 = NULL WHERE id = ? '
    db.query(query, id, (err, result) => {
      if (err) {
        console.log("Error while updating installment status to false : ", err);
      } else {
        console.log("Installment status{false} updated successfully");
        console.log(result);
        res.send("Installment status{false} updated successfully");
      }
    });
  }
  else {
    const installmentAmount = totalAmount / 2;
    console.log(installmentAmount)
    const values = [installmentAmount, installmentAmount, id]
    const query = 'UPDATE transaction_reject_list SET installment = true, installment1 = ?, installment2 = ? WHERE id = ? '
    db.query(query, values, (err, result) => {
      if (err) {
        console.log("Error while updating installment status : ", err);
      } else {
        console.log("Installment status updated successfully");
        console.log(result);
        res.send("Installment status updated successfully");
      }
    });
  }


})

///Updating transaction list from FE Admission
app.put("/transactionRejectedUpdate/:uid", (req, res) => {
  const uid = req.params.uid;

  // res.send('Succesfulll!!!!!!!!')
  console.log(uid);
  console.log('//////////////////////////////////////////////////////////////////////////////////////////////');
  const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
      db.query(query, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  // Async function to run queries in sequence
  const runQueries = async (uid) => {
    try {

      // First query
      const result1 = await executeQuery(
        "SELECT id, prn, year_of_admission, class, transaction_id  FROM user_details_admission1 WHERE id = ?",
        [uid]
      );
      console.log("Result 1:", result1);

      // Second query, dependent on the result of the first query
      const result2 = await executeQuery(
        "SELECT * FROM fee_structure WHERE admission_year = ?",
        [result1[0].year_of_admission]
      );
      console.log("Result 2:", result2);
      const totalfees = result2[0].tuition_fee + result2[0].development_fee + result2[0].exam_fee + result2[0].misc_fee;
      // // Third query, dependent on the result of the second query
      const result3 = await executeQuery(
        "INSERT INTO transaction_reject_list(id, prn, year_of_admission, total_fees, current_year,transaction_id) VALUES(?,?,?,?,?,?)",
        [result1[0].id, result1[0].prn, result1[0].year_of_admission, totalfees, result1[0].class, result1[0].transaction_id]
      );
      console.log("Result 3:", result3);
      res.send("Successfully added to rejected liast");
    } catch (error) {
      console.error("Error running queries:", error);
    }
  };

  // Run the queries
  runQueries(uid);


});


//Get preview of transaction proof1 on transaction rejected page
app.get('/transactionproof1/:id', (req, res) => {
  const id = req.params.id;
  const getQuery = `SELECT transactionproof FROM user_details_admission1 WHERE id = "${id}"`;
  const querytest = `SELECT transactionproof FROM user_details_admission1 WHERE id = "${id}"`;
  console.log(querytest);
  db.query(getQuery, (err, result) => {
    if (err) {
      console.log('Error in fetching admission Proof transaction1 ')
    }
    else {
      res.send(result);
      console.log('URL TO REACT : ', result);
    }
  })

})


//Get preview of transaction installment2 on transaction reject page

app.get('/installment2/:id', (req, res) => {
  const id = req.params.id;
  const getQuery = 'SELECT installment2proof FROM transaction_reject_list WHERE id = ?';
  const querytest = `SELECT installment2proof FROM transaction_reject_list WHERE id = ${id}`;
  console.log(querytest);
  db.query(getQuery, id, (err, result) => {
    if (err) {
      console.log('Error in fetching admission Proof transaction1 ')
    }
    else {
      res.json(result);
      console.log('URL TO REACT : ', result);
    }
  })

})




///Multer config for reupload of transaction proof 1 from transaction rejected page
const reuploadTransaction = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const id = req.params.id; // Get the ID from the request parameters
      const year = req.body.year;

      // Function to get the email from the database
      const getEmailFromDB = (id) => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT email FROM user_details_admission1 WHERE id = ?';
          db.query(query, [id], (err, result) => {
            if (err) {
              console.log("Error while fetching email for reupload transaction proof:", err);
              reject(err);
            } else {
              console.log('Successfully fetched');
              console.log(result);
              resolve(result[0].email);
            }
          });
        });
      };

      const email = await getEmailFromDB(id);
      console.log("email:", email);

      const uploadPath = path.join(__dirname, "admissions", email);
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) return cb(err);
        cb(null, uploadPath);
      });
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const docName = "transactionproof";
    console.log("Document name:", docName);
    const fileType = file.mimetype;
    if (fileType === "application/pdf") {
      cb(null, `${docName}.pdf`);
    } else if (fileType === "image/jpeg") {
      cb(null, `${docName}.jpeg`);
    } else if (fileType === "image/png") {
      cb(null, `${docName}.png`);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const reuploadTransactionProof = multer({ storage: reuploadTransaction });

app.post("/reuploadTransactionProof/:id", reuploadTransactionProof.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  } else {
    console.log(req.body);
    const id = req.body.id;
    const year = req.body.year;
    const fileType = req.file.mimetype;
    const transaction_id = req.body.transaction_id;
    console.log("Transaction ID 1  received :: ", transaction_id)
    let email = "";
    // Promisify the db.query function
    const query = util.promisify(db.query).bind(db);
    async function performQueries(id, year) {
      if (year === "FE") {
        try {
          // First query
          const query1 = 'SELECT email FROM user_details_admission1 WHERE id = ?';
          const result1 = await query(query1, id);
          if (result1.length > 0) {
            const email = result1[0].email;
            let URL = "";
            console.log("Received email in post:", email);
            if (fileType === "application/pdf") {
              URL = `${email}\\transactionproof.pdf`;
            } else if (fileType === "image/jpeg") {
              URL = `${email}\\transactionproof.jpeg`;
            } else if (fileType === "image/png") {
              URL = `${email}\\transactionproof.png`;
            }

            // You can now perform the second query here
            const query2 = 'UPDATE user_details_admission1 SET transactionproof = ?, transaction_id = ? WHERE id = ?';
            const values = [URL, transaction_id, id]
            const result2 = await query(query2, values);
            console.log("Received result from second query:", result2);

            // You can now perform the second query here
            const query3 = 'UPDATE transaction_reject_list SET transaction_id = ? WHERE id = ?';
            const values2 = [transaction_id, id]
            const result3 = await query(query3, values2);
            console.log("Received result from third query:", result3);
          } else {
            console.log("No email found for the given id");
          }
        } catch (err) {
          console.log("Error while updating:", err);
        }
      }


    }

    // Call the async function with the appropriate id
    performQueries(id, year);



    const URL = `${email}\transactionproof`;
    res.status(200).json({ message: "File uploaded successfully." });
  }

});


//Multer config and post request to handle uploading of transaction ID 2 and its proof

const uploadTransactionproof2 = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const id = req.params.id; // Get the ID from the request parameters
      const year = req.body.year;

      // Function to get the email from the database
      const getEmailFromDB = (id) => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT email FROM user_details_admission1 WHERE id = ?';
          db.query(query, [id], (err, result) => {
            if (err) {
              console.log("Error while fetching email for reupload transaction proof:", err);
              reject(err);
            } else {
              console.log('Successfully fetched');
              console.log(result);
              resolve(result[0].email);
            }
          });
        });
      };

      const email = await getEmailFromDB(id);
      console.log("email:", email);

      const uploadPath = path.join(__dirname, "admissions", email);
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) return cb(err);
        cb(null, uploadPath);
      });
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const docName = "installment2proof";
    console.log("Document name:", docName);
    const fileType = file.mimetype;
    if (fileType === "application/pdf") {
      cb(null, `${docName}.pdf`);
    } else if (fileType === "image/jpeg") {
      cb(null, `${docName}.jpeg`);
    } else if (fileType === "image/png") {
      cb(null, `${docName}.png`);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const uploadTransactionProof2 = multer({ storage: uploadTransactionproof2 });

app.post("/uploadTransactionProofandID/:id", uploadTransactionProof2.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  } else {
    console.log(req.body);
    const id = req.body.id;
    const year = req.body.year;
    const transactionID2 = req.body.transactionID2;
    const fileType = req.file.mimetype;
    let email = "";

    // Promisify the db.query function
    const query = util.promisify(db.query).bind(db);
    async function performQueries(id, year) {
      if (year === "FE") {
        try {
          // First query
          const query1 = 'SELECT email FROM user_details_admission1 WHERE id = ?';
          const result1 = await query(query1, id);
          if (result1.length > 0) {
            const email = result1[0].email;
            let URL = "";
            console.log("Received email in post:", email);
            if (fileType === "application/pdf") {
              URL = `${email}\\installment2proof.pdf`;
            } else if (fileType === "image/jpeg") {
              URL = `${email}\\installment2proof.jpeg`;
            } else if (fileType === "image/png") {
              URL = `${email}\\installment2proof.png`;
            }

            // You can now perform the second query here
            const query2 = 'UPDATE transaction_reject_list SET transactionId2 = ?, installment2proof = ? WHERE id = ?';
            const values = [transactionID2, URL, id]
            const result2 = await query(query2, values);
            console.log("Received result from second query:", result2);
          } else {
            console.log("No email found for the given id");
          }
        } catch (err) {
          console.log("Error while updating:", err);
        }
      }


    }

    // Call the async function with the appropriate id
    performQueries(id, year);

    // localstorage.Item(``)

    const URL = `${email}\admissiontransactionproof`;
    res.status(200).json({ message: "File uploaded successfully." });
  }

});

app.put('/approveRejectedFromTransactionList/:id/:year', (req, res) => {
  const id = req.params.id;
  const year = req.params.year;
  console.log('ID received for green verify', id);


  if (year === "FE") {
    try {
      // First query
      const query1 = 'UPDATE user_details_admission1 SET transactionproofStatus = "Approved" WHERE id = ?';
      db.query(query1, id, (err, results) => {
        if (err) {
          console.log("Error while updating status of transactionproof ", err);
        }
        else {
          console.log(results);
        }
      })

    } catch (err) {
      console.log("Error while updating:", err);
    }
  }
  try {
    // First query
    const query2 = 'UPDATE transaction_reject_list SET status = "Approved" WHERE id = ?';
    db.query(query2, id, (err, results) => {
      if (err) {
        console.log("Error while updating status of transactionproof ", error);
      }
      else {
        console.log(results);
      }
    })

  } catch (err) {
    console.log("Error while updating:", err);
  }
})


//Updating installments from transaction reject page
app.put('/changeInstallmentValues/:id/:installment1/:installment2', (req, res) => {
  const id = req.params.id;
  const installment1 = req.params.installment1;
  const installment2 = req.params.installment2;
  const values = [installment1, installment2, id];
  console.log(values);
  try {
    const query = 'UPDATE transaction_reject_list SET installment1 = ?, installment2 = ? WHERE id = ?';
    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
        console.log("Installment updated succesfully")
        res.send('Sucessfully updated installment');
      }

    })
  } catch (error) {
    console.log("Error while updating database installmnet value : ", error)
    res.send('Failed updating installment');
  }

})

app.get('/getFeeDetailsFE/:id', (req, res) => {
  const uid = req.params.id;
  let dataToSend = [];
  let combinedData;

  const query = util.promisify(db.query).bind(db);
  async function performQueries(uid) {

    try {
      // First query
      const query1 = `SELECT allotedBranch, fullname, year_of_admission, receiptNumber FROM user_details_admission1 WHERE id = ${uid} ; `;
      let result1 = await query(query1, uid);
      console.log("result1", result1)
      if (result1.length > 0) {
        // dataToSend = result1;
        if (result1[0].receiptNumber === null) {
          const query3 = `SELECT MAX(receiptNumber) from user_details_admission1 ;`;
          const result3 = await query(query3);
          console.log("result3", result3)
          console.log("Max val", result3[0]["MAX(receiptNumber)"])
          if (result3[0]["MAX(receiptNumber)"] === null) {
            result1[0].receiptNumber = 1;
            const query4 = `UPDATE user_details_admission1 SET receiptNumber = 1 WHERE id = ${uid} ; `;
            const result4 = await query(query4);
            console.log("result4", result4)
          } else {
            result1[0].receiptNumber = parseInt(result3[0]["MAX(receiptNumber)"]) + 1;
            console.log("updated result for recipt", result1[0].receiptNumber)
            const query5 = `UPDATE user_details_admission1 SET receiptNumber = ${parseInt(result3[0]["MAX(receiptNumber)"]) + 1} WHERE id = ${uid} ; `;
            const result5 = await query(query5);
            console.log("result4", result5)
          }

        }
        // You can now perform the second query here
        const query2 = `SELECT * from fee_structure WHERE admission_year = 2024`;
        const result2 = await query(query2);
        console.log("Received result from second query:", result2);
        dataToSend = [result1[0], result2[0]];
        combinedData = { ...dataToSend[0], ...dataToSend[1] };

      } else {
        console.log("No email found for the given id");
      }
    } catch (err) {
      console.log("Error while updating:", err);
    }

    res.send(combinedData);


  }

  // Call the async function with the appropriate id
  performQueries(uid);


})

/////////////////////////////////////////////////////////////////JEE MERIT//////////////////////////////////////////////////

async function fetchStudentsForJee() {
  const connection = await mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'reg_portal' // Your database name
  });

  const [rows] = await connection.execute(`SELECT fullname, jee_percentile, 12th_marks_obtained, preferences, Alloted_branch,  AllotedBy, id FROM user_details WHERE addedToMerit = true  AND jee_percentile <> '' AND jee_percentile <> '0';`);
  await connection.end();
  return rows;
}

// Compare students based on various attributes
function compareStudentsForJee(studentA, studentB) {
  const attributes = ["jee_percentile", "12th_marks_obtained"];
  for (let attr of attributes) {
    const valA = parseFloat(studentA[attr])
    const valB = parseFloat(studentB[attr])
    if (valA > valB) {
      return -1;
    } else if (valA < valB) {
      return 1;
    }
  }
  return 0;
}

// Generate merit list
function generateMeritListForJee(students) {
  const sortedStudents = students.slice().sort(compareStudentsForJee);

  sortedStudents.forEach((student, index) => {
    student.meritNumber = index + 1;
  });

  return sortedStudents;
}

// API endpoint to get merit list
app.get('/jeemeritlist', async (req, res) => {
  try {
    const students = await fetchStudentsForJee();
    const meritList = generateMeritListForJee(students);
    console.log(meritList);
    res.json(meritList);
  } catch (error) {
    console.error('Error fetching or processing students:', error);
    res.status(500).send('Internal Server Error');
  }
});

/////////////////////////////////////////////////////////////////JEE MERIT//////////////////////////////////////////////////
//Document receipt endpoint /////////

app.get('/getdocperinfo/:email', (req, res) => {
  const email = req.params.email;
  console.log(email);
  const query = `SELECT id, fullname, email, mobile_number, annual_income, category, transaction_id, allotedBranch,cet_application_id, photo, marksheet10, leavingCertificate12, marksheet12, cetMarksheet, jeeMarksheet, signature, domicilecert, castecertificate, castevalidity, noncreamylayer, income, other, cbse_admit_card_id, fcverificationcopy, capAllotmentLetter, fcverificationcopyStatus, capAllotmentLetterStatus,cbse_admit_card_idStatus,photoStatus, leavingCertificate12Status, marksheet10Status, marksheet12Status, cetMarksheetStatus, jeeMarksheetStatus, signatureStatus, domicilecertStatus, castecertificateStatus, castevalidityStatus, noncreamylayerStatus, incomeStatus, otherStatus, transactionproofStatus, documentsApproved FROM user_details_admission1 WHERE email = '${email}'; `;
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      console.log('error while fetching receipt details ', err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  })


})


// Endpoint for login
app.get('/login', (req, res) => {
  const { email, password } = req.query;
  console.log(email);
  console.log(password);
  // Validate credentials
  const query = 'SELECT password, name FROM admin_table WHERE email = ? ;'
  db.query(query, email, (err, results) => {
    console.log(results);
    if (password === results[0].password) {
      res.status(200).json({ name: results[0].name });
    } else {
      // res.status(200).json({name : results[0].name });
      res.status(200).json({ message: 'Invalid email or password' });
    }
  })

});











const beTcDetailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.body.email;
    const dirname = email.toString();
    console.log(dirname);
    console.log(typeof (dirname));

    const uploadPath = path.join(__dirname, 'beTcDetails', dirname); // Use path.join for cross-platform compatibility

    // Create directory if it does not exist
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err); // Pass the error to callback
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const fileType = file.mimetype;
    const extension = fileType === 'application/pdf' ? 'pdf' :
      fileType === 'image/jpeg' ? 'jpeg' :
        fileType === 'image/png' ? 'png' : 'unknown';

    cb(null, `${file.fieldname.toString()}.${extension}`);
  }
});

const beTcDetailUpload = multer({ storage: beTcDetailStorage });




app.post('/betcdetailsubmit', beTcDetailUpload.fields([{ name: 'admitCard', maxCount: 1 }, { name: 'prevCollageTc', maxCount: 1 }, { name: 'offerLetter', maxCount: 1 }]), (req, res) => {
  // Extract form data from req.body and files from req.files
  const {
    fullName, email, caste, dateOfAdmission, Progress, juniorCollege, mobileNumber,
    Conduct, dateOfLeaving, currClass, reason, remark, registrationNo, rollno,
    nationality, religion, dateOfBirthInWords, mothersTongue, dateOfBirth, birthPlace,
    offerLetter, verificationStatus, prn
  } = req.body;

  let grades = {};
  if (req.body.grades) {
    try {
      grades = JSON.parse(req.body.grades);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON in grades field' });
    }
  } // Assuming grades are passed as a JSON string

  // Prepare file paths
  const admitCard = req.files['admitCard'] ? req.files['admitCard'][0].path : null;
  const prevCollageTc = req.files['prevCollageTc'] ? req.files['prevCollageTc'][0].path : null;

  // Prepare SQL query to insert data
  const sql = `
  INSERT INTO be_tc_details (
    fullName, email, caste, dateOfAdmission, Progress, juniorCollege, mobileNumber,
    Conduct, dateOfLeaving, currClass, reason, remark, registrationNo, rollno,
    nationality, religion, dateOfBirthInWords, mothersTongue, dateOfBirth, birthPlace,
    offerLetter, verificationStatus, prn, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8,
    admitCard, prevCollageTc
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?)
`;

  const values = [
    fullName, email, caste, dateOfAdmission, Progress, juniorCollege, mobileNumber,
    Conduct, dateOfLeaving, currClass, reason, remark, registrationNo, rollno,
    nationality, religion, dateOfBirthInWords, mothersTongue, dateOfBirth, birthPlace,
    offerLetter, verificationStatus, prn, grades.sem1, grades.sem2, grades.sem3, grades.sem4,
    grades.sem5, grades.sem6, grades.sem7, grades.sem8, admitCard, prevCollageTc
  ];

  // Execute SQL query
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }

    res.json({
      message: 'Data and files saved successfully',
      fileDetails: {
        admitCard: admitCard,
        prevCollageTc: prevCollageTc
      }
    });
  });
});





app.post('/betcdetailupdate', beTcDetailUpload.fields([{ name: 'admitCard', maxCount: 1 }, { name: 'prevCollageTc', maxCount: 1 }, { name: 'offerLetter', maxCount: 1 }]), (req, res) => {
  // Extract form data from req.body and files from req.files
  const {
    fullName, email, caste, dateOfAdmission, Progress, juniorCollege, mobileNumber,
    Conduct, dateOfLeaving, currClass, reason, remark, registrationNo, rollno,
    nationality, religion, dateOfBirthInWords, mothersTongue, dateOfBirth, birthPlace,
    verificationStatus, prn
  } = req.body;

  let grades = {};
  if (req.body.grades) {
    try {
      grades = JSON.parse(req.body.grades);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON in grades field' });
    }
  } // Assuming grades are passed as a JSON string

  // Prepare file paths
  const admitCard = req.files['admitCard'] ? req.files['admitCard'][0].path : null;
  const offerLetter = req.files['offerLetter'] ? req.files['offerLetter'][0].path : null;
  const prevCollageTc = req.files['prevCollageTc'] ? req.files['prevCollageTc'][0].path : null;

  // Prepare SQL query to insert data
  const sql = `
 UPDATE be_tc_details
SET
    fullName = ?,
    email = ?,
    caste = ?,
    dateOfAdmission = ?,
    Progress = ?,
    juniorCollege = ?,
    mobileNumber = ?,
    Conduct = ?,
    dateOfLeaving = ?,
    currClass = ?,
    reason = ?,
    remark = ?,
    registrationNo = ?,
    rollno = ?,
    nationality = ?,
    religion = ?,
    dateOfBirthInWords = ?,
    mothersTongue = ?,
    dateOfBirth = ?,
    birthPlace = ?,
    offerLetter = ?,
    prn = ?,
    
    admitCard = ?,
    prevCollageTc = ?
WHERE email = ?;  -- Assuming registrationNo is the unique identifier

`;

  const values = [
    fullName, email, caste, dateOfAdmission, Progress, juniorCollege, mobileNumber,
    Conduct, dateOfLeaving, currClass, reason, remark, registrationNo, rollno,
    nationality, religion, dateOfBirthInWords, mothersTongue, dateOfBirth, birthPlace,
    offerLetter, prn, admitCard, prevCollageTc, email
  ];

  // Execute SQL query
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }

    res.json({
      message: 'Data and files saved successfully',
      fileDetails: {
        admitCard: admitCard,
        prevCollageTc: prevCollageTc
      }
    });
  });
});


app.post('/betcdetailststusupdate', (req, res) => {
  const email  = req.body;
  // console.log(data)
  if (!email) {
    console.log("email missing")
    return res.status(400).json({ error: 'Email and verification not reached' });
  }
  // if (verificationStatus === "Approved") {
  //   console.log("already aproved")
  //   return res.status(400).json({ error: 'Already verified' });
  // }
  const sql = `UPDATE be_tc_details SET verificationStatus="Approved" WHERE email="${email}";`
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }

    res.json({
      message: 'Data and files saved successfully',
      
    });
  })
})

app.use('/betcfiles', express.static(path.join(__dirname, 'beTcDetails')));
app.post('/betcretriveadmin', (req, res) => {
  const { email } = req.body;
  console.log(email)

  if (!email) {
    console.log("emailnot recived",email)
      return res.status(400).json({error : "email not found", success:false})
    }
  const sql = `select * from be_tc_details where email="${email}";`
  db.query(sql, (err, result) => {
    if (err) {
      console.error("error retrivind data", err);
      return res.status(500).json({ error: "error quering data", success: false })
      
    }
    console.log(result)
    res.status(200).json({
      message: "data retrival sucessfull",
      data : result,
      success: true,
    })
  })

  
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



