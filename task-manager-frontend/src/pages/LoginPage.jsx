// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false); 
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); 

//     try {
//       await login({ email, password });
//     } catch (err) {
//       console.error('Login failed:', err.response?.data);
//       setError(err.response?.data?.error || 'Invalid email or password.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900 text-white p-4"> {/* min-h-[calc(100vh-80px)] accounts for Navbar height */}
//       <div className="w-full max-w-lg p-10 bg-slate-800 rounded-xl shadow-2xl space-y-8 border border-slate-700">
//         <h2 className="text-4xl font-extrabold text-center text-indigo-400">Welcome Back!</h2>
//         <p className="text-center text-lg text-slate-300">Log in to manage your tasks efficiently.</p>
        
//         {error && (
//           <div className="bg-red-500 bg-opacity-20 text-red-300 p-3 rounded-md text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-slate-300">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
//               placeholder="you@example.com"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-slate-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
//               placeholder="••••••••"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800"
//           >
//             Sign In
//           </button>
//         </form>
//         <p className="text-center text-sm text-slate-400">
//           Don't have an account?{' '}
//           <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- State for password visibility
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900 text-white p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Left Side - Welcome Message */}
        <div className="p-10 bg-indigo-600 flex flex-col justify-center">
          <h2 className="text-4xl font-black text-white">Welcome Back!</h2>
          <p className="mt-4 text-lg text-indigo-200">Log in to manage your courses and projects efficiently.</p>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 bg-slate-800 space-y-6">
          <h2 className="text-3xl font-bold text-center text-white">Sign In to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            {/* --- PASSWORD FIELD WITH SHOW/HIDE BUTTON --- */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-3.29-3.29m0 0l-3.29 3.29" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200 ease-in-out">
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;