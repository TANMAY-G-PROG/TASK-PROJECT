// src/components/GitActivityTab.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const GitActivityTab = ({ project }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!project.githubRepo) {
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${project.id}/repo-activity`);
        // We'll just show the latest 5 commits for a clean UI
        setCommits(response.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load repository activity.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [project.id, project.githubRepo]);

  if (loading) return <p className="text-gray-400">Loading activity...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!project.githubRepo) return <p className="text-gray-400">No GitHub repository linked. Link one in the 'Members & Settings' tab.</p>;

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-semibold mb-4">
        Recent Commits for <a href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{project.githubRepo}</a>
      </h2>
      <ul className="space-y-4">
        {commits.map(commitData => (
          <li key={commitData.sha} className="border-b border-slate-700 pb-3">
            <a href={commitData.html_url} target="_blank" rel="noopener noreferrer" className="block hover:bg-slate-700 p-2 rounded-md">
                <p className="font-medium text-white truncate">{commitData.commit.message}</p>
                <p className="text-sm text-gray-400">by {commitData.commit.author.name} on {new Date(commitData.commit.author.date).toLocaleDateString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitActivityTab;