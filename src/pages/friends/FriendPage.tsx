import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from '../../components/Layout';
import { IRating, ISchedule, IUser } from '../../interfaces';
import { getOneAlbum } from '../../lib/spotify-get-token';
import { AuthContext } from '../../AuthContext';
import AlbumCard from '../../components/AlbumCard';
import Loading from '../../components/Loading';
import AlbumHistoryCard from '../../components/AlbumHistoryCard';

const CurrentSection = ({ friend_username, schedules }: { friend_username: string, schedules: Array<ISchedule> }) => {
  const { setOpenScheduleModal } = useContext(AuthContext)
  return (
    <div className='mt-1 mb-4'>
      {schedules.length > 0 ?
        <AlbumCard album={schedules[0].album} friendId={schedules[0].friend_id} userId={schedules[0].user_id} deadline={schedules[0].deadline} is_active={schedules[0].is_active} />
        :
        <>
          <h4 className='fs-16 fw-500 mt-1 mb-3' style={{ paddingLeft: "25px" }}>Current album</h4>
          <div className='album-card py-4 my-2 mx-auto'>
            <div className='empty-album-img d-flex flex-row justify-content-center align-items-center'>
              <p className='my-auto mx-auto fs-12 text-center px-2' style={{ color: "#6D6D6D" }}>You have no albums to review!</p>
            </div>
            <button type='button' className='btn-black fs-14 w-100 mt-4 px-3 ' onClick={() => setOpenScheduleModal(true)}>Add album to review</button>
          </div>
        </>
      }

    </div>
  )
}

const ArchiveSection = ({ friend, schedules }: { friend: IUser, schedules: Array<ISchedule> }) => {
  const [albumRatings, setAlbumRatings] = useState([{ id: "", rating: -1 }]);

  useEffect(() => {
    const fetchAlbumRating = async () => {
      if (!schedules) return
      try {
        const albumRatings_tmp = [];
        for (let schedule of schedules) {
          const userId = friend.id;
          const albumId = schedule.album.id;
          const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/ratings/${userId}/${albumId}`);

          if (response.data) {
            const ratingForSongZero = response.data.find((r: IRating) => r.song_id === '0');
            albumRatings_tmp.push({
              id: albumId,
              rating: ratingForSongZero.rating
            })
          }
        }
        setAlbumRatings(albumRatings_tmp)
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }


    }

    fetchAlbumRating()

  }, [])
  return (
    <div className='mt-1 mb-4'>
      <h4 className='fs-16 fw-500 mt-1 mb-3' style={{ paddingLeft: "25px" }}>History</h4>
      {schedules && schedules.filter(s => !s.is_active).length > 0 ?
        schedules.filter(s => !s.is_active).map((schedule, index) => {
          return (
            <AlbumHistoryCard album={schedule.album} deadline={schedule.deadline} rating={albumRatings!.filter(r => r.id === schedule.album.id).length > 0 ? albumRatings?.filter(r => r.id === schedule.album.id)[0].rating : -1} friendId={friend.id} key={index} />
          )
        })
        :
        <p className='my-auto mx-auto fs-12 text-center px-2 my-4' style={{ color: "#6D6D6D" }}>You did not review any album yet!</p>
      }

    </div>
  )
}


const FriendPage = () => {
  const { isId, setOpenScheduleModal } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const [friend, setFriend] = useState<IUser>();
  const [profileSec, setProfileSec] = useState<string>("current");
  const { friend_username, friend_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const userId = friend_id
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/user/${userId}`);
        setFriend(response.data)
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchFriend();
  }, []);

  useEffect(() => {
    const fetchSharedSchedules = async () => {
      try {
        if (!isId) return;
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedules/${isId}/${friend_id}`);
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


    fetchSharedSchedules();
    setTimeout(() => setLoading(false), 600)
  }, [isId]);

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Layout>
      <div className='position-absolute top-0 start-0 mx-3 my-4'>
        <button onClick={handleGoBack} className="px-2 fs-12" style={{ rotate: "180deg", backgroundColor: "transparent", border: "none" }}>
          <svg width="16" height="23" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.849375L16.6707 13.5L0.5 26.1214L1.19637 27L18.5 13.5L1.18513 0L0.5 0.849375Z" fill="#F1F1F1" />
          </svg>
        </button>
      </div>

      <div className='text-center' style={{ marginTop: "7dvh" }}>
        <img src={friend?.image_url} width={80} height={80} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
        <h3 className='fs-14 fw-400 my-2'>{friend_username}</h3>
      </div>

      <div className='profile-sec-switch mx-auto fs-12 fw-400 my-2'>
        <div className={`col-6 duration-300 profile-sec-el ${profileSec == "current" && "profile-sec-el-active"}`} onClick={() => setProfileSec("current")}>Current</div>
        <div className={`col-6 duration-300 profile-sec-el ${profileSec == "archive" && "profile-sec-el-active"}`} onClick={() => setProfileSec("archive")}>Archive</div>
      </div>

      {loading ? <Loading /> :
        profileSec == "current" ?
          <CurrentSection friend_username={friend_username!} schedules={schedules.filter(s => s.is_active)} />
          : profileSec == "archive" && <ArchiveSection friend={friend!} schedules={schedules.filter(s => !s.is_active)} />}

    </Layout>
  )
}

export default FriendPage