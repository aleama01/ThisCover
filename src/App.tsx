import React, { useState, useEffect, useContext } from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
