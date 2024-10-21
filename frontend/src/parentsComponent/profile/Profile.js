import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPencilAlt } from '@fortawesome/fontawesome-free-solid';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manageMode, setManageMode] = useState(false); 
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:5000/get_users?user_id=${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching user profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
            users.map((user, index) => (
              <div key={index} className="profile-item">
                <button
                  className={`btn btn-${index + 1}`}
                  onClick={() => handleChildLogin(user)}
                  disabled={manageMode} 
                >
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
            ))
          )}
          <button className="addIcon" onClick={() => navigate('/createChild')}>
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
