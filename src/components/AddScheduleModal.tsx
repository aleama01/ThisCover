import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext';
import { IAlbum, IUser } from '../interfaces';
import { getSearchResults } from '../lib/spotify-get-token';

const Step0 = ({ step, setStep, album, setAlbum }: { step: number, setStep: Function, album: any, setAlbum: Function }) => {
  const [searchAlbum, setSearchAlbum] = useState("");
  const [searchResults, setSearchResults] = useState<Array<IAlbum>>([]);
  const { setOpenScheduleModal } = useContext(AuthContext)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchAlbum(value);

    if (value.trim() === "") {
      setSearchResults([]); // Clear results if input is empty
      return;
    }

    try {
      const res = await getSearchResults(value);
      setSearchResults(res.slice(0, 7));
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  const handleNext = () => {
    setStep(1)
  }
  const handleClose = () => {
    setAlbum();
    setOpenScheduleModal(false)
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='my-3'>Choose album</h3>
        <svg onClick={handleClose} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.2071L21.4104 6.29542C21.5869 6.119 21.8201 6.03079 22.0521 6.03079C22.5402 6.03079 22.9583 6.42229 22.9583 6.93583C22.9583 7.16904 22.8701 7.40104 22.6937 7.57867L15.782 14.4891L22.6925 21.3996C22.8701 21.5772 22.9583 21.8092 22.9583 22.0412C22.9583 22.5572 22.5366 22.9475 22.0521 22.9475C21.8201 22.9475 21.5869 22.8593 21.4104 22.6828L14.5 15.7724L7.58953 22.6828C7.41311 22.8593 7.17991 22.9475 6.94791 22.9475C6.46336 22.9475 6.04166 22.5572 6.04166 22.0412C6.04166 21.8092 6.12986 21.5772 6.30749 21.3996L13.2179 14.4891L6.30628 7.57867C6.12986 7.40104 6.04166 7.16904 6.04166 6.93583C6.04166 6.42229 6.45974 6.03079 6.94791 6.03079C7.17991 6.03079 7.41311 6.119 7.58953 6.29542L14.5 13.2071Z" fill="#F1F1F1" />
        </svg>
      </div>

      <input type="text" className='searchbar' placeholder="Search album.." style={{ zIndex: 10 }} value={searchAlbum} onChange={handleSearch}></input>
      <div className='search-album-results-gallery'>
        {searchResults.length > 0 && (
          searchResults.map((res, index) => (
            <div key={index}>
              <div className={res.id === album?.id ? "search-album-result result-selected" : "search-album-result"} onClick={() => setAlbum(res)}>
                <img className="search-album-result-img" src={res.image} width={80} height={80}></img>
                <div className='col px-2'>
                  <div className='fs-12 fw-400'>{res.title}</div>
                  <div className='fs-12 fw-300 text-gray'>{res.artists![0].name}</div>
                </div>
              </div>
              <hr className='text-gray w-75 mx-auto my-0' />
            </div>
          ))
        )}
      </div>



      <button className='btn-accent my-3' disabled={!album} onClick={handleNext}>Next</button>
    </>
  )
}

const Step1 = ({ step, setStep, album, friend, setFriend, friends }: { step: number, setStep: Function, album: any, friend: any, setFriend: Function, friends: Array<IUser> }) => {
  const { setOpenScheduleModal } = useContext(AuthContext)
  const [searchUser, setSearchUsers] = useState("");
  const [searchResultsUsers, setSearchResultsUsers] = useState<Array<IUser>>(friends);

  const handleBack = () => {
    setFriend();
    setStep(0)
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchUsers(value);

    if (value.trim() === "") {
      setSearchResultsUsers(friends); // Clear results if input is empty
      return;
    }

    // Filter allUsers based on the search value in usernames
    const filteredUsers = friends.filter((user) =>
      user.username.toLowerCase().includes(value)
    );

    // Set search results, limiting to the first 3 matches
    setSearchResultsUsers(filteredUsers.slice(0, 3));
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='my-3'>Choose friend</h3>
        <svg onClick={() => setOpenScheduleModal(false)} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.2071L21.4104 6.29542C21.5869 6.119 21.8201 6.03079 22.0521 6.03079C22.5402 6.03079 22.9583 6.42229 22.9583 6.93583C22.9583 7.16904 22.8701 7.40104 22.6937 7.57867L15.782 14.4891L22.6925 21.3996C22.8701 21.5772 22.9583 21.8092 22.9583 22.0412C22.9583 22.5572 22.5366 22.9475 22.0521 22.9475C21.8201 22.9475 21.5869 22.8593 21.4104 22.6828L14.5 15.7724L7.58953 22.6828C7.41311 22.8593 7.17991 22.9475 6.94791 22.9475C6.46336 22.9475 6.04166 22.5572 6.04166 22.0412C6.04166 21.8092 6.12986 21.5772 6.30749 21.3996L13.2179 14.4891L6.30628 7.57867C6.12986 7.40104 6.04166 7.16904 6.04166 6.93583C6.04166 6.42229 6.45974 6.03079 6.94791 6.03079C7.17991 6.03079 7.41311 6.119 7.58953 6.29542L14.5 13.2071Z" fill="#F1F1F1" />
        </svg>
      </div>

      <input type="text" className='searchbar' style={{ zIndex: 10 }} placeholder="Search for friends.." value={searchUser} onChange={handleSearch}>
      </input>

      <div className='search-friends-results-gallery'>
        {
          searchResultsUsers.length > 0 ? (
            searchResultsUsers
              .map((res, index) => (
                <div key={index}>
                  <div className={res.id === friend?.id ? "search-friend-result result-selected" : "search-friend-result"} onClick={() => setFriend(res)}>
                    <img className="search-friend-result-img" src={res.image_url} width={30} height={30}></img>
                    <div className='fs-12 fw-400'>{res.username}</div>
                  </div>
                  <hr className='text-gray w-75 mx-auto my-0' />
                </div>
              ))
          )
            :
            <p className='text-gray fs-14 my-4 mx-auto text-center'>User not found :c</p>
        }
      </div>
      <div className='recap-album'>
        <img className="search-album-result-img" src={album.image} width={80} height={80}></img>
        <div className='col px-2'>
          <div className='fs-12 fw-400'>{album.title}</div>
          <div className='fs-12 fw-300 text-gray'>{album.artists![0].name}</div>
        </div>
      </div>

      <div className='d-flex flex-row justify-content-between'>
        <button className='btn-black m-3 col' onClick={handleBack}>Back</button>
        <button className='btn-accent m-3 col' disabled={!friend} onClick={handleNext}>Next</button>
      </div>
    </>
  )
}

const Step2 = ({ step, setStep, album, friend, date, setDate }: { step: number, setStep: Function, album: any, friend: any, date: any, setDate: Function }) => {
  const { setOpenScheduleModal, isId, reload, setReload } = useContext(AuthContext)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getUTCDate();

  const generateYears = (start: any, end: any) => {
    const years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const endDate = new Date(currentYear, currentMonth + 12, currentDay);
  const years = generateYears(currentYear, endDate.getFullYear());

  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentMonth, currentYear));

  // Update the number of days in the selected month and year
  useEffect(() => {
    setDaysInMonth(getDaysInMonth(selectedMonth, selectedYear));
    // Adjust selected day if it exceeds the number of days in the month
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear, daysInMonth, selectedDay]);

  // Update the month options based on the selected year
  const availableMonths = () => {
    if (selectedYear === currentYear) {
      return months.slice(currentMonth);
    }
    if (selectedYear === endDate.getFullYear()) {
      return months.slice(0, endDate.getMonth() + 1);
    }
    return months;
  };

  // Handle change functions
  const handleDayChange = (e: any) => setSelectedDay(parseInt(e.target.value));
  const handleMonthChange = (e: any) => setSelectedMonth(parseInt(e.target.value));
  const handleYearChange = (e: any) => setSelectedYear(parseInt(e.target.value));


  const handleBack = () => {
    setDate();
    setStep(1);
  }

  const handleSave = () => {
    const final_date = new Date(selectedYear, selectedMonth, selectedDay)
    setDate(final_date)

    const submitRating = async () => {
      try {
        if (!album || !friend || !final_date) return
        const user_id = isId
        const friend_id = friend.id
        const album_id = album.id
        const date = final_date
        const response = await axios.post(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/schedule`, { user_id, date, friend_id, album_id });
        console.log("Inserted successfully")
        setReload(!reload)
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    }

    submitRating();
    setReload(!reload);
    setOpenScheduleModal(false);
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='my-3'>Choose deadline</h3>
        <svg onClick={() => setOpenScheduleModal(false)} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.2071L21.4104 6.29542C21.5869 6.119 21.8201 6.03079 22.0521 6.03079C22.5402 6.03079 22.9583 6.42229 22.9583 6.93583C22.9583 7.16904 22.8701 7.40104 22.6937 7.57867L15.782 14.4891L22.6925 21.3996C22.8701 21.5772 22.9583 21.8092 22.9583 22.0412C22.9583 22.5572 22.5366 22.9475 22.0521 22.9475C21.8201 22.9475 21.5869 22.8593 21.4104 22.6828L14.5 15.7724L7.58953 22.6828C7.41311 22.8593 7.17991 22.9475 6.94791 22.9475C6.46336 22.9475 6.04166 22.5572 6.04166 22.0412C6.04166 21.8092 6.12986 21.5772 6.30749 21.3996L13.2179 14.4891L6.30628 7.57867C6.12986 7.40104 6.04166 7.16904 6.04166 6.93583C6.04166 6.42229 6.45974 6.03079 6.94791 6.03079C7.17991 6.03079 7.41311 6.119 7.58953 6.29542L14.5 13.2071Z" fill="#F1F1F1" />
        </svg>
      </div>

      <div className='d-flex flex-row my-2 gap-2 mx-auto'>
        <select
          value={selectedDay}
          onChange={handleDayChange}
          className="date-input"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          className="date-input"
          onChange={handleMonthChange}
        >
          {availableMonths().map((month, index) => {
            const monthIndex =
              selectedYear === currentYear ? index + currentMonth : index;
            return (
              <option key={monthIndex} value={monthIndex}>
                {month}
              </option>
            );
          })}
        </select>

        <select
          value={selectedYear}
          className="date-input"
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className='schedule-recap'>
        <img className="search-album-result-img" src={album.image} width={200} height={200}></img>
        <div className='col px-2 text-center'>
          <div className='fs-16 fw-400'>{album.title}</div>
          <div className='fs-14 fw-300 text-gray'>{album.artists![0].name}</div>
        </div>

        <div className='search-friend-result' style={{ height: "50px" }}>
          <img className="search-friend-result-img" src={friend.image_url} width={30} height={30}></img>
          <div className='fs-12 fw-400'>{friend.username}</div>
        </div>
      </div>

      <div className='d-flex flex-row justify-content-between'>
        <button className='btn-black mx-3 col' onClick={handleBack}>Back</button>
        <button className='btn-accent mx-3 col' onClick={handleSave}>Finish</button>
      </div>
    </>
  )
}

const AddScheduleModal = () => {
  const [step, setStep] = useState<number>(0);
  const [selectedAlbum, setSelectedAlbum] = useState();
  const [selectedFriend, setSelectedFriend] = useState();
  const [friends, setFriends] = useState<Array<IUser>>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { isId } = useContext(AuthContext)

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
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchFriends();
  }, [isId]);

  return (
    <div className='modal-add-schedule'>
      <div className='modal-add-schedule-div position-relative'>
        {step === 0 && <Step0 step={step} setStep={setStep} album={selectedAlbum} setAlbum={setSelectedAlbum} />}
        {step === 1 && <Step1 step={step} setStep={setStep} album={selectedAlbum} friend={selectedFriend} setFriend={setSelectedFriend} friends={friends!} />}
        {step === 2 && <Step2 step={step} setStep={setStep} album={selectedAlbum} friend={selectedFriend} date={selectedDate} setDate={setSelectedDate} />}
      </div>
    </div>
  )
}

export default AddScheduleModal