import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { IUser } from '../interfaces';

const Friends = () => {
  const [isId, setIsId] = useState(sessionStorage.getItem('id'));
  const [isCheckingId, setIsCheckingId] = useState<boolean>(true);
  const [friends, setFriends] = useState<Array<IUser>>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const user_id = sessionStorage.getItem('id')
    if (user_id) {
      setIsId(user_id)
    }
    setIsCheckingId(false)
  }, [])


  useEffect(() => {
    const fetchFriends = async () => {
      if (!isId) return
      try {
        const response = await axios.get(`http://localhost:3000/api/friends/${isId}`);
        if (response.data) {
          let friends_tmp = new Array<IUser>();
          for (let el of response.data) {
            friends_tmp.push({
              id: el.id,
              username: el.username,
              image_url: el.image_url
            })
          }

          setFriends(friends_tmp);
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchFriends();
  }, [isId]);

  console.log(friends)
  return (
    <Layout>
      <h1>Friends </h1>
      {friends.map((friend, index) => {
        return (
          <div key={index} className="">
            <img src={friend.image_url} width={200} height={200} className="" />
            <p>{friend.username}</p>
          </div>
        )
      })}
    </Layout>
  )
}

export default Friends