import axios from 'axios';
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext';
import Layout from '../components/Layout'
import Loading from '../components/Loading';
import { ISchedule, IUser } from '../interfaces';
import { getOneAlbum } from '../lib/spotify-get-token';

const Account = () => {
  const [userData, setUserData] = useState<IUser>({ username: "", image_url: "", id: 0 })
  const { isId } = useContext(AuthContext)
  const [schedules, setSchedules] = useState<Array<ISchedule>>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${isId}`);
        setUserData(response.data)
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchUserData();
  }, []);

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
      <div className='text-center' style={{ marginTop: "7dvh" }}>
        <img src={userData.image_url} width={80} height={80} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
        <h3 className='fs-14 fw-400 my-2'>{userData.username}</h3>
      </div>
    </Layout>
  )
}

export default Account