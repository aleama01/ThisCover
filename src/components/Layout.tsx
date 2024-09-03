import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: any) => {
  return (
    <div className='dark-theme layout'>
      {children}
      <div style={{ height: "100px" }} />
      <Navbar />
    </div>
  );
}

export default Layout;