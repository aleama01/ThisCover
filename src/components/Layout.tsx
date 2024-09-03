import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: any) => {
  return (
    <div className='dark-theme'>
      {children}
      <Navbar />
    </div>
  );
}

export default Layout;