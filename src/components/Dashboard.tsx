// Example of accessing auth context in a component
import React, { ReactEventHandler, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { getAlbum, getMyAlbum, getSearchResults } from '../lib/spotify-get-token';

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [thing, setThing] = useState();
  const [searchAlbum, setSearchAlbum] = useState("");
  const [searchResults, setSearchResults] = useState([{ name: "" }]);


  useEffect(() => {
    const getAlbumName = async () => {
      const res = await getMyAlbum();
      setThing(res);
    }
    getAlbumName();
  }, [])

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

    try {
      const res = await getSearchResults(value);
      setSearchResults(res.albums.items.slice(0, 10));
    } catch (error) {
      console.error("Error fetching search results:", error);
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
