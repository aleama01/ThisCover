import React, { Suspense, useContext, useEffect, useState } from 'react'
import AlbumCardsGallery from './AlbumCardsGallery'
import Layout from './Layout'
import axios from 'axios'
import { IAlbum, ISchedule } from '../interfaces'
import { getAlbums, getOneAlbum } from '../lib/spotify-get-token'
import Loading from './Loading'
import { AuthContext } from '../AuthContext'

const Homepage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Array<ISchedule>>();
  const { isId } = useContext(AuthContext)

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
              friend_id: el.selected_id,
              user_id: el.user_id,
              is_active: el.is_active
            })
          }

          setSchedules(schedules_tmp);
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
  }, [isId]);

  return (
    <Layout>
      <h1 className='text-center my-4'>
        ThisCover
      </h1>
      <div className='my-auto mx-auto'>
        {loading ? <Loading /> :
          schedules ?
            <AlbumCardsGallery schedules={schedules} />
            :
            <div className='album-card py-4'>
              <div className='empty-album-img d-flex flex-row justify-content-center align-items-center'>
                <p className='my-auto mx-auto fs-12 text-center px-2' style={{ color: "#6D6D6D" }}>You have no albums to review!<br /> You can add one from a friend's page or from below</p>
              </div>
              <button type='button' className='btn-black fs-14 w-100 mt-4 px-3 '>Add album to review</button>
            </div>
        }
      </div>
    </Layout>
  )
}

export default Homepage
