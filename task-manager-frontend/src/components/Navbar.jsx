// src/components/Navbar.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-slate-800 text-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link to={user ? "/dashboard" : "/login"} className="text-2xl font-bold text-slate-100">
//             TaskManager
//           </Link>
//           <ul className="flex items-center space-x-6">
//             {user ? (
//               <>
//                 <li className="font-semibold">Welcome, {user.name}!</li>
//                 <li>
//                   <Link to="/settings" className="text-gray-400 hover:text-white" title="Settings">
//                     ⚙️
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={logout}
//                     className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-200"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li><Link to="/login" className="hover:text-slate-300">Login</Link></li>
//                 <li><Link to="/register" className="hover:text-slate-300">Register</Link></li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-slate-900/50 border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to={user ? "/dashboard" : "/login"} className="text-xl font-bold text-white tracking-wider">
            Academia<span className="text-indigo-400">OS</span>
          </Link>
          <ul className="flex items-center space-x-4">
            {user ? (
              <>
                <li className="font-semibold text-sm text-gray-300">Welcome, {user.name}!</li>
                <li><Link to="/settings" className="text-gray-400 hover:text-white" title="Settings">⚙️</Link></li>
                <li>
                  <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md transition duration-200 text-white font-semibold">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium">Login</Link></li>
                <li><Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition duration-200 text-white text-sm font-semibold">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;