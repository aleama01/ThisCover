import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const Navbar = () => {
  const { currentRoute, setCurrentRoute } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentRoute(currentRoute)
  }, [])

  const handleClickFriends = () => {
    setCurrentRoute(0)
    navigate('/friends')
  }
  const handleClickHome = () => {
    setCurrentRoute(1)
    navigate('/')
  }
  const handleClickAccount = () => {
    setCurrentRoute(2)
    navigate('/account')
  }

  return (
    <nav className="navbar navbar-expand fixed-bottom">
      <div className='container-fluid'>
        <ul className="navbar-nav d-flex flex-row w-100 justify-content-around align-items-center">

          <li className="nav-item col" onClick={handleClickFriends}>
            <div className='w-100 d-flex flex-column align-items-center nav-link' style={{ color: currentRoute === 0 ? "#f1f1f1" : "#ababab" }}>
              <svg width="39" height="22" viewBox="0 0 39 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.2451 22H9.75325L9.75 20.8578C9.75 18.5497 9.9125 17.2168 12.3305 16.5862C15.067 15.873 17.7645 15.2368 16.4661 12.5363C12.6214 4.5375 15.3709 0 19.4984 0C23.5462 0 26.3656 4.36883 22.5306 12.5382C21.2713 15.2222 23.8729 15.8602 26.6663 16.588C29.0875 17.2187 29.2484 18.5533 29.2484 20.8652L29.2451 22ZM37.063 17.941C34.9668 17.3947 33.0168 16.9162 33.9609 14.9032C36.8355 8.77617 34.723 5.5 31.6859 5.5C29.6303 5.5 28.0329 6.99783 28.0329 9.76067C28.0329 16.9162 31.7184 13.0057 31.6826 22H38.9967L39 21.1512C39 19.4168 38.8797 18.414 37.063 17.941ZM0.00325 22H7.31737C7.28325 13.0057 10.9671 16.918 10.9671 9.76067C10.9671 6.99783 9.36975 5.5 7.31413 5.5C4.277 5.5 2.1645 8.77617 5.04075 14.9032C5.98488 16.918 4.03487 17.3947 1.93862 17.941C0.12025 18.414 0 19.4168 0 21.1512L0.00325 22Z" fill={currentRoute === 0 ? "#f1f1f1" : "#ababab"} />
              </svg>
              <p className="nav-link p-1">Friends</p>
            </div>
          </li>

          <li className="nav-item col" onClick={handleClickHome}>
            <div aria-current="page" className='active w-100 d-flex flex-column align-items-center nav-link' style={{ color: currentRoute === 1 ? "#f1f1f1" : "#ababab" }}>
              <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.0521 6.093L17.0443 3.093V1H20.0521V6.093ZM24.0625 12H21.0547V22H3.00781V12H0L12.0312 0L24.0625 12ZM14.0365 14H10.026V20H14.0365V14Z" fill={currentRoute === 1 ? "#f1f1f1" : "#ababab"} />
              </svg>
              <p className="nav-link p-1">Home</p>
            </div>
          </li>


          <li className="nav-item col" onClick={handleClickAccount}>
            <div className='d-flex flex-column align-items-center nav-link' style={{ color: currentRoute === 2 ? "#f1f1f1" : "#ababab" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8333 11C12.8333 12.0111 12.0111 12.8333 11 12.8333C9.98892 12.8333 9.16667 12.0111 9.16667 11C9.16667 9.98892 9.98892 9.16667 11 9.16667C12.0111 9.16667 12.8333 9.98892 12.8333 11ZM22 11C22 17.0748 17.0748 22 11 22C4.92525 22 0 17.0748 0 11C0 4.92525 4.92525 0 11 0C17.0748 0 22 4.92525 22 11ZM7.84667 15.5027C7.32233 15.1351 6.86583 14.6786 6.49825 14.1543L3.11483 15.6585C3.90225 16.9877 5.01325 18.0987 6.34242 18.8861L7.84667 15.5027ZM14.6667 11C14.6667 8.97508 13.0249 7.33333 11 7.33333C8.97508 7.33333 7.33333 8.97508 7.33333 11C7.33333 13.0249 8.97508 14.6667 11 14.6667C13.0249 14.6667 14.6667 13.0249 14.6667 11ZM18.8861 6.34333C18.0987 5.01325 16.9877 3.90225 15.6576 3.11483L14.1533 6.49825C14.6777 6.86583 15.1342 7.32233 15.5027 7.84667L18.8861 6.34333Z" fill={currentRoute === 2 ? "#f1f1f1" : "#ababab"} />
              </svg>
              <p className="nav-link p-1">
                Profile
              </p>
            </div>
          </li>
        </ul>
      </div>
    </nav >
  )
}

export default Navbar