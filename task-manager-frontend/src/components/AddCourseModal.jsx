// src/components/AddCourseModal.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';

const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/courses', { courseCode, title, instructor });
      onCourseAdded(); // Refresh the course list on the dashboard
      onClose();       // Close the modal
    } catch (err) {
      setError('Failed to add course. Please try again.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Add a New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Course Code (e.g., CS201)"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
          <input
            type="text"
            placeholder="Course Title (e.g., Data Structures)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
          <input
            type="text"
            placeholder="Instructor Name"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-white bg-slate-600 hover:bg-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;