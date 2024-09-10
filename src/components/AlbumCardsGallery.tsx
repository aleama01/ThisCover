import React, { useContext, useEffect, useRef, useState } from 'react'
import { URL } from 'url'
import { AuthContext } from '../AuthContext'
import { IAlbum, ISchedule } from '../interfaces'
import AlbumCard from './AlbumCard'

const AlbumCardsGallery = ({ schedules }: { schedules: Array<ISchedule> }) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const { setOpenScheduleModal } = useContext(AuthContext)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle scroll event
  const handleScroll = () => {
    if (!galleryRef.current) return;

    const scrollPosition = galleryRef.current.scrollLeft;
    const itemWidth = galleryRef.current.scrollWidth;
    const index = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(index);
  };

  // Set up scroll listener
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    gallery.addEventListener('scroll', handleScroll);
    return () => {
      gallery.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className='album-cards-gallery' ref={galleryRef}>
        {schedules.length > 0 ?
          schedules.map((schedule, index) => (
            <div className="album-card-container" key={index}>
              <AlbumCard album={schedule.album} friendId={schedule.friend_id} userId={schedule.user_id} deadline={schedule.deadline} is_active={schedule.is_active} />
            </div>
          ))
          :
          <div className='album-card py-4'>
            <div className='empty-album-img d-flex flex-row justify-content-center align-items-center'>
              <p className='my-auto mx-auto fs-12 text-center px-2' style={{ color: "#6D6D6D" }}>You have no albums to review!<br /> You can add one from a friend's page or from below</p>
            </div>
            <button type='button' className='btn-black fs-14 w-100 mt-4 px-3 ' onClick={() => setOpenScheduleModal(true)}>Add album to review</button>
          </div>
        }
      </div>
      <div className="dots-container">
        {schedules.length > 0 && schedules.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </>
  )
}

export default AlbumCardsGallery