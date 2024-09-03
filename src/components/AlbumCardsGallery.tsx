import React, { useEffect, useRef, useState } from 'react'
import { URL } from 'url'
import { IAlbum } from '../interfaces'
import AlbumCard from './AlbumCard'

const AlbumCardsGallery = ({ schedule }: { schedule: Array<any> }) => {
  const album: IAlbum = {
    title: "Lorem Ipsum",
    author: "Frank Sinatra",
    image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600",
    tags: ["Neapolitan", "Black music", "Reggaeton"],
    time_left: new Date("2024-12-31T23:59:59"),
    user: {
      name: "Giorgia Graziaplena",
      image: "https://hackspirit.com/wp-content/uploads/2021/06/Copy-of-Rustic-Female-Teen-Magazine-Cover.jpg",
    }
  }

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const albums = [album, album, album]; // Sample data, replace with your actual albums

  // Function to handle scroll event
  const handleScroll = () => {
    if (!galleryRef.current) return;

    const scrollPosition = galleryRef.current.scrollLeft;
    const itemWidth = galleryRef.current.scrollWidth / albums.length;
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
        {albums.map((album, index) => (
          <div className="album-card-container" key={index}>
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
      <div className="dots-container">
        {albums.map((_, index) => (
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