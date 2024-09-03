import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/register', { username, email, password });
      setMessage(response.data.message);

      const responseLogin = await axios.post('http://localhost:3000/api/login', { email, password });
      sessionStorage.setItem('token', responseLogin.data.token);
      sessionStorage.setItem('id', responseLogin.data.id);
      setIsAuthenticated(true)
      navigate('/');
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-center flex-column dark-theme'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="d-flex w-75 justify-content-center align-items-start flex-column">
        <label htmlFor="text" className="text-left ps-2">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="col-12 mb-2"
        />
        <label htmlFor="email" className="text-left ps-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="col-12 mb-2"
        />
        <label htmlFor="password" className="text-left ps-2">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="col-12 mb-4"
        />
        <button type="submit" className='btn-accent w-100'>Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Registration