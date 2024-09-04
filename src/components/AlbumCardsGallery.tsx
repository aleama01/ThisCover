import React, { useEffect, useRef, useState } from 'react'
import { URL } from 'url'
import { IAlbum, ISchedule } from '../interfaces'
import AlbumCard from './AlbumCard'

const AlbumCardsGallery = ({ schedules }: { schedules: Array<ISchedule> }) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle scroll event
  const handleScroll = () => {
    if (!galleryRef.current) return;

    const scrollPosition = galleryRef.current.scrollLeft;
    const itemWidth = galleryRef.current.scrollWidth / schedules.length;
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
        {schedules && schedules.map((schedule, index) => (
          <div className="album-card-container" key={index}>
            <AlbumCard album={schedule.album} friendId={schedule.friend_id} deadline={schedule.deadline} />
          </div>
        ))}
      </div>
      <div className="dots-container">
        {schedules && schedules.map((_, index) => (
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