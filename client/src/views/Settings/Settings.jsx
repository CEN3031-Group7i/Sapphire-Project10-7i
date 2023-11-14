import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { deleteUser, removeUserSession } from '../../Utils/AuthRequests';
import "./Settings.less";
import { useNavigate } from 'react-router-dom';

export default function Settings(props) {
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        // Retrieve the current user's ID from sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userId = user.id;

        // Call the deleteUser function with the current user's ID
        await deleteUser(userId);

        // Navigate to the login page or home page after deleting the account
        navigate('/');
        removeUserSession(); //remove user session after deleting account (navbar change to menu)
      } catch (error) {
        // Handle any errors here, such as showing an error message
        console.error('Error deleting account:', error);
        setError("Failed to delete account. Please try again later.");
      }
    }
  };

  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Settings</h1>
        <div id="divider" />
        <div className="button-container" id="container button-container">
          <input
            type='button'
            value='Edit Password'
          />
          <input
            type='button'
            value='Merge Account'
          />
        </div>
        <input 
          className="delete-account-button"
          type='button'
          value='Delete Account'
          onClick={handleDeleteAccount}
        />
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      </div>
    </div>
  );
}
