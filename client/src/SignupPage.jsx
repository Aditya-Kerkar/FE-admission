import React, { useState } from 'react';
const back_url = process.env.REACT_APP_backUrl;


export default function SignupPage({ onSignupComplete }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [uniqueKey, setUniqueKey] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${back_url}/api/generate-key-and-send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Unable to generate OTP/KEY:  ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      
      setOtpSent(true);
      setUniqueKey(result.key);
      alert(result.message); // Inform user OTP is sent
    } catch (error) {
      setError('Handler(10) error: ' + error.message);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${back_url}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Invalid response : ${errorData.message || 'Unknown error'}`);
    }
      

      const result = await response.json();
      if (result.success) {
        alert('OTP verification successful. Please sign in.');
        onSignupComplete(email);
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError('Handler(39) error: ' + error.message);
    }
  };

  return (
    <div className="container">
      {!otpSent ? (
        <form onSubmit={handleSignup}>
        <h1 className="center page-heading">Sign-Up</h1>
          <div className='input-field'>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='input-field'>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <br></br>
          <div className="buttons">
            <button type="submit">Sign Up</button>
          </div>
          
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className='input-field'>
            <label>Enter OTP:</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button cltype="submit">Verify OTP</button>
          </div>
        </form>
      )}
    </div>
  );
}
