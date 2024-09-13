import axios from 'axios';
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext';
import FriendCard from '../components/FriendCard';
import Layout from '../components/Layout'
import Loading from '../components/Loading';
import SearchbarUsers from '../components/SearchbarUsers';
import { IUser } from '../interfaces';
import { getSearchResults } from '../lib/spotify-get-token';

const Friends = () => {
  const { isId, reload, setReload } = useContext(AuthContext)
  const [friends, setFriends] = useState<Array<IUser>>([])
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    const fetchFriends = async () => {
      if (!isId) return
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/friends/${isId}`);
        if (response.data) {
          let friends_tmp = new Array<IUser>();
          for (let el of response.data) {
            friends_tmp.push({
              id: el.id,
              username: el.username,
              image_url: el.image_url || "https://res.cloudinary.com/dcfsv0xbp/image/upload/v1725527932/profile-user-icon-isolated-on-white-background-eps10-free-vector_clcz86.jpg"
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
  }, [isId, reload]);


  return (
    <Layout>
      <h1 className='text-center my-4'>Friends </h1>
      <div className='d-flex flex-column overflow-hidden w-100 mx-auto max-w-600'>
        <SearchbarUsers id={isId!} friends={friends.map(f => f.id)} />
        {loading ?
          <div className='position-absolute absolute-center'><Loading /></div> :
          <Suspense fallback={<div className='position-absolute absolute-center'><Loading /></div>}>
            <h4 className='fw-16 my-2' style={{ paddingLeft: "25px" }}>Your friends</h4>
            {friends.map((friend, index) => {
              return (
                <FriendCard key={index} friend={friend} is_friend={true} />
              )
            })}
          </Suspense>
        }
      </div>
    </Layout>
  )
}

export default Friends