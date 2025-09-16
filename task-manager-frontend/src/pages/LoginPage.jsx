import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to handle API errors
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      await login({ email, password });
      // If login is successful, AuthContext will handle navigation
    } catch (err) {
      console.error('Login failed:', err.response?.data);
      setError(err.response?.data?.error || 'Invalid email or password.');
    }
  };

  return (
    // Centering container: flex, full height, justify-center, items-center
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900 text-white p-4"> {/* min-h-[calc(100vh-80px)] accounts for Navbar height */}
      <div className="w-full max-w-lg p-10 bg-slate-800 rounded-xl shadow-2xl space-y-8 border border-slate-700">
        <h2 className="text-4xl font-extrabold text-center text-indigo-400">Welcome Back!</h2>
        <p className="text-center text-lg text-slate-300">Log in to manage your tasks efficiently.</p>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-300 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;