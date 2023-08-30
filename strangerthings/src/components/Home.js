import React from 'react';

const Home = ({ isAuthenticated }) => {
  return (
        <div>
      <h2>Welcome to the Home Page</h2>
      {isAuthenticated ? (
        <p>This content is visible to authenticated users only.</p>
      ) : (
        <p>Please log in or register to access more features.</p>
      )}
    </div>
  );
}

export default Home;

