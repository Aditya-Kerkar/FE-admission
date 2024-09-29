import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"; // bootstrap.bundle.min.js / bootstrap.bundle.js

import "./ApplicantsList.css";
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import './MeritList.css'

function MeritList() {
  const [data, setData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const jsonArrayToString = (str, index) => {
    let elements = str.substring(1, str.length - 1).split(", ");
    let output = elements[index];
    output = output.substring(1, output.length - 1 );
    return output;
  };

  const handleAssign = async (id, branch) => {
    const branchAlloted = { id: id, Alloted_branch: branch };
    axios.put(`http://localhost:3001/branchallotment`, branchAlloted)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        // Handle success, update UI or state as needed
      })
      .catch(error => {
        console.error('Error updating data:', error);
        // Handle error, show error message or retry logic
      });
    window.location.reload();
  }

  useEffect(() => {
    axios.get('http://localhost:3001/meritList')
      .then((response) => {
        setData(response.data);
        const initialBranches = response.data.map(row => {
          if (row.Alloted_branch !== null) {
            return row.Alloted_branch; // Push actual branch name if not null
          } else {
            return 'SELECT'; // Push 'SELECT' if null
          }
        });
        setSelectedBranches(initialBranches);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleDropdownChange = (index, branch) => {
    setSelectedBranches(prevBranches => {
      const newBranches = [...prevBranches];
      newBranches[index] = branch;
      return newBranches;
    });
  }

  const componentRef = useRef();
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'MeritList',
    pageStyle: `
      @page {
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  }

  const filteredData = data.filter(row =>
    row.fullname.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="title">
        <h2>Merit list</h2>
      </div>
      <div className="search-container-merit">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="form-control"
        />
      </div>
      <div className="table-container" ref={componentRef}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Institute Rank</th>
              <th scope="col">Name</th>
              <th scope="col">CET percentile</th>
              <th scope="col">Preference 1</th>
              <th scope="col">Preference 2</th>
              <th scope="col">Preference 3</th>
              <th scope="col">Preference 4</th>
              <th scope="col">Preference 5</th>
              <th scope="col">Preference 6</th>
              <th scope="col">Preference 7</th>
              <th scope="col">Preference 8</th>
              <th scope="col">Assign</th>
              <th scope="col">Alloted Branch</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.meritNumber}</td>
                <td>{row.fullname}</td>
                <td>{row.cet_percentile}</td>

                <td>{(row.preferences[0])}</td>
                <td>{(row.preferences[1])}</td>
                <td>{(row.preferences[2])}</td>
                <td>{(row.preferences[3])}</td>
                <td>{(row.preferences[4])}</td>
                <td>{(row.preferences[5])}</td>
                <td>{(row.preferences[6])}</td>
                <td>{(row.preferences[7])}</td>
                <td className="assigntd">
                  <div className="row">
                    <div className="col">
                      <div className="dropdown">
                        <button
                          className="btn branch-btn dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {selectedBranches[index]}
                        </button>
                        <ul className="dropdown-menu" id={index}>
                          <li onClick={() => handleDropdownChange(index, 'CE')}>
                            CE
                          </li >
                          <li onClick={() => handleDropdownChange(index, 'IT')}>
                            IT
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'AIDS')}>
                            AIDS
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'AIML')}>
                            AIML
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'ECS')}>
                            ECS
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'IOT')}>
                            IOT
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'EXTC')}>
                            EXTC
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'MECH')}>
                            MECH
                          </li>
                          <li onClick={() => handleDropdownChange(index, 'None')}>
                            None
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col">
                      <button type="button" className="btn assignbtn" onClick={() => { handleAssign(row.id, selectedBranches[index]) }}>Assign</button>
                    </div>
                  </div>
                </td>
                <td>
                  {row.Alloted_branch === null &&
                    <p>None</p>
                  }
                  {row.Alloted_branch !== null &&
                    <p>{row.Alloted_branch}</p>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden table for printing */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <div className="row-title-merit">Merit List</div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Institute Rank</th>
                <th scope="col">Name</th>
                <th scope="col">Alloted Branch</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.meritNumber}</td>
                  <td>{row.fullname}</td>
                  <td>
                    {row.Alloted_branch === null && <p>None</p>}
                    {row.Alloted_branch !== null && <p>{row.Alloted_branch}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row">
        <div className="col col-pdf">
          <div className="print-button-container">
            <button onClick={handlePrint} className="btn verify-btn">
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeritList;