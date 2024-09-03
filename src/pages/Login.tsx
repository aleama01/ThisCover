import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../index.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      console.log(response)
      setMessage(response.data.message);
      // Save token to local storage or context
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('id', response.data.id);
      setIsAuthenticated(true)
      navigate('/');
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-center flex-column dark-theme'>
      <h1 className='text-center'>Login</h1>
      <form onSubmit={handleSubmit} className="d-flex w-75 justify-content-center align-items-start flex-column">
        <label htmlFor="email" className="text-left ps-2">Email</label>
        <input
          type="email"
          placeholder="JohnSmith@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="col-12 mb-2"
        />
        <label htmlFor="password" className="text-left ps-2">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="col-12 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='btn-accent w-100'>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
