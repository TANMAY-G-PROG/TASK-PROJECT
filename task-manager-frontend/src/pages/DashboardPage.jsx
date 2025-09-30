// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import AddCourseModal from '../components/AddCourseModal';
import CourseCard from '../components/CourseCard';

const DashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">My Courses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          + Add Course
        </button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold text-white">No Courses Yet!</h2>
          <p className="text-slate-400 mt-2">Click "Add Course" to get started and organize your semester.</p>
        </div>
      )}

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseAdded={fetchCourses}
      />
    </div>
  );
};

export default DashboardPage;