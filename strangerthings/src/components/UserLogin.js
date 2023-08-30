import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLogin({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
  const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setToken(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    await login();
  };

  const login = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            password,
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.data && result.data.token) {
          const token = result.data.token;
          localStorage.setItem('authToken', token);
          localStorage.setItem('username', result.data.username); // Store the username in local storage
          setToken(token);
          await Authenticate(token);

          onLogin();

          navigate('/profile');
        }
      } else {
        setError(result.error ? result.error : 'Invalid username or password.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while logging in.');
    }
  };

  const Authenticate = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Authenticated response:', result);
      } else {
        setError('Authentication failed.');
      }

      return result;
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    }
  };

  return (
    
      <div className="users">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>

  );
}

export default UserLogin;