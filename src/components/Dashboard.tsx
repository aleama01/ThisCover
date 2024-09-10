// Example of accessing auth context in a component
import React, { ReactEventHandler, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getSearchResults } from '../lib/spotify-get-token';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [thing, setThing] = useState();
  const [searchAlbum, setSearchAlbum] = useState("");
  const [searchResults, setSearchResults] = useState([{ name: "" }]);



  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchAlbum(value);

    if (value.trim() === "") {
      setSearchResults([]); // Clear results if input is empty
      return;
    }

  }

  return (
    <div>
      <div>
        <h2>Welcome to your Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
        <h3>Carica l'album</h3>
        <p>{thing}</p>
      </div>
      <hr />
      <input type="text" placeholder="Search.." value={searchAlbum} onChange={handleSearch}></input>
      {searchResults.length > 0 && (
        searchResults.map((album, index) => (
          <div key={index}>
            <p>{album.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
