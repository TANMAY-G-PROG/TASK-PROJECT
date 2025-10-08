// src/pages/SettingsPage.jsx

// import React from 'react';
// import { useAuth } from '../context/AuthContext';

// const SettingsPage = () => {
//   const { user } = useAuth();

//   return (
//     <div className="container mx-auto px-4 py-8 text-white">
//       <h1 className="text-4xl font-bold mb-8">Settings</h1>

//       <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 max-w-2xl">
//         <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
//         <div className="flex items-center justify-between">
//           <p className="text-lg">Connect your GitHub Account</p>
          
//           {user && user.githubId ? (
//             // If user is already connected
//             <div className="text-center">
//               <p className="text-green-400 font-semibold">✅ Connected</p>
//               <span className="text-sm text-gray-400">(ID: {user.githubId})</span>
//             </div>
//           ) : (
//             <a 
//               href="http://localhost:5000/api/auth/github"
//               className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-200"
//             >
//               Connect to GitHub
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;

// src/pages/SettingsPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, token } = useAuth(); // <-- Get the token from the context

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
            // The href now includes the token as a query parameter
            <a 
              href={`http://localhost:5000/api/auth/github?token=${token}`}
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