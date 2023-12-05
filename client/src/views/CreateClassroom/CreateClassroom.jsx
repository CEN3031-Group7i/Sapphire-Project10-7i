  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import './CreateClassroom.less';

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


export default function CreateClassroom() {
  const className = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateClassroom = async (e) => {
    // backend stuff
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onSubmit={handleCreateClassroom} // Form submission is now handled by the handleCreateClassroom function
        >
          <div id='box-title'>Create Classroom</div>
          <input type='text' {...className} placeholder='Clasroom Name' autoComplete='className' />
          <input type='button' value={loading ? 'Loading...' : 'Create'} disabled={loading} onClick={handleCreateClassroom}/>
        </form>
      </div>
    </div>
  );
}
