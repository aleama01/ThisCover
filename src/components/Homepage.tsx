import React, { Suspense, useContext, useEffect, useState } from 'react'
import AlbumCardsGallery from './AlbumCardsGallery'
import Layout from './Layout'
import axios from 'axios'
import { IAlbum, ISchedule } from '../interfaces'
import { getAlbums, getOneAlbum } from '../lib/spotify-get-token'
import Loading from './Loading'
import { AuthContext } from '../AuthContext'
import { timeLeft } from '../functions'

const Homepage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Array<ISchedule>>();
  const { isId, setIsId, setReload, reload, setOpenScheduleModal } = useContext(AuthContext)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!isId) return;
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedules/${isId}`);
        if (response.data) {
          let schedules_tmp = new Array<ISchedule>
          for (let el of response.data) {
            const album: any = await getOneAlbum(el.album_id)
            if (timeLeft(el.deadline) === "-1" && el.is_active == true) {
              try {
                const res = await axios.put(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedules/${isId}/${album.id}`, { isActive: false })
                console.log("Updated state successfully");
              } catch (error) {
                console.error('Error changing to inactive:', error);
              }
              break
            } else if (timeLeft(el.deadline) != "-1") {
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
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
    //   setTimeout(() => setReload(!reload), 300)
  }, []);

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
              <button type='button' className='btn-black fs-14 w-100 mt-4 px-3 ' onClick={() => setOpenScheduleModal(true)}>Add album to review</button>
            </div>
        }
      </div>
    </Layout>
  )
}

export default Homepage
