import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { text } from 'stream/consumers'
import { AuthContext } from '../../AuthContext';
import Layout from '../../components/Layout'
import { IAlbum, IRating, ISong } from '../../interfaces';
import { getAlbumSongs, getOneAlbum } from '../../lib/spotify-get-token';


const Tracklist = ({ onRatingChange, yourRatings, friendRatings, songs }: { onRatingChange: Function, yourRatings: Array<IRating>, friendRatings: Array<IRating>, songs: Array<ISong> }) => {
  return (
    <>
      <h4 className='fw-400 fs-14 my-3' style={{ padding: "0 25px" }}>Tracklist</h4>
      <div className='tracklist-box'>
        <div className='fs-12 fw-300 text-gray d-flex flex-row'>
          <div className='col-8'>Song name</div>
          <div className='col-2 text-center'>You</div>
          <div className='col-2 text-center'>Friend</div>
        </div>

        <div>

          {songs.map((song, index) => {
            return (
              <div className='fs-16 fw-300 d-flex flex-row my-3' key={index}>
                <div className='col-8'>{song.track_number}. {song.name}</div>
                <div className='col-2 text-center'>
                  <select
                    className="song-rating-input"
                    value={yourRatings.find((r) => r.song_id == song.id)?.rating}
                    onChange={(e) => onRatingChange(song.id, parseFloat(e.target.value))}
                  >
                    {[...Array(21).keys()].map(i => (
                      <option key={i} value={i / 2}>
                        {i / 2}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-2 mx-1 text-center'>
                  {friendRatings.find((r) => r.song_id == song.id) ? friendRatings.find((r) => r.song_id == song.id)!.rating : 0}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}

const RatingPage = () => {
  const { isId, reload, setReload } = useContext(AuthContext);
  const [albumData, setAlbumData] = useState<IAlbum>();
  const [songsData, setSongsData] = useState<Array<ISong>>([]);
  const [ratingsData, setRatingsData] = useState<Array<IRating>>([]);
  const [friendRatingsData, setFriendRatingsData] = useState<Array<IRating>>([]);
  const { id, friend_id, album_id } = useParams();

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        if (!isId) return;
        const response: any = await getOneAlbum(album_id)
        const year = new Date(response.release_date)

        const album_tmp = {
          id: response.id,
          title: response.title,
          release_date: year,
          artists: response.artists,
          image: response.image,
          tags: response.tags,
          url: response.url
        }

        setAlbumData(album_tmp);
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    fetchAlbumData();
  }, [isId]);

  useEffect(() => {
    const fetchAlbumSongs = async () => {
      try {
        if (!isId) return;
        const response: Array<ISong> = await getAlbumSongs(album_id)
        const songs_tmp = new Array<ISong>;
        for (let song of response) {
          const song_tmp = {
            name: song.name,
            id: song.id,
            link: song.link,
            track_number: song.track_number,
          }
          songs_tmp.push(song_tmp)
        }

        setSongsData(songs_tmp);
      } catch (error) {
        console.error('Error fetching album songs:', error);
      }
    };

    fetchAlbumSongs();
  }, [isId]);

  useEffect(() => {
    const fetchYourRatings = async () => {
      if (!isId || !album_id) return
      try {
        const userId = isId;
        const albumId = album_id;
        const response = await axios.get(`http://localhost:3000/api/ratings/${userId}/${albumId}`);
        if (response.data) {
          let ratings_tmp = new Array<IRating>();
          for (let el of response.data) {
            ratings_tmp.push({
              user_id: el.user_id,
              song_id: el.song_id,
              album_id: el.album_id,
              rating: el.rating,
              comment: el.comment
            })
          }

          setRatingsData(ratings_tmp);
        }
      } catch (error) {

        console.error('Error fetching your ratings:', error);
      }


    }
    const fetchFriendRatings = async () => {
      if (!friend_id || !album_id) return
      try {
        const userId = friend_id;
        const albumId = album_id;
        const response = await axios.get(`http://localhost:3000/api/ratings/${userId}/${albumId}`);
        if (response.data) {
          let ratings_tmp = new Array<IRating>();
          for (let el of response.data) {
            ratings_tmp.push({
              user_id: el.user_id,
              song_id: el.song_id,
              album_id: el.album_id,
              rating: el.rating,
              comment: el.comment
            })
          }

          setFriendRatingsData(ratings_tmp);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }


    }

    fetchYourRatings()
    fetchFriendRatings()
  }, [reload])


  const handleRatingChange = (songId: string, newRating: number) => {
    console.log(songId, newRating)
    let updatedRatings = new Array<IRating>;
    if (ratingsData.filter(r => r.song_id === songId).length == 0) {
      let rating: IRating = {
        user_id: parseInt(isId),
        song_id: songId,
        album_id: albumData!.id,
        rating: newRating,
      }
      updatedRatings.push(rating)
    } else {
      updatedRatings = ratingsData.map(r => (r.song_id === songId ? { ...r, rating: newRating } : r));
    }
    console.log(ratingsData, updatedRatings)
    setRatingsData(updatedRatings);
  };

  const handleSave = async () => {
    const userId = isId;

    try {
      console.log(ratingsData)
      for (const rating of ratingsData) {
        await axios.post('http://localhost:3000/api/ratings', {
          userId,
          albumId: rating.album_id,
          songId: rating.song_id,
          rating: rating.rating,
          comment: rating.comment || ""
        });
      }
      console.log("Inserted rating")
    } catch (error) {
      console.error('Error saving ratings:', error);
    }
    setReload(!reload)
  };

  return (
    <Layout>
      <div className='d-flex flex-row justify-content-start' style={{ marginTop: "10dvh", padding: "0 25px" }}>
        <img src={albumData?.image} width={160} height={160} className="object-fit-cover" style={{ backgroundColor: "#6d6d6d", borderRadius: "24px" }}></img>
        <div className='d-flex flex-column' style={{ paddingLeft: "1rem" }}>
          <div className='fw-300 fs-12 text-gray'>Title</div>
          <h4 className='fw-400 fs-14'>{albumData?.title}</h4>
          <div className='fw-300 fs-12 text-gray'>Artist</div>
          <h4 className='fw-400 fs-14'>{albumData?.artists![0].name}</h4>
          <div className='fw-300 fs-12 text-gray'>Release date</div>
          <h4 className='fw-400 fs-14'>{albumData?.release_date!.getFullYear()}</h4>
        </div>
      </div>

      <div style={{ padding: "0 25px" }}>
        <h4 className='fs-16 fw-500 mt-3 mb-3'>Your review of the album</h4>
        <div className='d-flex'>
          <div className='col-3 d-flex flex-column justify-content-start align-items-center'>
            <div className='rating-number mb-1'>
              9
            </div>
            <div className='fs-10 text-gray'>
              Tap to change
            </div>
          </div>
          <textarea className='col-9 comment-input' placeholder='Add your comment...'></textarea>
        </div>
      </div>

      <Tracklist onRatingChange={handleRatingChange} yourRatings={ratingsData} friendRatings={friendRatingsData} songs={songsData} />

      <div className='w-100 d-flex flex-column fs-18 mt-3' style={{ padding: "0 25px" }}>
        <button type='button' className='btn-accent w-100 fw-300 py-2 position-relative' onClick={handleSave}>
          <svg className='position-absolute start-5' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20.25C19 19.848 18.644 19.5 18.25 19.5C15.689 19.5 6.311 19.5 3.75 19.5C3.356 19.5 3 19.848 3 20.25C3 20.652 3.356 21 3.75 21H18.25C18.644 21 19 20.652 19 20.25ZM6.977 13.167C5.643 17.083 5.497 17.399 5.497 17.754C5.497 18.281 5.957 18.503 6.246 18.503C6.598 18.503 6.914 18.366 10.82 17.01L6.977 13.167ZM8.037 12.106L11.883 15.952L20.707 7.138C20.902 6.943 21 6.687 21 6.431C21 6.176 20.902 5.92 20.707 5.725C20.015 5.034 18.965 3.984 18.272 3.293C18.077 3.098 17.821 3 17.565 3C17.311 3 17.055 3.098 16.859 3.293L8.037 12.106Z" fill="#F1F1F1" />
          </svg>
          Save your ratings
        </button>


        <a target="_blank" rel="noopener noreferrer" className='w-100' href={""}>
          <button type='button' className='btn-black w-100 fw-300 py-2 mt-1 position-relative'>
            <svg width="24" height="24" viewBox="0 0 20 21" fill="none" className='position-absolute start-5' xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.915 8.93686C12.6917 7.02562 7.375 6.85005 4.2975 7.78279C3.80333 7.93256 3.28083 7.65382 3.13167 7.16041C2.98167 6.667 3.26 6.14529 3.755 5.99552C7.2875 4.92466 13.1592 5.13184 16.87 7.33098C17.3142 7.59475 17.46 8.1672 17.1967 8.61069C16.9333 9.05418 16.3592 9.20062 15.915 8.93686ZM15.81 11.7684C15.5833 12.1345 15.1042 12.2493 14.7375 12.0246C12.05 10.3755 7.9525 9.89706 4.7725 10.8606C4.36083 10.9854 3.925 10.7533 3.8 10.3422C3.67583 9.93034 3.90833 9.49684 4.32 9.3712C7.95167 8.27121 12.4667 8.80373 15.5533 10.6983C15.92 10.923 16.035 11.4031 15.81 11.7684ZM14.5858 14.4867C14.4067 14.7813 14.0225 14.8736 13.7292 14.6939C11.3808 13.2611 8.425 12.9374 4.94417 13.7312C4.60917 13.8078 4.275 13.5981 4.19833 13.2636C4.12167 12.9283 4.33083 12.5946 4.66667 12.5181C8.47583 11.6486 11.7433 12.023 14.3792 13.6314C14.6733 13.8102 14.7658 14.1938 14.5858 14.4867ZM10 0.0853882C4.4775 0.0853882 0 4.55606 0 10.0701C0 15.585 4.4775 20.0549 10 20.0549C15.5233 20.0549 20 15.585 20 10.0701C20 4.55606 15.5233 0.0853882 10 0.0853882Z" fill="#F1F1F1" />
            </svg>
            Listen on Spotify
          </button>
        </a>
      </div>
    </Layout>
  )
}

export default RatingPage