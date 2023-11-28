import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { registerUser, setUserSession, updateUserRole } from '../../Utils/AuthRequests'; 
import './Signup.less';

// Role ID 
const roles = {
  classroomManager: '1',
  public: '2',
  student: '3',
  contentCreator: '8',
  researcher: '9'
};

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};


export default function Signup() {
  const username = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');
  const confirmPassword = useFormInput('');
  const accountType = useFormInput('') // Added state for account type
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // Existing validation logic...
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
      if(password.value !== confirmPassword.value) {
        message.error('Passwords do not match.');
        return;
      }
      if(!usernameRegex.test(username.value)) {
        message.error('Username must only contain letters, numbers, and underscores.');
        return;
      }
      if(!emailRegex.test(email.value)) {
        message.error('Invalid email.');
        return;
      }
  
    setLoading(true);
    try {
      // Attempt to register the user
      const registrationResponse = await registerUser({
        username: username.value, 
        email: email.value, 
        password: password.value
      });
  
      // Extract user ID and JWT from the registration response
      const userId = registrationResponse.data.user.id;
      const token = registrationResponse.data.jwt;

      console.log(`Selected account type key: ${accountType.value}`); //debugging
      console.log(`Roles object:`, roles); //debugging
      console.log(`Role ID for selected account type: ${roles[accountType.value]}`); //debugging
  
      // Update the user's role if a role was selected
      const selectedRole = roles[accountType.value];
      console.log(`accountType: ${selectedRole}`);
      if (selectedRole) {
        console.log('updating user role')
        await updateUserRole(userId, selectedRole, token);
        
      }
  
      // Set user session and navigate
      setUserSession(token, JSON.stringify(registrationResponse.data.user));
      if(selectedRole === '3') { //If student, navigate to join code page
        navigate('/classroom');
      }
      else {
      navigate('/settings');
      }
  
    } catch (error) {
      setLoading(false);
      console.error('Signup Error:', error);
      message.error(error.response?.data?.message[0]?.messages[0]?.message || 'Signup failed. Please check your information and try again.');
    }
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onSubmit={handleSignup} // Form submission is now handled by the handleSignup function
        >
          <div id='box-title'>User Signup</div>
          <input type='text' {...username} placeholder='Username' autoComplete='username' />
          <input type='email' {...email} placeholder='Email' autoComplete='email' />
          <input type='password' {...password} placeholder='Password' autoComplete='new-password' />
          <input type='password' {...confirmPassword} placeholder='Confirm Password' autoComplete='new-password' />
          <select name="accountType" id="accountType" {...accountType}>
            <option value="" disabled hidden>Account Type</option>
            <option value="student">Student</option>
            <option value="classroomManager">Classroom Manager</option>
            <option value="researcher">Researcher</option>
            <option value="public">Public</option>
            <option value="contentCreator">Content Creator</option>
          </select>
          <input type='button' value={loading ? 'Loading...' : 'Signup'} disabled={loading} onClick={handleSignup}/>
        </form>
      </div>
    </div>
  );
}
