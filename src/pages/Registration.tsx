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
      const response = await axios.post(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);

      // Automatically log in the user after registration
      const responseLogin = await axios.post(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/login`, { username, password });
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
      <h1 className='text-center my-4'>
        ThisCover
      </h1>

      {previewImage && (
        <img
          src={previewImage}
          alt="Profile Preview"
          className="mb-3"
          style={{ width: '150px', height: '150px', borderRadius: '100%', objectFit: 'cover' }}
        />
      )}
      <form onSubmit={handleSubmit} className="d-flex w-75 justify-content-center align-items-center flex-column">
        <div className='d-flex align-items-start flex-column col-12 col-sm-6'>
          <label htmlFor="file" className="text-left ps-2">Profile Image</label>
          <input
            type="file"
            id='user_img_input'
            accept="image/*"
            onChange={handleImageChange}
            className="w-100 mb-2"
          />
        </div>
        <div className='d-flex align-items-start flex-column col-12 col-sm-6'>

          <label htmlFor="text" className="text-left ps-2">Username</label>
          <input
            type="text"
            placeholder="pinco_pallino"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-100 mb-2"
            required
          />
        </div>
        <div className='d-flex align-items-start flex-column col-12 col-sm-6'>
          <label htmlFor="password" className="text-left ps-2">Password</label>
          <input
            type="password"
            placeholder="1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-100 mb-4"
            required
          />
        </div>
        <button type="submit" className='btn-accent col-12 col-sm-6'>Register</button>
        <button className='btn-black col-12 col-sm-6' onClick={() => navigate("/login")}>Go to login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Registration;
