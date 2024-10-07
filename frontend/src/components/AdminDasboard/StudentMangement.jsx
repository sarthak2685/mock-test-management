import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar/SideBars';

const StudentManagement = ({ user }) => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', username: 'john_doe', password: 'password123' },
    { id: 2, name: 'Jane Smith', username: 'jane_smith', password: 'password456' }
  ]);

  const [newStudent, setNewStudent] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.username || !newStudent.password) {
      setError('All fields are required');
      return;
    }

    if (students.some(student => student.username === newStudent.username)) {
      setError('Username must be unique');
      return;
    }

    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    setNewStudent({ name: '', username: '', password: '' });
    setError('');
  };

  const handleRemoveStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen"> {/* Ensures full height for the container */}
      <DashboardHeader user={user || { name: 'Guest' }} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6"> {/* Takes up remaining space */}
          <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

          {/* Add Student Form */}
          <div className="bg-white p-4 mb-6 shadow-md rounded-lg">
            <h2 className="text-xl mb-2">Add Student</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Username"
              value={newStudent.username}
              onChange={e => setNewStudent({ ...newStudent, username: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={newStudent.password}
              onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleAddStudent}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Student
            </button>
          </div>

          {/* Student List */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl mb-4">Current Students</h2>
            <ul>
              {students.length > 0 ? (
                students.map(student => (
                  <li key={student.id} className="flex justify-between items-center mb-2">
                    <span>{student.name} ({student.username})</span>
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <li>No students added yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
