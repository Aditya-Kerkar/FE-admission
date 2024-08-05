import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import './ReportGenerator.css';

const fields = [
  "id", "email", "password", "fullname", "prn", "edumail", "mobile_number", 
  "date_of_birth", "father_name", "father_occupation", "father_mobile_number", 
  "mother_name", "mother_occupation", "mother_mobile_number", "sex", 
  "annual_income", "corres_address", "permanent_address", "area", "category", 
  "nationality", "religion", "domicile", "mother_tongue", "hsc_maths", 
  "hsc_physics", "hsc_chemistry", "hsc_pcm_percentage", 
  "hsc_vocational_subject_name", "10th_board_name", "10th_year_of_passing", 
  "10th_total_marks", "10th_marks_obtained", "10th_percentage", 
  "12th_board_name", "12th_year_of_passing", "12th_total_marks", 
  "12th_marks_obtained", "12th_percentage", "cet_application", 
  "cet_roll_number", "cet_maths_percentile", "cet_physics_percentile", 
  "cet_chemistry_percentile", "cet_percentile", "jee_application", 
  "jee_percentile", "photo", "marksheet10", "leavingcertificate12", 
  "cetmarksheet", "jeemarksheet", "signiture", "preferences", 
  "transaction_date", "transaction_amount"
];

const data = [
  {
    id: 1, email: 'example1@mail.com', password: '******', fullname: 'John Doe', 
    prn: '123456', edumail: 'john.doe@edu.com', mobile_number: '1234567890',
    date_of_birth: '2000-01-01', father_name: 'Richard Doe', father_occupation: 'Engineer', 
    father_mobile_number: '0987654321', mother_name: 'Jane Doe', mother_occupation: 'Teacher', 
    mother_mobile_number: '1122334455', sex: 'Male', annual_income: '100000', 
    corres_address: '123 Main St', permanent_address: '123 Main St', area: 'Urban', 
    category: 'General', nationality: 'American', religion: 'None', domicile: 'California', 
    mother_tongue: 'English', hsc_maths: '90', hsc_physics: '85', hsc_chemistry: '88', 
    hsc_pcm_percentage: '87.67', hsc_vocational_subject_name: 'Computer Science', 
    "10th_board_name": 'State Board', "10th_year_of_passing": '2016', "10th_total_marks": '500', 
    "10th_marks_obtained": '450', "10th_percentage": '90', "12th_board_name": 'State Board', 
    "12th_year_of_passing": '2018', "12th_total_marks": '600', "12th_marks_obtained": '530', 
    "12th_percentage": '88.33', cet_application: '12345678', cet_roll_number: '123456', 
    cet_maths_percentile: '95', cet_physics_percentile: '92', cet_chemistry_percentile: '90', 
    cet_percentile: '92.33', jee_application: '87654321', jee_percentile: '90', photo: 'url', 
    marksheet10: 'url', leavingcertificate12: 'url', cetmarksheet: 'url', jeemarksheet: 'url', 
    signiture: 'url', preferences: 'CS', transaction_date: '2020-01-01', transaction_amount: '1000'
  }
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#E28C41',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ReportGenerator() {
  const [selectedFields, setSelectedFields] = useState(fields);

  const handleFieldChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'selectAll') {
      setSelectedFields(checked ? fields : []);
    } else {
      setSelectedFields(
        checked
          ? [...selectedFields, name]
          : selectedFields.filter((field) => field !== name)
      );
    }
  };

  const isSelectAllChecked = selectedFields.length === fields.length;

  return (
    <>
    This tab is not yet Completed
    </>
    // <ThemeProvider theme={theme}>
    //   <div className="Container">
    //     <Typography className="HeaderText" variant="h4" component="h1">
    //       Dynamic Table Filter
    //     </Typography>
    //     <FormGroup className="FormGroupStyled" row>
    //       <FormControlLabel
    //         className="CheckboxLabel"
    //         control={
    //           <Checkbox
    //             checked={isSelectAllChecked}
    //             onChange={handleFieldChange}
    //             name="selectAll"
    //           />
    //         }
    //         label="Select All"
    //       />
    //       <div className="TableCheckboxGrid">
    //         {fields.map((field) => (
    //           <FormControlLabel
    //             key={field}
    //             className="CheckboxLabel"
    //             control={
    //               <Checkbox
    //                 checked={selectedFields.includes(field)}
    //                 onChange={handleFieldChange}
    //                 name={field}
    //               />
    //             }
    //             label={field}
    //           />
    //         ))}
    //       </div>
    //     </FormGroup>
    //     <TableContainer component={Paper} className="TableContainerStyled">
    //       <Table>
    //         <TableHead className="TableHeader">
    //           <TableRow>
    //             {selectedFields.map((field) => (
    //               <TableCell key={field} className="TableHeaderCell">{field}</TableCell>
    //             ))}
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {data.map((row, index) => (
    //             <TableRow key={index} className="TableBodyRow">
    //               {selectedFields.map((field) => (
    //                 <TableCell key={field} className="TableCellStyled">{row[field]}</TableCell>
    //               ))}
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   </div>
    // </ThemeProvider>
  );
}

export default ReportGenerator;