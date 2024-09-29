import "./RejectedTransaction.css";
import { useState, useEffect } from "react";
import axios from "axios";

function RejectedTransaction() {
  const [isChecked, setIsChecked] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);
  const [editingInstallment, setEditingInstallment] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  // To take input of transactionId and upload it 
  const [transactionID, setTransactionID] = useState([])
  // To take input of transactionId2 and upload it 
  const [transactionID2, setTransactionID2] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3001/getTransactionRejectList")
      .then((response) => {
        console.log(response.data);
        setRejectedList(response.data);
        const initialCheckedState = response.data.map((row) => ({
          id: row.id,
          installment: row.installment,
        }));
        setIsChecked(initialCheckedState);

        const transactionID2copy = response.data.map((row)=>({
          id : row.id,
          transactionID2 : row.transactionID2,
        }))
        setTransactionID2(transactionID2copy);

        const transactionIDcopy = response.data.map((row)=>({
          id : row.id,
          transactionID : row.transactionID,
        }))
        setTransactionID(transactionIDcopy);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, [refreshData]);

  const handleCheckboxChange = (index) => {
    const updatedChecked = isChecked.map((item, i) =>
      i === index ? { ...item, installment: !item.installment } : item
    );
    setIsChecked(updatedChecked);

    const row = rejectedList[index];
    const installmentStatus = !isChecked[index].installment;

    axios
      .put(`http://localhost:3001/updateInstallment/${row.id}`, {
        installment: installmentStatus,
        total_amount: row.total_fees,
      })
      .then((response) => {
        console.log(`Updated installment for id ${row.id}`, response.data);
        setRefreshData((prev) => !prev);
      })
      .catch((error) => {
        console.error(`There was an error updating the installment for id ${row.id}!`, error);
      });
  };

  const handleInstallmentClick = (index, installment) => {
    setEditingInstallment({
      ...editingInstallment,
      [index]: { ...editingInstallment[index], [installment]: true },
    });
  };

  const handleInstallmentChange = (index, installment, value) => {
    setRejectedList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, [installment]: value } : item
      )
    );
  };

  const handleInstallmentBlur = (index, installment) => {
    setEditingInstallment({
      ...editingInstallment,
      [index]: { ...editingInstallment[index], [installment]: false },
    });
  };

  const previewTransactionProof = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `http://localhost:3001/transactionproof1/${id}`
      );
      console.log("Response Data:", response.data); // Log the entire response data

      // Check if response has data and is an array with at least one element
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Extract URLpre from the first element of the response array
        const keyNames = Object.keys(response.data[0]); // Get all keys from the first element

        // Assuming the key to be used is the first key found in the response
        const firstKey = keyNames[0];
        const URLpre = response.data[0][firstKey];

        // Replace backslashes with forward slashes
        function replaceBackslashWithSlash(inputString) {
          return inputString.replace(/\\/g, "/");
        }

        function replacePublic(inputString) {
          return inputString.replace("public", "");
        }

        let actualURL = replaceBackslashWithSlash(URLpre);
        actualURL = replacePublic(actualURL);

        console.log("Key Name:", firstKey);
        console.log("URLpre:", URLpre);
        console.log(actualURL);

        // Make another request to fetch the actual file
        const fileResponse = await axios.get(
          `http://localhost:3001/files/${actualURL}`,
          {
            responseType: "blob", // Important for binary data
          }
        );

        // Create a URL for the received file
        const fileURL = window.URL.createObjectURL(fileResponse.data);
        console.log("File URL:", fileURL);

        // Open the file in a new tab
        window.open(fileURL, "_blank");
      } else {
        console.error("Empty or invalid response data");
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  const handleFileChange = async (event, id, year) => {
    const file = event.target.files[0];
    if (!file) return;

    const foundItem = transactionID.find(item => item.id === id);
    let transactionIDReceived = ''; 
    if (foundItem) {
      console.log(foundItem.transactionId); // This will log 'kjhks'
      transactionIDReceived = foundItem.transactionId
    } else {
      console.log('Item not found');
    }

    const formData = new FormData();
    formData.append('id',id);
    formData.append('year',year)
    formData.append("file", file);
    formData.append('transaction_id',transactionIDReceived)
    console.log(formData);

    try {
      const response = await axios.post(
        `http://localhost:3001/reuploadTransactionProof/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
      window.location.reload()
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const handleTransactionIDChange = (index, value) => {
    const updatedTransactionID = transactionID.map((item, i) =>
      i === index ? { ...item, transactionId: value } : item
    );
    setTransactionID(updatedTransactionID);
    console.log(transactionID);
  };

  const handleTransactionID2Change = (index, value) => {
    const updatedTransactionID2 = transactionID2.map((item, i) =>
      i === index ? { ...item, transactionId2: value } : item
    );
    setTransactionID2(updatedTransactionID2);
    console.log(transactionID2);
  };

  const triggerFileInput = (index) => {
    document.getElementById(`fileInput${index}`).click();
  };


  //Hnadle transactionID2 and proof upload
  const triggerFileInput2 = (index) => {
    document.getElementById(`fileInput2${index}`).click();
  };

  const handleFileChange2 = async (event, id, year) => {
    const file = event.target.files[0];
    if (!file) return;

    const foundItem = transactionID2.find(item => item.id === id);
    let transactionIDReceived = ''; 
    if (foundItem) {
      console.log(foundItem.transactionId2); // This will log 'kjhks'
      transactionIDReceived = foundItem.transactionId2 
    } else {
      console.log('Item not found');
    }

    const formData = new FormData();
    formData.append('id',id);
    formData.append('year',year)
    formData.append("file", file);
    formData.append("transactionID2",transactionIDReceived);
    console.log(formData);

    try {
      const response = await axios.post(
        `http://localhost:3001/uploadTransactionProofandID/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Transaction Proof 2 uploaded successfully", response.data);
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };
  
  ///Handle preview of installment2 proof
  const previewInstallmentProof = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(
        `http://localhost:3001/installment2/${id}`
      );
      console.log("Response Data:", response.data); // Log the entire response data
      ;
      // Check if response has data and is an array with at least one element
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Extract URLpre from the first element of the response array
        const keyNames = Object.keys(response.data[0]); // Get all keys from the first element

        // Assuming the key to be used is the first key found in the response
        const firstKey = keyNames[0];
        const URLpre = response.data[0][firstKey];

        // Replace backslashes with forward slashes
        function replaceBackslashWithSlash(inputString) {
          return inputString.replace(/\\/g, "/");
        }

        function replacePublic(inputString) {
          return inputString.replace("public", "");
        }

        let actualURL = replaceBackslashWithSlash(URLpre);
        actualURL = replacePublic(actualURL);

        console.log("Key Name:", firstKey);
        console.log("URLpre:", URLpre);
        console.log(actualURL);

        // Make another request to fetch the actual file
        const fileResponse = await axios.get(
          `http://localhost:3001/files/${actualURL}`,
          {
            responseType: "blob", // Important for binary data
          }
        );

        // Create a URL for the received file
        const fileURL = window.URL.createObjectURL(fileResponse.data);
        console.log("File URL:", fileURL);

        // Open the file in a new tab
        window.open(fileURL, "_blank");
      } else {
        console.error("Empty or invalid response data");
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
    setRefreshData((prev) => !prev)
  };


  const handleGreenVerify = (id,year)=>{
    console.log("Gren veriffy",id,year)
    try{
      const response = axios.put(`http://localhost:3001/approveRejectedFromTransactionList/${id}/${year}`)
      console.log(response)
    }catch(error){
      console.log("Error while verifying grreeen tick",error);
    }
    setRefreshData((prev) => !prev);
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">UID</th>
            <th scope="col">PRN</th>
            <th scope="col">Year of Admission</th>
            <th scope="col">Total Fees</th>
            <th scope="col">Current Year</th>
            <th scope="col">Transaction ID</th>
            <th scope="col">Preview</th>
            <th scope="col">Reupload</th>
            <th scope="col">Installment Allowed</th>
            <th scope="col">Installment 1</th>
            <th scope="col">Installment 2</th>
            <th scope="col">Transaction ID-2</th>
            <th scope="col">Upload Transaction-2 Receipt</th>
            <th scope="col">Verify</th>
            <th scope="col">Preview</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rejectedList.map((row, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>
                <div className="row verify-row">
                  <div className="col">{row.id}</div>
                </div>
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">{row.prn}</div>
                </div>
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">{row.year_of_admission}</div>
                </div>
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">{row.total_fees}</div>
                </div>
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">{row.current_year}</div>
                </div>
              </td>
              <td>
              <input
                      type="text"
                      value={transactionID[index]?.transactionId || ""}
                      placeholder={row.transaction_id}
                      onChange={(e) =>
                        handleTransactionIDChange(index, e.target.value)
                      }
                    />
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">
                    <button
                      type="button"
                      onClick={() => previewTransactionProof(row.id)}
                      className="btn verify-btn"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <div className="row verify-row">
                  <div className="col">
                    <button
                      type="button"
                      onClick={() => triggerFileInput(index)}
                      className="btn reupload-btn"
                    >
                      Reupload
                    </button>
                    <input
                      type="file"
                      id={`fileInput${index}`}
                      style={{ display: "none" }}
                      accept=".pdf, .jpeg, .png"
                      onChange={(event) => handleFileChange(event, row.id, row.current_year)}
                    />
                  </div>
                </div>
              </td>
              <td className="centered-checkbox">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={isChecked[index]?.installment || false}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
              </td>
              {isChecked[index]?.installment && (
                <>
                  <td>
                    {editingInstallment[index]?.installment_1 ? (
                      <input
                        type="text"
                        value={row.installment1 || ""}
                        onChange={(e) =>
                          handleInstallmentChange(
                            index,
                            "installment_1",
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          handleInstallmentBlur(index, "installment_1")
                        }
                      />
                    ) : (
                      <div
                        className="row verify-row"
                        onClick={() =>
                          handleInstallmentClick(index, "installment_1")
                        }
                      >
                        <div className="col">{row.installment1}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingInstallment[index]?.installment_2 ? (
                      <input
                        type="text"
                        value={row.installment_2 || ""}
                        onChange={(e) =>
                          handleInstallmentChange(
                            index,
                            "installment_2",
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          handleInstallmentBlur(index, "installment_2")
                        }
                      />
                    ) : (
                      <div
                        className="row verify-row"
                        onClick={() =>
                          handleInstallmentClick(index, "installment_2")
                        }
                      >
                        <div className="col">{row.installment2}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={transactionID2[index]?.transactionId2 || ""}
                      placeholder={row.transactionId2}
                      onChange={(e) =>
                        handleTransactionID2Change(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">
                      <button
                      type="button"
                      onClick={() => triggerFileInput2(index)}
                      className="btn reupload-btn"
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      id={`fileInput2${index}`}
                      style={{ display: "none" }}
                      accept=".pdf, .jpeg, .png"
                      onChange={(event) => handleFileChange2(event, row.id, row.current_year)}
                    />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-col">
                      <div className="col">
                        <button
                          type="button"
                          onClick={() => {handleGreenVerify(row.id,row.current_year)}}
                          className="btn green-tick-btn"
                        >
                          ✔
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">
                        <button
                          type="button"
                          onClick={() => previewInstallmentProof(row.id)}
                          className="btn verify-btn"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>{row.status}</td>
                </>
              )}
              {!isChecked[index].installment && (
                <>
                  <td>
                    <div className="row verify-row">
                      <div className="col">-</div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">-</div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">-</div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">-</div>
                    </div>
                  </td>
                  <td>
                    <div className="row verify-row">
                      <div className="col">-</div>
                    </div>
                  </td>
                  <td>{row.status}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default RejectedTransaction;