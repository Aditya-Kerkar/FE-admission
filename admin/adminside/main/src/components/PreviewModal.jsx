import  React, {useState} from "react";

function PreviewModal(){
    let [showModal, setShowModal] = useState(false);
    const ApproveDoc = ()=>{
        console.log("Document approved");
    }
    const RejectDoc = ()=>{
        console.log("Document rejected");
    }
    return (
        <>
          <div className="container">
            <div className="row">
                <button type="button" onClick={()=>{
                    setShowModal(false);
                }} class="btn btn-secondary">Back</button>
            </div>
            <div className="row">
              <img src="https://picsum.photos/200/300" className="img-fluid" alt="..."/>
            </div>
            <div className="row">
                <div className="col">
                  <button type="button" onClick={ApproveDoc} class="btn btn-success">Approve</button>
                </div>
                <div className="col">
                  <button type="button" onClick={RejectDoc} class="btn btn-danger">Reject</button>
                </div>
            </div>
            
          </div>
        </>
    )
}

export default PreviewModal;