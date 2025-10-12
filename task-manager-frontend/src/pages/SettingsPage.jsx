// src/pages/SettingsPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, token } = useAuth();

  // --- THIS IS THE FIX ---
  // Construct the full, live backend URL for the GitHub link
  const githubAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/github?token=${token}`;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
        <div className="flex items-center justify-between">
          <p className="text-lg">Connect your GitHub Account</p>
          
          {user && user.githubId ? (
            <div className="text-center">
              <p className="text-green-400 font-semibold">✅ Connected</p>
            </div>
          ) : (
            // The href now uses the dynamic URL we constructed
            <a 
              href={githubAuthUrl}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md"
            >
              Connect to GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;