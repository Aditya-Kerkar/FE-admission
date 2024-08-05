import React, { useState } from "react";

function ReceiptGeneration() {
    const studentDetails = {id:1, name:'Mark Henry', applicationid:'AHDCO12131',dob:'2005-4-12',email:'markhenry2873@gmail.com', mobilenumber:'7718212891',fname:'Peter Henry',foccupation:'Government Service' ,fnumber:'9718787891',mname:'Perry Henry',moccupation:'Government Service' ,mnumber:'8818787891',sex:'Male', annualincome:'100000000', correspondAdd:'401, Citi Hill View, plot no 13, sec 19 Nerul, Navi Mumbai Pin :400706',permanentAdd:'401, Citi Hill View, plot no 13, sec 19 Nerul, Navi Mumbai Pin :400706',area:'urban',nationality:'Indian',religion:'Sikh', category:'General',domacile:'Maharastra',MotherTongue:'Punjabi', jeeappnumber:"MR21293829", jeepercentile:'88.7287811',CETrollno : '128371923',cetmaths:'80.6744329',cetphysics:'84.7905171',cetchem:'95.58.14429',cetpercentile:'91.134735', hscmaths:'80',hscphysics:"71",hscchem:'95',hscPCMpercentage:'82.00',hscvocation:'Computer Science', hscsubmarks:'93',hscPCVpercentage:'81.33', passingyear10:'2021',passingyear12:'2023',board10:'CBSE',board12:'CBSE', totalmarks10:'500',totalmarks12:'500',scoredmarks10:'459', scoredmarks12:'432',pref1:'Computer Engineering',pref2:'Information Technology',pref3:'Artificial intelligence and Data science'  }
  return (
    <>
      <div className="container">
        <div className="row title-row">
          <div className="col-2">
            <img src="" alt="SIES LOGO" />
          </div>
          <div className="col-10">
            <div className="row">
                <div className="col-8">
                    <div className="row">SIES GRADUATE SCHOOL OF TECHNOLOGY</div>
                    <div className="row">Sri Chandrasekarendra Saraswati Vidyapuram</div>
                    <div className="row"> Sector-V, Nerul, Navi Mumbai, Maharastra 400706</div>
                    <div className="row">Phone: 022 6108 2400</div>
                    <div className="row">Admission (2024-25)</div>
                </div>
                <div className="col-4">
                    <div className="row">
                        <div className="col">
                            <img src="" alt="Signature here" />
                        </div>
                        <div className="col">
                            <img src="" alt="Studentphotohere" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div className="row row2">
          <div className="col-2">Name</div>
          <div className="col-6">{studentDetails.name}</div>
          <div className="col-4">{studentDetails.applicationid}</div>
        </div>
        <div className="row">
          <div className="col-2">ID</div>
          <div className="col-10">{studentDetails.applicationid}</div>
        </div>
        <div className="row">
          <div className="col-2">Date of Birth</div>
          <div className="col-10">{studentDetails.dob}</div>
        </div>
        <div className="row">
          <div className="col-2">Email Id</div>
          <div className="col-10">{studentDetails.email}</div>
        </div>
        <div className="row">
          <div className="col-2">Mobile No.</div>
          <div className="col-10">{studentDetails.mobilenumber}</div>
        </div>
        <div className="row">
          <div className="col-2">Father's Name</div>
          <div className="col-10">{studentDetails.fname}</div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10"></div>
        </div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
      </div>
    </>
  );
}

export default ReceiptGeneration;
