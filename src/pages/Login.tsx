import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../index.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated, setIsAuthenticated, setIsId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      setMessage(response.data.message);
      // Save token to local storage or context
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('id', response.data.id);
      setIsId(response.data.id);
      setIsAuthenticated(true)
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
      <form onSubmit={handleSubmit} className="d-flex w-75 justify-content-center align-items-center flex-column">
        <div className='d-flex align-items-start flex-column col-12 col-sm-6'>
          <label htmlFor="username" className="text-left ps-2">Username</label>
          <input
            type="username"
            placeholder="pinco_pallino"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-100 mb-2"
          />
        </div>
        <div className='d-flex align-items-start flex-column col-12 col-sm-6'>
          <label htmlFor="password" className="text-left ps-2">Password</label>
          <input
            type="password"
            placeholder="1234"
            value={password}
            className="w-100 mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className='btn-accent col-12 col-sm-6'>Login</button>
        <button className='btn-black col-12 col-sm-6' onClick={() => navigate("/registration")}>Go to registration</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
