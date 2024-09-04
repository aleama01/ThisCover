import React, { Suspense, useContext, useEffect, useState } from 'react'
import AlbumCardsGallery from './AlbumCardsGallery'
import Layout from './Layout'
import axios from 'axios'
import Navbar from './Navbar'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import { IAlbum, ISchedule } from '../interfaces'
import { getAlbums, getOneAlbum } from '../lib/spotify-get-token'
import Loading from './Loading'

const Homepage = () => {
  const [isId, setIsId] = useState(sessionStorage.getItem('id'));
  const [isCheckingId, setIsCheckingId] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const [albums, setAlbums] = useState<Array<IAlbum>>([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    const user_id = sessionStorage.getItem('id')
    if (user_id) {
      setIsId(user_id)
    }
    setIsCheckingId(false)
  }, [])

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!isId) return;
        const response = await axios.get(`http://localhost:3000/api/schedules/${isId}`);
        if (response.data) {
          let schedules_tmp = new Array<ISchedule>
          for (let el of response.data) {
            const album: any = await getOneAlbum(el.album_id)
            schedules_tmp.push({
              album: {
                id: album.id,
                title: album.title,
                release_date: album.release_date,
                artists: album.artists,
                image: album.image,
                tags: album.tags,
                url: album.url
              },
              deadline: el.deadline,
              friend_id: el.friend_id,
              user_id: el.user_id
            })
          }

          setSchedules(schedules_tmp);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
    setLoading(false);
  }, [isId, isCheckingId]);

  return (
    <Layout>
      <h1 className='text-center my-4'>
        ThisCover
      </h1>
      <div className='position-absolute top-0 end-0 mx-3 my-4'>
        <button onClick={handleLogout} className="px-2 btn-black">Logout</button>
      </div>
      <div className='my-auto'>
        <Suspense fallback={<Loading />}>
          <AlbumCardsGallery schedules={schedules} />
        </Suspense>
      </div>
    </Layout>
  )
}

export default Homepage
