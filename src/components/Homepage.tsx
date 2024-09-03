import React, { useContext, useEffect, useState } from 'react'
import AlbumCardsGallery from './AlbumCardsGallery'
import Layout from './Layout'
import axios from 'axios'
import Navbar from './Navbar'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const [isId, setIsId] = useState(sessionStorage.getItem('id'));
  const [isCheckingId, setIsCheckingId] = useState<boolean>(true);
  const [schedule, setSchedule] = useState([]);
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
    console.log(isId)
    setIsCheckingId(false)
  }, [])

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!isId) return;
        const response = await axios.get(`http://localhost:3000/api/schedules/${isId}`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedules();
  }, [isId]);

  console.log(schedule)
  return (
    <Layout>
      <h1 className='text-center my-4'>
        ThisCover
      </h1>
      <div className='position-absolute top-0 end-0 mx-3 my-4'>
        <button onClick={handleLogout} className="px-2 btn-black">Logout</button>
      </div>
      <div className='my-auto'>
        <AlbumCardsGallery schedule={schedule} />
      </div>
    </Layout>
  )
}

export default Homepage
