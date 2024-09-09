import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AddScheduleModal from './AddScheduleModal';
import Navbar from './Navbar';

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const { logout, openScheduleModal } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className='dark-theme layout'>
      <div className='position-absolute top-0 end-0 mx-3 my-4'>
        <div onClick={handleLogout} className="px-2 text-gray mt-1 text-decoration-underline fs-12">Logout</div>
      </div>
      {openScheduleModal ? <AddScheduleModal /> : <></>}
      {children}
      <div style={{ height: "100px" }} />
      <Navbar />
    </div>
  );
}

export default Layout;