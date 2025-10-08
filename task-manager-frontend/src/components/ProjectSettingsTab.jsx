// src/components/ProjectSettingsTab.jsx

// import React, { useState } from 'react';
// import apiClient from '../services/api';

// const MemberAvatar = ({ name }) => (
//     <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-sm border-2 border-brand-light" title={name}>
//       {name.charAt(0).toUpperCase()}
//     </div>
// );

// const ProjectSettingsTab = ({ project, onUpdate }) => {
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [inviteError, setInviteError] = useState('');

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     setInviteError('');
//     try {
//         await apiClient.post(`/projects/${project.id}/members`, { email: inviteEmail });
//         setInviteEmail('');
//         onUpdate(); 
//     } catch (error) {
//         setInviteError(error.response?.data?.error || 'Failed to add member.');
//     }
//   };

//   return (
//     <div className="bg-brand-light p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Project Members</h2>
//       <div className="flex items-center gap-4 mb-6">
//         <div className="flex -space-x-3">
//           {project.members.map(member => <MemberAvatar key={member.userId} name={member.user.name} />)}
//         </div>
//       </div>
//       <h3 className="text-xl font-semibold mb-4">Invite New Member</h3>
//       <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-2">
//         <input 
//           type="email" 
//           value={inviteEmail}
//           onChange={(e) => setInviteEmail(e.target.value)}
//           placeholder="Enter user's email to invite"
//           className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
//         />
//         <button type="submit" className="px-5 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg">
//           + Add Member
//         </button>
//       </form>
//       {inviteError && <p className="text-red-400 mt-2 text-sm">{inviteError}</p>}
//     </div>
//   );
// };

// export default ProjectSettingsTab;

// src/components/ProjectSettingsTab.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT useAuth to check login status

const MemberAvatar = ({ name }) => (
    // Corrected styling to match the simple theme
    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm border-2 border-slate-800" title={name}>
      {name.charAt(0).toUpperCase()}
    </div>
);

const ProjectSettingsTab = ({ project, onUpdate }) => {
  const { user: loggedInUser } = useAuth(); // <-- 2. GET the logged-in user
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  // --- State for the new GitHub form ---
  const [repoName, setRepoName] = useState(project.githubRepo || '');

  const handleAddMember = async (e) => {
    e.preventDefault();
    setInviteError('');
    try {
        await apiClient.post(`/projects/${project.id}/members`, { email: inviteEmail });
        setInviteEmail('');
        onUpdate(); 
    } catch (error) {
        setInviteError(error.response?.data?.error || 'Failed to add member.');
    }
  };

  // --- Handler function for the new GitHub form ---
  const handleLinkRepo = async (e) => {
    e.preventDefault();
    try {
        await apiClient.put(`/projects/${project.id}`, { githubRepo: repoName });
        alert('Repository linked successfully!');
        onUpdate();
    } catch (error) {
        console.error("Failed to link repo", error);
        alert('Failed to link repository.');
    }
  };

  return (
    // Changed layout to a vertical stack
    <div className="max-w-2xl mx-auto space-y-8">

      {/* --- 3. THIS IS THE MISSING GITHUB SECTION --- */}
      {/* It will only appear if the logged-in user has connected their GitHub account */}
      {loggedInUser && loggedInUser.githubId && (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">GitHub Integration</h2>
            <form onSubmit={handleLinkRepo} className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Link GitHub Repository</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="e.g., username/repo-name"
                        className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    />
                    <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                        Link
                    </button>
                </div>
                <p className="text-xs text-gray-400">Link a repository to see recent activity.</p>
            </form>
        </div>
      )}
      
      {/* --- This is the Members Section --- */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-semibold mb-4">Project Members</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex -space-x-3">
            {project.members.map(member => <MemberAvatar key={member.userId} name={member.user.name} />)}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Invite New Member</h3>
        <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-2">
            <input 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter user's email to invite"
                className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
                + Add Member
            </button>
        </form>
        {inviteError && <p className="text-red-400 mt-2 text-sm">{inviteError}</p>}
      </div>

    </div>
  );
};

export default ProjectSettingsTab;