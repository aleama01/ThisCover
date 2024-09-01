// Example of accessing auth context in a component
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getAlbum, getMyAlbum } from '../lib/spotify-get-token';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [thing, setThing] = useState({})

  useEffect(() => {
    const getEverything = async () => {
      const res = await getMyAlbum();
      console.log(res);
      setThing(res);
    }
    getEverything();
  }, [])

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
          <h3>Carica l'album</h3>
        </div>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
