import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { getCurrentUserData, updateUser, setUserSession } from '../../Utils/AuthRequests';
import './EditAccount.less';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';


export default function EditAccount() {
    const [currentUser, setCurrentUser] = useState({ username: '', email: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => { //fetch user data
          try {
            const userData = await getCurrentUserData();
            setCurrentUser({
              username: userData.username,
              email: userData.email,
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, []);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
    };


    const handleSaveChanges = async () => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/; //Only allow letters, numbers, and underscores
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Basic email regex

        // Check if the current state passes the regex checks
        if (!emailRegex.test(currentUser.email)) {
            message.error('Invalid email format');
            return;
        } else if (!usernameRegex.test(currentUser.username)) {
            message.error('Invalid username format');
            return;
        }
        setLoading(true);
        try {
          const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
          const user = JSON.parse(sessionStorage.getItem('user')); // Retrieve the user data from session storage
          const userId = user.id; // Get the user's ID
    
          const updateData = {
            username: currentUser.username,
            email: currentUser.email,
          };
    
          const updatedUser = await updateUser(userId, updateData, token);
          
          // Update the user session with new data
          setUserSession(token, JSON.stringify(updatedUser));
    
         
          navigate('/settings');
        } catch (error) {
          console.error('Error saving changes:', error);
          // Handle error, e.g., set an error message state and display it
        } finally {
          setLoading(false);
        }
      };


    return (
        <div className='container nav-padding'>
          <NavBar />
          <div id='content-wrapper'>
            <div id='box'>
              <div id='box-title'>Edit Account</div>
              <input
                type='text'
                name='username'
                placeholder='Username'
                autoComplete='username'
                value={currentUser.username}
                onChange={handleInputChange}
              />
              <input
                type='email'
                name='email'
                placeholder='Email'
                autoComplete='email'
                value={currentUser.email}
                onChange={handleInputChange}
              />
              <input
                type='button'
                value={loading ? 'Saving...' : 'Save Changes'}
                disabled={loading}
                onClick={handleSaveChanges}
                />
            </div>
          </div>
        </div>
      );
}