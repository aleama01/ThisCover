import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { text } from 'stream/consumers'
import { AuthContext } from '../../AuthContext';
import Layout from '../../components/Layout'
import { IAlbum, IRating, ISong, IUser } from '../../interfaces';
import { getAlbumSongs, getOneAlbum } from '../../lib/spotify-get-token';

const ModalSaveRatings = ({ closeModal }: { closeModal: Function }) => {
  return (
    <div className='modal-rating'>
      <div className='p-4 modal-rating-div position-relative'>
        <svg className="position-absolute top-0 end-0 m-2" onClick={() => closeModal(false)} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.2071L21.4104 6.29542C21.5869 6.119 21.8201 6.03079 22.0521 6.03079C22.5402 6.03079 22.9583 6.42229 22.9583 6.93583C22.9583 7.16904 22.8701 7.40104 22.6937 7.57867L15.782 14.4891L22.6925 21.3996C22.8701 21.5772 22.9583 21.8092 22.9583 22.0412C22.9583 22.5572 22.5366 22.9475 22.0521 22.9475C21.8201 22.9475 21.5869 22.8593 21.4104 22.6828L14.5 15.7724L7.58953 22.6828C7.41311 22.8593 7.17991 22.9475 6.94791 22.9475C6.46336 22.9475 6.04166 22.5572 6.04166 22.0412C6.04166 21.8092 6.12986 21.5772 6.30749 21.3996L13.2179 14.4891L6.30628 7.57867C6.12986 7.40104 6.04166 7.16904 6.04166 6.93583C6.04166 6.42229 6.45974 6.03079 6.94791 6.03079C7.17991 6.03079 7.41311 6.119 7.58953 6.29542L14.5 13.2071Z" fill="#F1F1F1" />
        </svg>

        <svg className="my-3" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.995 0.0125122C38.7875 0.0125122 49.9875 11.2125 49.9875 25.005C49.9875 38.8 38.7875 50 24.995 50C11.2 50 0 38.8 0 25.005C0 11.2125 11.2 0.0125122 24.995 0.0125122ZM24.995 3.76251C13.27 3.76251 3.75 13.28 3.75 25.005C3.75 36.73 13.27 46.25 24.995 46.25C36.72 46.25 46.2375 36.73 46.2375 25.005C46.2375 13.28 36.72 3.76251 24.995 3.76251ZM12.3725 25.9775L22 34.5525C22.355 34.8725 22.8025 35.0275 23.2475 35.0275C23.7525 35.0275 24.26 34.825 24.6275 34.4225L39.51 18.15C39.8375 17.7925 40 17.3425 40 16.895C40 15.87 39.1725 15.0275 38.13 15.0275C37.62 15.0275 37.1175 15.2325 36.745 15.635L23.1125 30.54L14.8675 23.195C14.5075 22.8775 14.065 22.72 13.62 22.72C12.5825 22.72 11.75 23.5575 11.75 24.585C11.75 25.0975 11.96 25.6075 12.3725 25.9775Z" fill="#F1F1F1" />
        </svg>

        <div>
          Ratings saved successfully!
        </div>
      </div>
    </div>
  )
}

