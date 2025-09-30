// src/components/CourseCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link 
      to={`/courses/${course.id}`} 
      className="block bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 transition-transform duration-200"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-400">{course.courseCode}</h3>
        {/* You can add a progress circle or other metric here later */}
      </div>
      <p className="mt-2 text-lg text-slate-200">{course.title}</p>
      <p className="mt-4 text-sm text-slate-400">{course.instructor || 'No instructor listed'}</p>
    </Link>
  );
};

export default CourseCard;