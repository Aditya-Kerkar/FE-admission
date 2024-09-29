import React, { useState } from 'react';
const back_url = process.env.REACT_APP_backUrl;

export default function SignInPage({ onSignIn, goToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState('initialSection');
  

  const handleSignIn = async (event) => {
    event.preventDefault();


    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    // Proceed with the usual sign-in process
    try {
      const response = await fetch(`${back_url}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Please check email and password .');
      }

      const result = await response.json();
      if (result.success) {
        alert('Login successful');
        onSignIn(result.userData);
      } else {
        console.log("invalid password")
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Handler(15) Error: ' + error.message);
    }
  };
/////////////////////////////////////////////////////////////////////////////////////////
  // const handleRequestOtp = async (event) => 
  // {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:4511/api/request-reset-password', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Email is not registered with usNetwork response was not ok');////////////////////
  //     }

  //     const result = await response.json();
  //     if (result.message === 'OTP sent successfully') {
  //       setOtpSent(true);
  //       alert(result.message);
  //     } else {
  //       setError('Error sending OTP');
  //     }
  //   } catch (error) {
  //     setError('Network error: ' + error.message);
  //   }
  // };

//////////////trial1

const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${back_url}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Inavlid Network response . Please try again later.');
      }

      const result = await response.json();
      if (result.message === 'Password reset successfully') {
        alert('Password reset successfully. Please sign in with your new password.');
        setIsForgotPassword(false);
        setOtpSent(false);
      } else {
        setError('Error resetting password');
      }
    } catch (error) {
      setError('Handler error(80) : ' + error.message);
    }
  };

const handleRequestOtp = async (event) => {
  event.preventDefault();
  try {
    const response = await fetch(`${back_url}/api/request-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        alert('Email is not registered go to SignUp');
       // throw new Error('Email is not registered with us');
      } else {
        throw new Error(result.message || 'Internal service error . Please try again later .');
      }
    }

    if (result.message === 'OTP sent successfully') {
      setOtpSent(true);
      alert(result.message);
    } else {
      setError('Error sending OTP . Please try again after some time .');
    }
  } catch (error) {
    setError('Handler(108) error: ' + error.message);
  }
};
  //  trail1 end
  /////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container">
      {!isForgotPassword ? (
        <form onSubmit={handleSignIn}>
          <h1 className="center page-heading">Sign-In</h1>
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
            <button type="submit">Sign In</button>
            <button type="button" onClick={goToSignup}>Sign Up</button>
            <button type="button" onClick={() => setIsForgotPassword(true)}>Forgot Password?</button>
          </div>
        </form>
      ) : (
        <div>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp}>
              <h1 className="center page-heading">Reset Password</h1>
              <div className='input-field'>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {error && <p className="error">{error}</p>}
              <br></br>
              <div className="buttons">
                <button type="submit">Request OTP</button>
                <button type="button" onClick={() => setIsForgotPassword(false)}>Back to Sign In</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <h1 className="center page-heading">Reset Password</h1>
              <div className='input-field'>
                <label>OTP:</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <div className='input-field'>
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              {error && <p className="error">{error}</p>}
              
              <div className="buttons">
                <button type="submit">Reset Password</button>
              </div>
            </form>
          )}
          <div className="buttons">
            
          </div>
        </div>
      )}
    </div>
  );
}