const Tracklist = ({ onRatingChange, yourRatings, friendRatings, songs, is_active }: { onRatingChange: Function, yourRatings: Array<IRating>, friendRatings: Array<IRating>, songs: Array<ISong>, is_active: string }) => {
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
                  {is_active === "true" ?
                    <select
                      className="song-rating-input"
                      disabled={is_active === "true" ? false : true}
                      value={yourRatings.find((r) => r.song_id == song.id)?.rating}
                      onChange={(e) => onRatingChange(song.id, parseFloat(e.target.value))}
                    >
                      {[...Array(21).keys()].map(i => (
                        <option key={i} value={i / 2}>
                          {i / 2}
                        </option>
                      ))}
                    </select> :
                    yourRatings.find((r) => r.song_id == song.id) ? yourRatings.find((r) => r.song_id == song.id)!.rating : 0
                  }
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
  const [comment, setComment] = useState('');
  const [friendComment, setFriendComment] = useState('');
  const [albumRating, setAlbumRating] = useState(0);
  const [friendAlbumRating, setFriendAlbumRating] = useState(0);
  const [openModalRatings, setOpenModalRatings] = useState(false);
  const [user, setUser] = useState<IUser>()
  const [friend, setFriend] = useState<IUser>()
  const { id, friend_id, album_id, is_active } = useParams();
  const navigate = useNavigate()

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
    fetchAlbumData();
  }, [isId]);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/users/${friend_id}`);
        setFriend(response.data)
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/users/${isId}`);
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchUser();
    fetchFriend();
  }, [isId]);

  useEffect(() => {
    const fetchYourRatings = async () => {
      if (!isId || !album_id) return
      try {
        const userId = isId;
        const albumId = album_id;
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/ratings/${userId}/${albumId}`);
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
          const ratingForSongZero = ratings_tmp.find((r: IRating) => r.song_id === '0');
          setComment(ratingForSongZero?.comment || '');
          setAlbumRating(ratingForSongZero?.rating || -1)
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
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/ratings/${userId}/${albumId}`);
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
          const ratingForSongZero = ratings_tmp.find((r: IRating) => r.song_id === '0');
          setFriendComment(ratingForSongZero?.comment || '');
          setFriendAlbumRating(ratingForSongZero?.rating || -1)
          setFriendRatingsData(ratings_tmp);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }


    }

    fetchYourRatings()
    fetchFriendRatings()
  }, [reload])

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    let updatedRatings = new Array<IRating>;
    if (ratingsData.filter(r => r.song_id === "0").length == 0) {
      let rating: IRating = {
        user_id: parseInt(isId),
        song_id: "0",
        album_id: albumData!.id,
        rating: albumRating,
        comment: comment
      }
      updatedRatings.push(rating)
    } else {
      updatedRatings = ratingsData.map(r => (r.song_id === "0" ? { ...r, comment: comment } : r));
    }

    setRatingsData(updatedRatings);
  };

  const handleRatingChange = (songId: string, newRating: number) => {
    // Create a copy of the existing ratings
    let updatedRatings = [...ratingsData];

    // Find the index of the rating that matches the songId
    const ratingIndex = updatedRatings.findIndex(r => r.song_id === songId);

    if (ratingIndex === -1) {
      // If the rating for the song doesn't exist, create a new rating object
      const newRatingObj: IRating = {
        user_id: parseInt(isId),
        song_id: songId,
        album_id: albumData!.id,
        rating: newRating,
        comment: songId === "0" ? comment : ""
      };

      // Add the new rating to the updated ratings array
      updatedRatings.push(newRatingObj);
    } else {
      // Update the existing rating with the new rating value
      updatedRatings[ratingIndex] = { ...updatedRatings[ratingIndex], rating: newRating };
    }

    // Update the state with the new ratings array
    setRatingsData(updatedRatings);
  };

  const handleSave = async () => {
    const userId = isId;

    try {
      // Loop through each rating and send it to the server
      for (const rating of ratingsData) {
        // Set the comment value if the songId is "0"
        if (rating.song_id === '0') {
          rating.comment = comment;
        }

        // Make a POST request to save the rating
        await axios.post(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/ratings`, {
          userId,
          albumId: rating.album_id,
          songId: rating.song_id,
          rating: rating.rating,
          comment: rating.comment // Use the rating.comment value here
        });
      }
    } catch (error) {
      console.error('Error saving ratings:', error);
    }

    // Update reload state and open the modal
    setReload(!reload);
    setOpenModalRatings(true);
    setTimeout(() => setOpenModalRatings(false), 3500);
  };


  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Layout>
      {openModalRatings ? <ModalSaveRatings closeModal={setOpenModalRatings} /> : <></>}
      <div className='position-absolute top-0 start-0 mx-3 my-4'>
        <button onClick={handleGoBack} className="px-2 fs-12" style={{ rotate: "180deg", backgroundColor: "transparent", border: "none" }}>
          <svg width="16" height="23" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.849375L16.6707 13.5L0.5 26.1214L1.19637 27L18.5 13.5L1.18513 0L0.5 0.849375Z" fill="#F1F1F1" />
          </svg>
        </button>
      </div>

      <div className='d-flex flex-row justify-content-start' style={{ marginTop: "10dvh", padding: "0 25px" }}>
        <img src={albumData?.image} width={160} height={160} className="object-fit-cover" style={{ backgroundColor: "#6d6d6d", borderRadius: "24px", objectFit: "cover" }}></img>
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
        {is_active === "true" ?
          <>
            <h4 className='fs-16 fw-500 mt-3 mb-3'>Your review of the album</h4>
            <div className='d-flex'>
              <div className='col-3 d-flex flex-column justify-content-start align-items-center'>
                <div className='rating-number mb-1'>
                  <select
                    className="album-rating-input"
                    value={ratingsData.find((r) => r.song_id === "0")?.rating}
                    onChange={(e) => handleRatingChange("0", parseFloat(e.target.value))}
                  >
                    {[...Array(21).keys()].map(i => (
                      <option key={i} value={i / 2}>
                        {i / 2}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='fs-10 text-gray'>
                  Tap to change
                </div>
              </div>
              <textarea className='col-9 comment-input' placeholder='Add your comment...' value={comment}
                onChange={handleCommentChange}>
                {comment ? comment : ""}
              </textarea>
            </div>
          </>
          :
          <>
            <h4 className='fs-16 fw-500 mt-3 mb-3'>Reviews of the album</h4>
            <div className='d-flex'>

              <div className='d-flex flex-column col-6 pe-1' style={{ borderRight: "1px solid #ababab" }}>
                <div className='d-flex justify-content-between'>
                  <img src={user?.image_url} width={40} height={40} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
                  <div className='fs-12'><span className='fs-24'>{albumRating === -1 ? "-" : albumRating}</span>/10</div>
                </div>
                <div className='p-1 fs-12 text-end'>
                  {comment === "" ? <span className='text-gray'>No comment left</span> : comment}
                </div>
              </div>

              <div className='d-flex flex-column col-6 ps-1'>
                <div className='d-flex justify-content-between'>
                  <div className='fs-12'><span className='fs-24'>{friendAlbumRating === -1 ? "-" : friendAlbumRating}</span>/10</div>
                  <img src={friend?.image_url} width={40} height={40} className="user-pic" crossOrigin="anonymous" alt="Profile Image" />
                </div>
                <div className='p-1 fs-12 text-start'>
                  {friendComment === "" ? <span className='text-gray'>No comment left</span> : friendComment}
                </div>
              </div>
            </div>
          </>
        }
      </div>

      <Tracklist onRatingChange={handleRatingChange} yourRatings={ratingsData} friendRatings={friendRatingsData} songs={songsData} is_active={is_active!} />

      <div className='w-100 d-flex flex-column fs-18 mb-4 mt-3' style={{ padding: "0 25px" }}>
        <button type='button' className='btn-accent w-100 fw-300 py-2 position-relative' onClick={handleSave} style={{ display: is_active === "true" ? "block" : "none" }}>
          <svg className='position-absolute start-5' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20.25C19 19.848 18.644 19.5 18.25 19.5C15.689 19.5 6.311 19.5 3.75 19.5C3.356 19.5 3 19.848 3 20.25C3 20.652 3.356 21 3.75 21H18.25C18.644 21 19 20.652 19 20.25ZM6.977 13.167C5.643 17.083 5.497 17.399 5.497 17.754C5.497 18.281 5.957 18.503 6.246 18.503C6.598 18.503 6.914 18.366 10.82 17.01L6.977 13.167ZM8.037 12.106L11.883 15.952L20.707 7.138C20.902 6.943 21 6.687 21 6.431C21 6.176 20.902 5.92 20.707 5.725C20.015 5.034 18.965 3.984 18.272 3.293C18.077 3.098 17.821 3 17.565 3C17.311 3 17.055 3.098 16.859 3.293L8.037 12.106Z" fill="#F1F1F1" />
          </svg>
          Save your ratings
        </button>


        <a target="_blank" rel="noopener noreferrer" className='w-100' href={albumData?.url}>
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