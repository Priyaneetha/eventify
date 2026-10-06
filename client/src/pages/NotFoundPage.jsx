// src/pages/NotFoundPage.jsx
// 404 Not Found fallback page

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-6xl font-extrabold text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-sm text-slate-400">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
