import React, { useEffect, useState } from 'react';
import { fetchSelfInfo} from '../api/user';
import { getSession } from '../services/sessionService';
import {convertTimestampToMonthYear, defaultUser} from '../utils/utils';
import '../styles/Profile.css';
import ModalProfileEdit from '../components/ModalProfileEdit';

function Profile() {
  const [selfInfo, setSelfInfo] = useState<UserResponse>(defaultUser);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const sessionToken = getSession();
            
            if (sessionToken) {
              const tokenData = await fetchSelfInfo(sessionToken);
              setSelfInfo(tokenData);
            } else {
              console.error("Token de session null.");
            }
          } catch (error) {
            console.error("Error fetching self info:", error);
          }
        };
    
        fetchData();
      }, []);


    return (
        <div className='profile-container'>
            {!selfInfo && ( <>Loading...</>)}
            
            {selfInfo && (
                <>
                <div className='profile-card'>
                <h2>{selfInfo.username}</h2>
                <p> {selfInfo.aboutMe}</p>
                <p>Joined {convertTimestampToMonthYear(selfInfo.joinDate)}</p>
                <p>{selfInfo.follow.length} followers</p>
                <ModalProfileEdit selfInfo={selfInfo}></ModalProfileEdit>
                </div>
                </>
            )}

        </div>
    );
}

export default Profile;