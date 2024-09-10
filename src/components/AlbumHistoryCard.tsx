import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import { getDate } from '../functions'
import { IAlbum, IRating } from '../interfaces'

const AlbumHistoryCard = ({ album, deadline, rating, friendId }: { album: IAlbum, deadline: Date, rating: number, friendId: number }) => {
  const [date, setDate] = useState({ day: 1, month: "Jan" });
  const { isId } = useContext(AuthContext);
  const navigate = useNavigate();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const adjustedTargetDate = new Date(deadline);
    adjustedTargetDate.setUTCHours(18, 0, 0, 0);
    const date_tmp = {
      day: adjustedTargetDate.getDate(),
      month: monthNames[adjustedTargetDate.getMonth()]
    }
    setDate(date_tmp)
  }, [])

  const handleClick = () => {
    navigate(`/rating/${isId}/${friendId}/${album.id}/${false}`)
  }

  return (
    <div className='album-history-card'>
      <div className='' style={{ width: "80px" }}>
        <img src={album.image} width={80} height={80} className="album-history-card-image" crossOrigin="anonymous" alt="Album cover" />
      </div>

      <div className='d-flex flex-column justify-start col-5 px-2'>
        <div className='fw-400 fs-14'>
          {album.title}
        </div>
        <div className='fw-300 fs-12 text-gray'>
          {album.artists![0].name}
        </div>
        <div className='fw-300 fs-10 text-gray'>
          {date.day} {date.month}
        </div>
      </div>

      <div className='mx-auto my-auto d-flex flex-row align-items-center justify-content-end gap-2 col'>
        <div className='fs-12'><span className='fs-20'>{rating === -1 ? "-" : rating}</span>/10</div>

        <svg width="35" height="35" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClick}>
          <path d="M29.995 5.01251C43.7875 5.01251 54.9875 16.2125 54.9875 30.005C54.9875 43.8 43.7875 55 29.995 55C16.2 55 5 43.8 5 30.005C5 16.2125 16.2 5.01251 29.995 5.01251ZM29.995 8.76251C18.27 8.76251 8.75 18.28 8.75 30.005C8.75 41.73 18.27 51.25 29.995 51.25C41.72 51.25 51.2375 41.73 51.2375 30.005C51.2375 18.28 41.72 8.76251 29.995 8.76251Z" fill="#F1F1F1" />
          <path d="M39.2222 40.9583C39.2222 40.4 38.7278 39.9167 38.1806 39.9167C34.6236 39.9167 21.5986 39.9167 18.0417 39.9167C17.4944 39.9167 17 40.4 17 40.9583C17 41.5167 17.4944 42 18.0417 42H38.1806C38.7278 42 39.2222 41.5167 39.2222 40.9583ZM22.5236 31.1208C20.6708 36.5597 20.4681 36.9986 20.4681 37.4917C20.4681 38.2236 21.1069 38.5319 21.5083 38.5319C21.9972 38.5319 22.4361 38.3417 27.8611 36.4583L22.5236 31.1208ZM23.9958 29.6472L29.3375 34.9889L41.5931 22.7472C41.8639 22.4764 42 22.1208 42 21.7653C42 21.4111 41.8639 21.0556 41.5931 20.7847C40.6319 19.825 39.1736 18.3667 38.2111 17.4069C37.9403 17.1361 37.5847 17 37.2292 17C36.8764 17 36.5208 17.1361 36.2486 17.4069L23.9958 29.6472Z" fill="#F1F1F1" />
        </svg>

      </div>

    </div>
  )
}

export default AlbumHistoryCard