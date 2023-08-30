import { useState } from 'react';



function Authenticate({ token }) {
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null); // State variable to store the username
  const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
  const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

 async function handleClick() {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Check if the response has a data property containing the username
    if (result.data && result.data.username) {
      setUsername(result.data.username);
    }

    setSuccessMessage(result.message);
  } catch (error) {
    setError(error.message);
  }
}

  return (
    <div>
      <h2>Authenticate</h2>
      {username && <p>Welcome, {username}!</p>} {/* Display the username */}
      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}
      <button onClick={handleClick}>Register!</button>
    </div>
  );
}

export default Authenticate;