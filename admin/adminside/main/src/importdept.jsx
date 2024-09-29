// import React from 'react'
// import './styles-import.css'
// import './import.js'
// export default function () {
//   return (
    
//     <div class="dropdown" data-control="checkbox-dropdown">
//     <script src="./timetablegenerator/node_modules/jquery/dist/jquery.min.js"></script>
//     <script src="import.js"></script>

        
//     <label class="dropdown-label">Select</label>
  
//     <div class="dropdown-list">
//     <a href="#" data-toggle="check-all" class="dropdown-option">
//       Check All  
//     </a>
    
//     <label class="dropdown-option">
//       <input type="checkbox" name="dropdown-group" value="Selection 1" />
//       Selection One
//     </label>
    
//     <label class="dropdown-option">
//       <input type="checkbox" name="dropdown-group" value="Selection 2" />
//       Selection Two
//     </label>
    
//     <label class="dropdown-option">
//       <input type="checkbox" name="dropdown-group" value="Selection 3" />
//       Selection Three
//     </label>
    
//     <label class="dropdown-option">
//       <input type="checkbox" name="dropdown-group" value="Selection 4" />
//       Selection Four
//     </label>
    
//     <label class="dropdown-option">
//       <input type="checkbox" name="dropdown-group" value="Selection 5" />
//       Selection Five
//     </label>      
//   </div>
// </div>
    
//   )
// }

import React, { useState } from 'react';

const DropdownCheckbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [areAllChecked, setAreAllChecked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckAll = () => {
    if (!areAllChecked) {
      setAreAllChecked(true);
      const allOptions = ['Selection 1', 'Selection 2', 'Selection 3', 'Selection 4', 'Selection 5'];
      setSelectedOptions(allOptions);
    } else {
      setAreAllChecked(false);
      setSelectedOptions([]);
    }
  };

  const handleCheckboxChange = (value) => {
    let updatedSelectedOptions = [...selectedOptions];
    if (updatedSelectedOptions.includes(value)) {
      updatedSelectedOptions = updatedSelectedOptions.filter((option) => option !== value);
    } else {
      updatedSelectedOptions.push(value);
    }
    setSelectedOptions(updatedSelectedOptions);
  };

  const dropdownOptions = [
    { value: 'Selection 1', label: 'Selection One' },
    { value: 'Selection 2', label: 'Selection Two' },
    { value: 'Selection 3', label: 'Selection Three' },
    { value: 'Selection 4', label: 'Selection Four' },
    { value: 'Selection 5', label: 'Selection Five' },
  ];

  return (
    <div className={`dropdown ${isOpen ? 'on' : ''}`} data-control="checkbox-dropdown">
      <label className="dropdown-label" onClick={handleToggleOpen}>
        {selectedOptions.length === 0 ? 'Select Options' :
          selectedOptions.length === 1 ? selectedOptions[0] :
          selectedOptions.length === dropdownOptions.length ? 'All Selected' :
          `${selectedOptions.length} Selected`}
      </label>
      {isOpen && (
        <div className="dropdown-list">
          <a href="#" onClick={handleCheckAll} className="dropdown-option">
            {areAllChecked ? 'Uncheck All' : 'Check All'}
          </a>
          {dropdownOptions.map((option) => (
            <label key={option.value} className="dropdown-option">
              <input
                type="checkbox"
                name="dropdown-group"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
