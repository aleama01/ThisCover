import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { timeLeft } from '../functions'
import { IAlbum, IUser } from '../interfaces'

const ModalRemoveAlbum = ({ closeModal, album, handleDelete }: { closeModal: Function, album: IAlbum, handleDelete: Function }) => {
  return (
    <div className='modal-rating'>
      <div className='p-4 modal-rating-div w-75 position-relative'>
        <svg className="position-absolute top-0 end-0 m-2" onClick={() => closeModal(false)} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.2071L21.4104 6.29542C21.5869 6.119 21.8201 6.03079 22.0521 6.03079C22.5402 6.03079 22.9583 6.42229 22.9583 6.93583C22.9583 7.16904 22.8701 7.40104 22.6937 7.57867L15.782 14.4891L22.6925 21.3996C22.8701 21.5772 22.9583 21.8092 22.9583 22.0412C22.9583 22.5572 22.5366 22.9475 22.0521 22.9475C21.8201 22.9475 21.5869 22.8593 21.4104 22.6828L14.5 15.7724L7.58953 22.6828C7.41311 22.8593 7.17991 22.9475 6.94791 22.9475C6.46336 22.9475 6.04166 22.5572 6.04166 22.0412C6.04166 21.8092 6.12986 21.5772 6.30749 21.3996L13.2179 14.4891L6.30628 7.57867C6.12986 7.40104 6.04166 7.16904 6.04166 6.93583C6.04166 6.42229 6.45974 6.03079 6.94791 6.03079C7.17991 6.03079 7.41311 6.119 7.58953 6.29542L14.5 13.2071Z" fill="#F1F1F1" />
        </svg>
        <div className='my-1'>
          Do you want to remove this album?
        </div>
        <div className='schedule-recap'>
          <img className="search-album-result-img" src={album.image} width={200} height={200}></img>
          <div className='col p-2 text-center'>
            <div className='fs-16 fw-400'>{album.title}</div>
            <div className='fs-14 fw-300 text-gray'>{album.artists![0].name}</div>
          </div>
        </div>

        <div className='d-flex flex-row'>
          <button className='btn-black w-100 p-2' onClick={() => closeModal(false)}>
            Back
          </button>
          <button className='btn-accent w-100 p-2' onClick={() => handleDelete}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

const AlbumCard = ({ album, friendId, userId, deadline, is_active }: { album: IAlbum, friendId: number, userId: number, deadline: Date, is_active: boolean }) => {
  const [friendUsername, setFriendUsername] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { isId, reload, setReload } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriend = async (id: number) => {
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/users/${id}`);
        setFriendUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchFriend(friendId);
  }, []);

  const handleClick = () => {
    navigate(`/rating/${isId}/${parseInt(isId) === friendId ? userId : friendId}/${album.id}/${is_active}`)
  }

  const handleDelete = () => {
    const deleteRow = async () => {
      if (!album || !friendId || !userId) return
      const albumId = album.id
      const response = await axios.delete(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedules/${userId}/${friendId}/${albumId}`);
      console.log("Deleted successfully")
      setReload(!reload)
    }
    deleteRow()
    setReload(!reload)
  }

  return (
    <div className='album-card m-auto lh-1 '>
      {openModal ? <ModalRemoveAlbum closeModal={setOpenModal} album={album} handleDelete={handleDelete} /> : <></>}
      <div className='d-flex w-100 align-items-center fs-14 pt-2 fw-200'>
        <div className='ms-2 fw-400'>{friendUsername}</div>
        <div className='justify-self-end ms-auto text-gray'>{timeLeft(deadline)}</div>
      </div>



      <div className='album-card-image my-3 position-relative'>

        <div className='position-absolute top-0 end-0 m-2' onClick={() => setOpenModal(true)}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#191919dd" stroke="#F1F1F1" />
            <path fillRule="evenodd" clipRule="evenodd" d="M13.9728 13.1381L18.4727 8.63743C18.5875 8.52256 18.7394 8.46512 18.8905 8.46512C19.2084 8.46512 19.4806 8.72005 19.4806 9.05445C19.4806 9.2063 19.4232 9.35737 19.3083 9.47304L14.8077 13.9729L19.3075 18.4727C19.4232 18.5884 19.4806 18.7394 19.4806 18.8905C19.4806 19.2265 19.206 19.4806 18.8905 19.4806C18.7394 19.4806 18.5875 19.4232 18.4727 19.3083L13.9728 14.8085L9.47301 19.3083C9.35813 19.4232 9.20627 19.4806 9.0552 19.4806C8.73969 19.4806 8.46509 19.2265 8.46509 18.8905C8.46509 18.7394 8.52253 18.5884 8.63819 18.4727L13.138 13.9729L8.6374 9.47304C8.52253 9.35737 8.46509 9.2063 8.46509 9.05445C8.46509 8.72005 8.73733 8.46512 9.0552 8.46512C9.20627 8.46512 9.35813 8.52256 9.47301 8.63743L13.9728 13.1381Z" fill="#F1F1F1" />
          </svg>

        </div>

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