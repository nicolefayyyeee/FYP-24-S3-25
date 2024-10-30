import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPencilAlt } from '@fortawesome/fontawesome-free-solid';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import './Profile.css';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manageMode, setManageMode] = useState(false); 
  const [avatarsConfig, setAvatarsConfig] = useState({});
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:5000/get_users?user_id=${userId}`);
      const data = await response.json();
      setUsers(data);
      fetchAvatars(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching user profiles.');
    } finally {
      setLoading(false);
    }
  }, []); 

  const fetchAvatars = async (profiles) => {
    const avatarPromises = profiles.map(async (profile) => {
      try {
        const avatarData =await fetch(`http://localhost:5000//get_web_avatar?user_id=${profile.user_id}`);
        if (avatarData) {
          return {
            userId: profile.user_id,
            config: await avatarData.json(),
          };
        }
      } catch (error) {
        console.error(`Error fetching avatar for ${profile.username}:`, error);
      }
      return null;
    });

    const avatarResults = await Promise.all(avatarPromises);
    const filteredAvatars = avatarResults.filter(Boolean);

    const avatarsMap = {};
    filteredAvatars.forEach((item) => {
      avatarsMap[item.userId] = item.config;
    });

    setAvatarsConfig(avatarsMap);
  };


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChildLogin = async (user) => {
    try {
      localStorage.removeItem('user_id');
      localStorage.setItem('user_id', user.user_id);
      localStorage.setItem('profile', "child");
      localStorage.setItem('username', user.username);

      navigate('/childHome');
    } catch (error) {
      console.error('Failed to log in with child profile:', error);
    }
  };

  const handleEditProfile = (childUserId) => {
    navigate('/editChild', { state: { childUserId } });
  };

  const toggleManageMode = () => {
    setManageMode((prevMode) => !prevMode);
  };

  const handleAddProfile = () => {
    navigate('/subscriptionPlans'); 
};

const generateAvatarSVG = (options) => {
  const avatar = createAvatar(micah, {
    baseColor: [options.baseColor],
    earringColor: [options.earringColor],
    earrings: [options.earrings === 'none' ? '' : options.earrings],
    earringsProbability: options.earrings === 'none' ? 0 : options.earringsProbability ? 100 : 0,
    eyebrows: [options.eyebrows],
    eyebrowsColor: [options.eyebrowsColor],
    eyes: [options.eyes],
    eyesColor: [options.eyesColor],
    eyeShadowColor: [options.eyeShadowColor],
    facialHair: [options.facialHair === 'none' ? '' : options.facialHair],
    facialHairColor: [options.facialHairColor],
    facialHairProbability: options.facialHair === 'none' ? 0 : options.facialHairProbability ? 100 : 0,
    glasses: [options.glasses === 'none' ? '' : options.glasses],
    glassesColor: [options.glassesColor],
    glassesProbability: options.glasses === 'none' ? 0 : options.glassesProbability ? 100 : 0,
    hair: [options.hair],
    hairColor: [options.hairColor],
    mouth: [options.mouth],
    mouthColor: [options.mouthColor],
    nose: [options.nose],
    shirt: [options.shirt],
    shirtColor: [options.shirtColor],
    backgroundColor:
      options.backgroundType === 'gradientLinear'
        ? [options.gradientStartColor, options.gradientEndColor]
        : [options.backgroundColor],
    backgroundType: [options.backgroundType],
  });
  return avatar.toString();
};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="whoIsWatching">
      <div className="main-div">
        <h1>Who's playing?</h1>
        <div className="memberDiv">
          {users.length === 0 ? (
            <p>No profiles available</p>
          ) : (
            users.map((user, index) => {
              const avatarConfig = avatarsConfig[user.user_id];
              return (
                <div key={index} className="profile-item">
                  <button
                    className="btn"
                    onClick={() => handleChildLogin(user)}
                    disabled={manageMode}
                  > 
                  {avatarConfig && (
                    <div
                      dangerouslySetInnerHTML={{ __html: generateAvatarSVG(avatarConfig) }}
                    />
                  )}
                    <span>{user.username}</span>
                  </button>
                  {manageMode && (
                    <button
                      className="edit-icon-overlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProfile(user.user_id);
                      }}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  )}
                </div>
              );
            })
          )}
          <button className="addIcon" onClick={handleAddProfile}>
            <FontAwesomeIcon icon={faPlusCircle} />
            <span>Add Profile</span>
          </button>
        </div>
        <button className="manageProfile" onClick={toggleManageMode}>
          {manageMode ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
