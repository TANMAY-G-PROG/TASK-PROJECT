// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to={user ? "/dashboard" : "/login"} className="text-2xl font-bold text-slate-100">
            TaskManager
          </Link>
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                <li className="font-semibold">Welcome, {user.name}!</li>
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-slate-300">Login</Link></li>
                <li><Link to="/register" className="hover:text-slate-300">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;