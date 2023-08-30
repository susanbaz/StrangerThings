import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({setIsLoggedIn}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/home');
    setShowConfirmDialog(false);
    setIsLoggedIn(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmDialog(false);
  };

  return (
    
      <div className="log-out">
        <h1>Logout</h1>
        {!showConfirmDialog && <button onClick={handleLogoutClick}>Logout</button>} {/* Conditionally render the button based on showConfirmDialog */}

        {showConfirmDialog && (
          <div className="confirm-dialog">
            <p>Are you sure you want to log out?</p>
            <button onClick={handleConfirmLogout}>Yes</button>
            <button onClick={handleCancelLogout}>No</button>
          </div>
        )}
      </div>
    
  );
};

export default Logout;