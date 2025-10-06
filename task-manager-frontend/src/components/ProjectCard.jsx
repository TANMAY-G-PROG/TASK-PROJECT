// import React from 'react';
// import { Link } from 'react-router-dom';

// const MemberAvatar = ({ name }) => (
//   <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm border-2 border-slate-800" title={name}>
//     {name.charAt(0).toUpperCase()}
//   </div>
// );

// const ProjectCard = ({ project }) => {
//   return (
//     <Link 
//       to={`/projects/${project.id}`} 
//       // --- HOVER EFFECT ADDED HERE ---
//       className="block bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
//     >
//       <h3 className="text-xl font-bold text-indigo-400 truncate">{project.name}</h3>
//       <p className="mt-2 text-sm text-slate-400 h-10 overflow-hidden">{project.description}</p>
      
//       <div className="flex items-center mt-4 -space-x-2">
//         {project.members.map(member => (
//           <MemberAvatar key={member.userId} name={member.user.name} />
//         ))}
//       </div>
//     </Link>
//   );
// };

// export default ProjectCard;

import React from 'react';
import { Link } from 'react-router-dom';

const MemberAvatar = ({ name }) => (
  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm border-2 border-slate-800" title={name}>
    {name.charAt(0).toUpperCase()}
  </div>
);

// 1. ACCEPT 'onDelete' and 'isAdmin' as props
const ProjectCard = ({ project, onDelete, isAdmin }) => {
  
  // 2. ADD the handler function for the delete action
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete(project.id);
    }
  };
  
  return (
    <Link 
      to={`/projects/${project.id}`} 
      // Added 'group' and 'relative' for the button's hover effect
      className="group relative block bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* 3. ADD the conditional delete button */}
      {isAdmin && (
        <button 
          onClick={handleDelete} 
          className="absolute top-3 right-3 text-slate-500 hover:text-red-500 z-10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Delete project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <h3 className="text-xl font-bold text-indigo-400 truncate">{project.name}</h3>
      <p className="mt-2 text-sm text-slate-400 h-10 overflow-hidden">{project.description}</p>
      
      <div className="flex items-center mt-4 -space-x-2">
        {project.members.map(member => (
          <MemberAvatar key={member.userId} name={member.user.name} />
        ))}
      </div>
    </Link>
  );
};

export default ProjectCard;