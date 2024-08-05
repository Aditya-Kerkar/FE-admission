import React, { forwardRef } from 'react';


const CustomDateInput = forwardRef(({ value, onChange }, ref) => (
  <input
    type="text"
    value={value} // Optional if using controlled component
    onChange={(e) => {
      if (e.target) { // Check if target exists
        const typedDate = e.target.value;
        // Parse the typed date string into a Date object (handle invalid formats)
        const parsedDate = new Date(typedDate);
        if (!isNaN(parsedDate)) { // Check if valid date
          onChange(parsedDate);
        }
      }
    }}
    ref={ref}
    className="datepicker-input"
    placeholder="DD/MM/YYYY"
  />
));



export default CustomDateInput;
