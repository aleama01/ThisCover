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
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
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
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
    setTimeout(() => setLoading(false), 600)
  }, [isId]);

  return (
    <Layout>
      <h1 className='text-center my-4'>
        ThisCover
      </h1>
      <div className='my-auto mx-auto'>
        {loading ? <Loading /> :
          <Suspense fallback={<Loading />}>
            <AlbumCardsGallery schedules={schedules} />
          </Suspense>
        }
      </div>
    </Layout>
  )
}

export default Homepage
