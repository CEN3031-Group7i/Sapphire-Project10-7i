import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { getCurrentUserData, updateUser, setUserSession, getAllStudents } from '../../Utils/AuthRequests';
import './MergeAccount.less';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function MergeAccount() {
    const [students, setStudents] = useState([]); // New state for storing students
    const [loading, setLoading] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedStudentEmoji, setSelectedStudentEmoji] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const studentData = await getAllStudents();
                setStudents(studentData); // Update the state with fetched student data
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents(); // Fetch students when the component mounts
    }, []);

    const handleMergeAccount = async () => {
      // Ensure that selectedStudentId is not an empty string
      if (!selectedStudentId) {
        message.error('Please select a student.');
        return;
      }
    
      const selectedStudent = students.find(student => student.id.toString() === selectedStudentId);
    
      // Log the selected student for debugging
      console.log('Selected student:', selectedStudent);
    
      if (!selectedStudent) {
        message.error('Selected student ID does not exist in the data.');
        return;
      }
    
      if (selectedStudent.character !== selectedStudentEmoji) {
        message.error('Student name and emoji do not match.');
        return;
      }
    
      // If they match, proceed with the merge logic
      setLoading(true);
      try {
        // Perform merge logic here
        // For now, we'll just log success and redirect
        // In the future, we'll need to call the API to perform the merge
        console.log('Accounts would be merged here.');
        message.success('Accounts merged successfully.');
        navigate('/settings');
      } catch (error) {
        console.error('Error merging accounts:', error);
        message.error('Failed to merge accounts.');
      } finally {
        setLoading(false);
      }
    };
    

    return (
        <div className='container nav-padding merge'>
            <NavBar />
            <div id='content-wrapper'>
                <div id='box'>
                    <div id='box-title'>Merge Account</div>
                    <form>
                      <select 
                        name="studentName" 
                        id="studentName" 
                        value={selectedStudentId} // bind the value to the state
                        onChange={e => setSelectedStudentId(e.target.value)}
                      >
                        <option value="" disabled hidden>Student Name</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                      </select>
                      <select 
                        name="studentEmoji" 
                        id="studentEmoji" 
                        value={selectedStudentEmoji} // bind the value to the state
                        onChange={e => setSelectedStudentEmoji(e.target.value)}
                      >
                        <option value="" disabled hidden>Student Emoji</option>
                        {students.map(student => (
                          <option key={student.id} value={student.character}>{student.character}</option>
                        ))}
                      </select>
                      <input
                        type='button'
                        value={loading ? 'Merging...' : 'Merge Account'}
                        disabled={loading}
                        onClick={handleMergeAccount}
                      />
                    </form>
                </div>
            </div>
        </div>
    );
}
