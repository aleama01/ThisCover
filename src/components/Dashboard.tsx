// Example of accessing auth context in a component
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome to your Dashboard</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
