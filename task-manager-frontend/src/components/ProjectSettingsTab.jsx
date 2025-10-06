// src/components/ProjectSettingsTab.jsx

import React, { useState } from 'react';
import apiClient from '../services/api';

const MemberAvatar = ({ name }) => (
    <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-sm border-2 border-brand-light" title={name}>
      {name.charAt(0).toUpperCase()}
    </div>
);

const ProjectSettingsTab = ({ project, onUpdate }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');

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

  return (
    <div className="bg-brand-light p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
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
        <button type="submit" className="px-5 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg">
          + Add Member
        </button>
      </form>
      {inviteError && <p className="text-red-400 mt-2 text-sm">{inviteError}</p>}
    </div>
  );
};

export default ProjectSettingsTab;