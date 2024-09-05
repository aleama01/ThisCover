import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <div className='dark-theme layout'>
      <div className='position-absolute top-0 end-0 mx-3 my-4'>
        <button onClick={handleLogout} className="px-2 btn-black">Logout</button>
      </div>
      {children}
      <div style={{ height: "100px" }} />
      <Navbar />
    </div>
  );
}

export default Layout;