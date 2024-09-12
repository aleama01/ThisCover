import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ISchedule, IUser } from '../interfaces';
import { getOneAlbum } from '../lib/spotify-get-token';

const FriendCard = ({ friend, is_friend }: { friend: IUser, is_friend: boolean }) => {
  const navigate = useNavigate();
  const { isId, setReload, reload } = useContext(AuthContext)

  const handleClick = () => {
    navigate(`/friends/${friend.username}/${friend.id}`)
  }

  const handleAddFriend = () => {
    const addFriend = async () => {
      try {
        if (!isId) return
        const friendId = friend.id;
        const userId = isId
        const response = await axios.post(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/friends`, { userId, friendId });
        setReload(!reload);
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    }
    addFriend()
  }

  return (
    <div className='friend-card' onClick={is_friend ? handleClick : () => { }}>
      <div className='col-2'>
        <img src={friend.image_url} width={45} height={45} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
      </div>
      <div className='d-flex flex-column justify-start col-8'>
        <div className='fw-300 fs-16'>
          {friend.username}
        </div>
      </div>
      {is_friend ?
        <div className='mx-auto my-auto'>
          <svg width="16" height="23" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.849375L16.6707 13.5L0.5 26.1214L1.19637 27L18.5 13.5L1.18513 0L0.5 0.849375Z" fill="#F1F1F1" />
          </svg>
        </div>
        :
        <button className="add-friend-btn" style={{ border: "1px solid white", borderRadius: "999px" }} onClick={handleAddFriend}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.0228 13.4932C17.388 14.7637 17.7383 15.9817 17.9632 16.77C17.988 16.8585 18 16.947 18 17.0325C18 17.424 17.76 17.7862 17.3775 17.9332L17.376 17.9347C16.923 18.1087 16.4115 17.925 16.1768 17.5012C15.6562 16.5615 14.7773 15.0232 14.3243 14.2335L14.6453 14.2455C15.5303 14.2455 16.35 13.9672 17.0228 13.4932ZM13.8615 17.9947H4.14675L3.9735 13.7302C3.9735 13.7302 2.54775 16.1265 1.82325 17.433C1.5885 17.8567 1.077 18.0405 0.624 17.8672L0.6225 17.865C0.24 17.718 0 17.3565 0 16.9642C0 16.8787 0.012 16.7902 0.03675 16.7025C0.513 15.03 1.56525 11.4885 2.115 9.55799C2.31975 8.83874 2.979 8.34374 3.7305 8.34374H10.917C10.659 8.88149 10.5142 9.48449 10.5142 10.1205C10.5142 12.1837 12.0345 13.8952 14.0167 14.1982L13.8615 17.9947ZM14.625 6.74999C16.488 6.74999 18 8.26199 18 10.125C18 11.988 16.488 13.5 14.625 13.5C12.762 13.5 11.25 11.988 11.25 10.125C11.25 8.26199 12.762 6.74999 14.625 6.74999ZM15 8.24999H14.25V9.74999H12.75V10.5H14.25V12H15V10.5H16.5V9.74999H15V8.24999ZM9.0045 0C11.0872 0 12.7778 1.68225 12.7778 3.75449C12.7778 5.82674 11.0872 7.50899 9.0045 7.50899C6.92175 7.50899 5.23125 5.82674 5.23125 3.75449C5.23125 1.68225 6.92175 0 9.0045 0Z" fill="#F1F1F1" />
          </svg>
        </button>
      }
    </div>
  )
}

export default FriendCard