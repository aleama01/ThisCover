import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AddScheduleModal from './AddScheduleModal';
import Navbar from './Navbar';

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const { logout, openScheduleModal } = useContext(AuthContext);


  return (
    <div className='dark-theme layout'>
      {openScheduleModal ? <AddScheduleModal /> : <></>}
      {children}
      <div style={{ height: "100px" }} />
      <Navbar />
    </div>
  );
}

export default Layout;