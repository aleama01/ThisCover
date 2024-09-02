import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './ProtectedRoute';
import './index.css';
import Homepage from './components/Homepage';

function App() {

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' element={<Homepage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
}

export default App;
