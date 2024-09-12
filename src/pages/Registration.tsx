import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Append the profile image if available
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      // Register the user
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);

      // Automatically log in the user after registration
      const responseLogin = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/login`, { username, password });
      sessionStorage.setItem('token', responseLogin.data.token);
      sessionStorage.setItem('id', responseLogin.data.id);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-center flex-column dark-theme'>
      <h1>Register</h1>
      {previewImage && (
        <img
          src={previewImage}
          alt="Profile Preview"
          className="mb-3"
          style={{ width: '150px', height: '150px', borderRadius: '100%', objectFit: 'cover' }}
        />
      )}
      <form onSubmit={handleSubmit} className="d-flex w-75 justify-content-center align-items-start flex-column">

        <label htmlFor="profileImage" className="text-left ps-2">Profile Image (optional)</label>
        <input
          type="file"
          id='user_img_input'
          accept="image/*"
          onChange={handleImageChange}
          className="col-12 mb-2"
        />

        <label htmlFor="text" className="text-left ps-2">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="col-12 mb-2"
          required
        />
        <label htmlFor="password" className="text-left ps-2">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="col-12 mb-4"
          required
        />
        <button type="submit" className='btn-accent w-100'>Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Registration;
