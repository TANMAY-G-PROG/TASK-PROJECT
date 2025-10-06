// src/components/CourseCard.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';

// const CourseCard = ({ course }) => {
//   return (
//     <Link 
//       to={`/courses/${course.id}`} 
//       className="block bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 transition-transform duration-200"
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-bold text-indigo-400">{course.courseCode}</h3>
//         {/* You can add a progress circle or other metric here later */}
//       </div>
//       <p className="mt-2 text-lg text-slate-200">{course.title}</p>
//       <p className="mt-4 text-sm text-slate-400">{course.instructor || 'No instructor listed'}</p>
//     </Link>
//   );
// };

// export default CourseCard;

// src/components/CourseCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onDelete }) => {
  // This function handles the delete action
  const handleDelete = (e) => {
    // These two lines are crucial to prevent the card's main link from being clicked
    e.stopPropagation();
    e.preventDefault();

    // Show a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
      onDelete(course.id);
    }
  };

  return (
    // Added `group` and `relative` to manage the hover effect for the delete button
    <Link 
      to={`/courses/${course.id}`} 
      className="group relative block bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* --- DELETE BUTTON ADDED HERE --- */}
      <button 
        onClick={handleDelete} 
        className="absolute top-3 right-3 text-slate-500 hover:text-red-500 z-10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Delete course"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-indigo-400">{course.courseCode}</h3>
      </div>
      <p className="mt-2 text-lg text-slate-200">{course.title}</p>
      <p className="mt-4 text-sm text-slate-400">{course.instructor || 'No instructor listed'}</p>
    </Link>
  );
};

export default CourseCard;