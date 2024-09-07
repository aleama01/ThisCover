import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { timeLeft } from '../functions'
import { IAlbum, IUser } from '../interfaces'

const AlbumCard = ({ album, friendId, deadline }: { album: IAlbum, friendId: number, deadline: Date }) => {
  const [friendUsername, setFriendUsername] = useState<string>()
  const { isId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriend = async (id: number) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`);
        setFriendUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchFriend(friendId);
  }, []);

  const handleClick = () => {
    navigate(`/rating/${isId}/${friendId}/${album.id}`)
  }

  return (
    <div className='album-card m-auto lh-1 '>

      <div className='d-flex w-100 align-items-center fs-14 pt-2 fw-200'>
        <div className='ms-2 fw-400'>{friendUsername}</div>
        <div className='justify-self-end ms-auto text-gray'>{timeLeft(deadline)}</div>
      </div>



      <div className='album-card-image my-3 position-relative'>
        {/**
        <a target="_blank" rel="noopener noreferrer" className='position-absolute top-0 end-0 p-2' href={album.url}>
          <svg width="30" height="30" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.915 8.93686C12.6917 7.02562 7.375 6.85005 4.2975 7.78279C3.80333 7.93256 3.28083 7.65382 3.13167 7.16041C2.98167 6.667 3.26 6.14529 3.755 5.99552C7.2875 4.92466 13.1592 5.13184 16.87 7.33098C17.3142 7.59475 17.46 8.1672 17.1967 8.61069C16.9333 9.05418 16.3592 9.20062 15.915 8.93686ZM15.81 11.7684C15.5833 12.1345 15.1042 12.2493 14.7375 12.0246C12.05 10.3755 7.9525 9.89706 4.7725 10.8606C4.36083 10.9854 3.925 10.7533 3.8 10.3422C3.67583 9.93034 3.90833 9.49684 4.32 9.3712C7.95167 8.27121 12.4667 8.80373 15.5533 10.6983C15.92 10.923 16.035 11.4031 15.81 11.7684ZM14.5858 14.4867C14.4067 14.7813 14.0225 14.8736 13.7292 14.6939C11.3808 13.2611 8.425 12.9374 4.94417 13.7312C4.60917 13.8078 4.275 13.5981 4.19833 13.2636C4.12167 12.9283 4.33083 12.5946 4.66667 12.5181C8.47583 11.6486 11.7433 12.023 14.3792 13.6314C14.6733 13.8102 14.7658 14.1938 14.5858 14.4867ZM10 0.0853882C4.4775 0.0853882 0 4.55606 0 10.0701C0 15.585 4.4775 20.0549 10 20.0549C15.5233 20.0549 20 15.585 20 10.0701C20 4.55606 15.5233 0.0853882 10 0.0853882Z" fill="#F1F1F1" />
          </svg>
        </a>
      */}
        <img src={album.image} className="album-card-image" width={300} height={300} />
      </div>

      <h4 className='text-gray fs-14 fw-200 mb-0 mt-2'>Title</h4>
      <div className='fs-18 fw-500'>
        {album.title}
      </div>

      <h4 className='text-gray fs-14 fw-200 mb-0 mt-2'>Artist</h4>
      <div className='fs-18 fw-500'>
        {album.artists![0].name}
      </div>
      {/**
        * 
      <h4 className='text-gray fs-14 fw-200 mb-0 mt-2'>Tags</h4>
      <div className='fs-12 fw-500 d-flex flex-wrap'>
        {album.tags!.map((tag, index) => {
          return (
            <div className='album-tag' key={index}>
              {tag}
            </div>
          )
        })}
      </div>
            */}

      <div className='w-100 d-flex flex-column fs-18 mt-3'>

        <button type='button' className='btn-accent w-100 fw-300 py-2 position-relative' onClick={handleClick}>
          <svg className='position-absolute start-5' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20.25C19 19.848 18.644 19.5 18.25 19.5C15.689 19.5 6.311 19.5 3.75 19.5C3.356 19.5 3 19.848 3 20.25C3 20.652 3.356 21 3.75 21H18.25C18.644 21 19 20.652 19 20.25ZM6.977 13.167C5.643 17.083 5.497 17.399 5.497 17.754C5.497 18.281 5.957 18.503 6.246 18.503C6.598 18.503 6.914 18.366 10.82 17.01L6.977 13.167ZM8.037 12.106L11.883 15.952L20.707 7.138C20.902 6.943 21 6.687 21 6.431C21 6.176 20.902 5.92 20.707 5.725C20.015 5.034 18.965 3.984 18.272 3.293C18.077 3.098 17.821 3 17.565 3C17.311 3 17.055 3.098 16.859 3.293L8.037 12.106Z" fill="#F1F1F1" />
          </svg>
          Start Rating
        </button>


        <a target="_blank" rel="noopener noreferrer" className='w-100' href={album.url}>
          <button type='button' className='btn-black w-100 fw-300 py-2 mt-1 position-relative'>
            <svg width="24" height="24" viewBox="0 0 20 21" fill="none" className='position-absolute start-5' xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.915 8.93686C12.6917 7.02562 7.375 6.85005 4.2975 7.78279C3.80333 7.93256 3.28083 7.65382 3.13167 7.16041C2.98167 6.667 3.26 6.14529 3.755 5.99552C7.2875 4.92466 13.1592 5.13184 16.87 7.33098C17.3142 7.59475 17.46 8.1672 17.1967 8.61069C16.9333 9.05418 16.3592 9.20062 15.915 8.93686ZM15.81 11.7684C15.5833 12.1345 15.1042 12.2493 14.7375 12.0246C12.05 10.3755 7.9525 9.89706 4.7725 10.8606C4.36083 10.9854 3.925 10.7533 3.8 10.3422C3.67583 9.93034 3.90833 9.49684 4.32 9.3712C7.95167 8.27121 12.4667 8.80373 15.5533 10.6983C15.92 10.923 16.035 11.4031 15.81 11.7684ZM14.5858 14.4867C14.4067 14.7813 14.0225 14.8736 13.7292 14.6939C11.3808 13.2611 8.425 12.9374 4.94417 13.7312C4.60917 13.8078 4.275 13.5981 4.19833 13.2636C4.12167 12.9283 4.33083 12.5946 4.66667 12.5181C8.47583 11.6486 11.7433 12.023 14.3792 13.6314C14.6733 13.8102 14.7658 14.1938 14.5858 14.4867ZM10 0.0853882C4.4775 0.0853882 0 4.55606 0 10.0701C0 15.585 4.4775 20.0549 10 20.0549C15.5233 20.0549 20 15.585 20 10.0701C20 4.55606 15.5233 0.0853882 10 0.0853882Z" fill="#F1F1F1" />
            </svg>
            Listen on Spotify
          </button>
        </a>
      </div>


    </div>
  )
}

export default AlbumCard