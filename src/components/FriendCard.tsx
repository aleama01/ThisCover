import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IUser } from '../interfaces';

const FriendCard = ({ friend }: { friend: IUser }) => {
  const navigate = useNavigate();

  return (
    <div className='friend-card'>
      <div className='col-2'>
        <img src={friend.image_url} width={45} height={45} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
      </div>
      <div className='d-flex flex-column justify-start col-9'>
        <div className='fw-300 fs-16'>
          {friend.username}
        </div>
      </div>
      <div className='col-1 mx-auto my-auto'>
        <svg width="16" height="23" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.849375L16.6707 13.5L0.5 26.1214L1.19637 27L18.5 13.5L1.18513 0L0.5 0.849375Z" fill="#F1F1F1" />
        </svg>
      </div>
    </div>
  )
}

export default FriendCard