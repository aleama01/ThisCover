import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IUser } from '../interfaces';
import FriendCard from './FriendCard';

const SearchbarUsers = ({ id, friends }: { id: string, friends: Array<number> }) => {
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [searchUser, setSearchUsers] = useState("");
  const [searchResultsUsers, setSearchResultsUsers] = useState<Array<IUser>>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!id) return
      try {
        const response = await axios.get(`https://thiscover-e6fe268d2ce8.herokuapp.com/api/allusers/${id}`);
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchUsers();
  }, [id]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchUsers(value);

    if (value.trim() === "") {
      setSearchResultsUsers([]); // Clear results if input is empty
      return;
    }

    // Filter allUsers based on the search value in usernames
    const filteredUsers = allUsers.filter((user) =>
      user.username.toLowerCase().includes(value)
    );

    // Set search results, limiting to the first 3 matches
    setSearchResultsUsers(filteredUsers.slice(0, 3));
  }
  return (
    <>
      <div className='position-relative' style={{ margin: "5px 25px" }}>
        <svg className='position-absolute start-5' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.3789 17.5503L15.9903 13.1956C16.8412 11.8656 17.3333 10.2889 17.3333 8.60105C17.3333 3.85866 13.4455 0 8.66618 0C3.88691 0 0 3.85866 0 8.60105C0 13.3434 3.88691 17.2021 8.66707 17.2021C10.2843 17.2021 11.7992 16.7602 13.0954 15.992L17.5228 20.3853C19.4134 22.2586 22.2704 19.4263 20.3789 17.5503ZM2.6868 8.60105C2.6868 5.3295 5.37007 2.66694 8.66707 2.66694C11.9641 2.66694 14.6473 5.32863 14.6473 8.60105C14.6473 11.8735 11.9641 14.5352 8.66707 14.5352C5.37007 14.5352 2.6868 11.8726 2.6868 8.60105ZM4.45919 7.05759C6.20865 3.03356 12.099 3.49992 13.2083 7.71295C10.9738 5.11076 7.04194 4.83076 4.45919 7.05759Z" fill="#F1F1F1" />
        </svg>
        <input type="text" className='search-bar fs-14 fw-400 mx-auto' placeholder="Search for friends.." value={searchUser} onChange={handleSearch}>
        </input>
      </div>
      {searchUser != "" &&
        <>
          <h4 className='fw-16 my-2' style={{ paddingLeft: "25px" }}>Search results</h4>{

            searchResultsUsers.length > 0 ? (
              searchResultsUsers
                .filter((el) => !friends.includes(el.id))
                .map((user, index) => (
                  <FriendCard key={index} friend={user} is_friend={false} />
                ))
            )
              :
              <p className='text-gray fs-14 my-4 mx-auto'>User not found :c</p>

          }
        </>
      }
    </>
  )
}

export default SearchbarUsers