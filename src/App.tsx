import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <div className="App">
      <Routes>
        <ProtectedRoute path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
