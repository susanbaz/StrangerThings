import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
  return (
    <header className='header'>
      <nav>
        <ul className='nav-list'>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/posts">Posts</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
