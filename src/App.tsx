import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './ProtectedRoute';
import './index.css';
import Homepage from './components/Homepage';
import Friends from './pages/Friends';
import Account from './pages/Account';
import FriendPage from './pages/friends/FriendPage';

function App() {

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/account' element={<Account />} />
        <Route path='/friends/:friend_username/:friend_id' element={<FriendPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
}

export default App;
