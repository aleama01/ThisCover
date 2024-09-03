import React from 'react'
import AlbumCardsGallery from './AlbumCardsGallery'
import Layout from './Layout'
import Navbar from './Navbar'

const Homepage = () => {
  return (
    <Layout>
      <h1 className='text-center my-4'>
        ThisCover
      </h1>
      <div className='my-auto'>
        <AlbumCardsGallery />
      </div>
    </Layout>
  )
}

export default Homepage