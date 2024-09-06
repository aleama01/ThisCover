import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from '../../components/Layout';
import { ISchedule } from '../../interfaces';
import { getOneAlbum } from '../../lib/spotify-get-token';
import { AuthContext } from '../../AuthContext';


const FriendPage = () => {
  const { isId } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const [friendImg, setFriendImg] = useState<string>();
  const [profileSec, setProfileSec] = useState<string>("current");
  const { friend_username, friend_id } = useParams();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${friend_id}`);
        setFriendImg(response.data.image_url)
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
        const response = await axios.get(`http://localhost:3000/api/schedules/${isId}/${friend_id}`);
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


    fetchSharedSchedules();
    setTimeout(() => setLoading(false), 600)
  }, [isId]);

  return (
    <Layout>
      <div className='text-center' style={{ marginTop: "7dvh" }}>
        <img src={friendImg} width={80} height={80} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
        <h3 className='fs-14 fw-400 my-2'>{friend_username}</h3>
      </div>
      <div className='profile-sec-switch mx-auto fs-12 fw-400 my-3'>
        <div className={`col-6 duration-300 profile-sec-el ${profileSec == "current" && "profile-sec-el-active"}`} onClick={() => setProfileSec("current")}>Current</div>
        <div className={`col-6 duration-300 profile-sec-el ${profileSec == "archive" && "profile-sec-el-active"}`} onClick={() => setProfileSec("archive")}>Archive</div>
      </div>
    </Layout>
  )
}

export default FriendPage