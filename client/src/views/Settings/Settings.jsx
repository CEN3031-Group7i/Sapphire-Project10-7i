import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { deleteUser, removeUserSession, getCurrentUser } from '../../Utils/AuthRequests';
import "./Settings.less";
import { useNavigate } from 'react-router-dom';

export default function Settings(props) {
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate();
  const curUser = getCurrentUser();
  // const popup = document.querySelector(".popup");
  // const deleteButton = document.querySelector(".delete-account-button");
  // const confirmButton = document.querySelector(".confirm");
  // const cancelButton = document.querySelector(".cancel");

  // const [curUser, setCurUser] = useState({});
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const user = await getCurrentUser();
  //       setCurUser(user);
  //     } catch (error) {
  //       console.error('Error fetching current user:', error);
  //       setError("Failed to load user data. Please try again later.");
  //     }
  //   };

  //   fetchCurrentUser();
  // }, []);


  window.onload = function () {
      this.document.getElementsByClassName('username').value = curUser.username;
      this.document.getElementsByClassName('email').value = curUser.email;    
      console.log('hi');
  };
  
 //deleteButton.addEventListener("click", function () { popup.classlist.add("show"); } );
  const removeShow = async () => { popup.classlist.remove("show"); };
  //confirmButton.addEventListener("click", function () { popup.classlist.remove("show"); } );
  //cancelButton.addEventListener("click", function () { popup.classlist.remove("show"); } );

  const handleDeleteAccount = async () => {
    //popup.classlist.add("show");
    //setShowPopup(true);
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
    <div className="container nav-padding setting">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Settings</h1>
        <div id="divider" />
        <form>
          <input
            className='username'
            type='text'
            value='curUser.username'
            disabled
          />
          <input
            className='email'
            type='email'
            value='curUser.email'
            disabled
          />
        </form>
        <div className="button-container" id="container button-container">
          <input
            type='button'
            value='Edit Account'
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


      {/* <div class="popup">
        <form class="prompt"> 
          <div>
            Are you sure you want to delete your account? This action cannot be undone.
          </div>
      
      
      <button type="button" class="confirm" onClick={removeShow}>Confirm</button>
      <button type="button" class="cancel" onClick={removeShow}>Cancel</button>
        </form>
      </div> */}
      {/* {showPopup && (
        <div className="popup">
          <form className="prompt">
            <div>
              Are you sure you want to delete your account? This action cannot be undone.
            </div>
            <button type="button" className="confirm" onClick={confirmDelete}>
              Confirm
            </button>
            <button type="button" className="cancel" onClick={cancelDelete}>
              Cancel
            </button>
          </form>
        </div>
      )} */}
    </div>
  
    
  );
}
