import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
  const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

  async function registerUser(authenticate = false) {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: {
            username,
            password
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error.message || 'Registration failed. Please try again.');
      }

      setSuccessMessage('Registration Successful! You can now login.');

      // If authenticate flag is true, set the token
      if (authenticate && result.data && result.data.token) {
        setAuthToken(result.data.token);
      }

      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleAuthenticate(event) {
    event.preventDefault();
    registerUser(true);
  }

  return (
    
      <div className='register-1'>
        <h2>Register & Become a User!</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {authToken && !successMessage && <p>You are authenticated.</p>}
        <form onSubmit={handleAuthenticate}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    
  );
}

export default Register;