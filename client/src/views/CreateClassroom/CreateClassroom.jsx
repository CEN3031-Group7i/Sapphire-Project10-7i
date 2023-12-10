import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import './CreateClassroom.less';
import { server } from '../../Utils/hosts.js'
import { addClassroom, getGrades, getSchools, setClassroom } from '../../Utils/requests';

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
  const [grades, setGrades] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchGrades = async () => {
        try {
            const gradeData = await getGrades();
            setGrades(gradeData.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchSchools = async () => {
      try {
          const schoolData = await getSchools();
          setSchools(schoolData.data); 
      } catch (error) {
          console.error('Error fetching schools:', error);
      }
  };

    fetchGrades();
    fetchSchools();
  }, []);

  const handleSchoolChange = (e) => {
    e.preventDefault();
    setSelectedSchoolId(e.target.value);
  };
  const handleGradeChange = (e) => {
    e.preventDefault();
    setSelectedGradeId(e.target.value);
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      const postResponse = await addClassroom(className.value, parseInt(selectedSchoolId), parseInt(selectedGradeId));
      
      const classroomId = postResponse.data.id
      const userId = JSON.parse(sessionStorage.getItem('user')).id;
      const putResponse = await setClassroom(classroomId, [userId]);

      navigate(`/classroom/${classroomId}`)

    }
    catch(error) {
      setLoading(false);
      console.error('CreateClassroom Error:', error)
      message.error(error.response?.data?.message[0]?.messages[0]?.message || 'Create failed. Please check your information and try again.');
    }

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
          <select onChange={handleSchoolChange} value={selectedSchoolId}>
            <option value="" disabled>Select a School</option>
            {schools.map(school => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}</select>
          <select onChange={handleGradeChange} value={selectedGradeId}>
            <option value="" disabled>Select a Grade</option>
            {grades.map(grade => (
            <option key={grade.id} value={grade.id}>{grade.name}</option>
          ))}</select>          
          <input type='button' value={loading ? 'Loading...' : 'Create'} disabled={loading} onClick={handleCreateClassroom}/>
        </form>
      </div>
    </div>
  );
}
