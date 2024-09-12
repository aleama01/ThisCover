import axios from 'axios';
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AlbumHistoryCard from '../components/AlbumHistoryCard';
import Layout from '../components/Layout'
import Loading from '../components/Loading';
import { IRating, ISchedule, IUser } from '../interfaces';
import { getOneAlbum } from '../lib/spotify-get-token';

const Account = () => {
  const [userData, setUserData] = useState<IUser>({ username: "", image_url: "", id: 0 })
  const { isId, reload, logout } = useContext(AuthContext)
  const [albumRating, setAlbumRating] = useState<Array<any>>()
  const [schedules, setSchedules] = useState<Array<ISchedule>>()
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/users/${isId}`);
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
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedules/${isId}`);
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
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
  }, [isId, reload]);


  useEffect(() => {
    const fetchYourRatings = async () => {
      if (!isId) return
      try {
        const userId = isId;
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/ratingshistory/${userId}`);
        if (response.data) {
          let ratings_tmp = new Array<any>();
          for (let el of response.data) {
            ratings_tmp.push({
              album_id: el.album_id,
              rating: el.rating
            })
          }
          setAlbumRating(ratings_tmp)
        }
      } catch (error) {
        console.error('Error fetching your ratings:', error);
      }
    }

    fetchYourRatings()
  }, [reload])

  return (
    <Layout>
      <div className='position-absolute top-0 end-0 mx-3 my-4'>
        <div onClick={handleLogout} className="px-2 text-gray mt-1 text-decoration-underline fs-14">Logout</div>
      </div>

      <div className='text-center' style={{ marginTop: "7dvh" }}>
        <img src={userData.image_url} width={80} height={80} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
        <h3 className='fs-14 fw-400 my-2'>{userData.username}</h3>
      </div>

      <div className='mt-1 mb-4'>
        <h4 className='fs-16 fw-500 mt-1 mb-3' style={{ paddingLeft: "25px" }}>History</h4>
        {schedules && schedules.filter(s => !s.is_active).length > 0 ?
          schedules.filter(s => !s.is_active).map((schedule, index) => {
            return (
              <AlbumHistoryCard album={schedule.album} deadline={schedule.deadline} rating={albumRating!.filter(r => r.album_id === schedule.album.id).length > 0 ? albumRating?.filter(r => r.album_id === schedule.album.id)[0].rating : -1} friendId={schedule.friend_id} key={index} />
            )
          })
          :
          <p className='my-auto mx-auto fs-12 text-center px-2 my-4' style={{ color: "#6D6D6D" }}>You did not review any album yet!</p>
        }

      </div>
    </Layout>
  )
}

export default Account