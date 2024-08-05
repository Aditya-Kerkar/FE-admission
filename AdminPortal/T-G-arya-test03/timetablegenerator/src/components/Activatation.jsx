import React from 'react';
import { useLocation } from 'react-router-dom';

function Activation() {
  const location = useLocation();
  const { name, code } = location.state || {};

  return (
    <div>
      <h2>Activation Page</h2>
      <p>Name: {name}</p>
      <p>Application Number: {code}</p>
    </div>
  );
}

export default Activation;