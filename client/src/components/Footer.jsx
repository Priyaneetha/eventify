// src/components/Footer.jsx
// Footer component with copyright, tech stack details, and helpful links

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Eventify</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A full-stack Event Management System built with React, Node.js, Express, MongoDB, and Tailwind CSS. Simple, fast, and modern.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition-colors">Browse Events</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-indigo-400 transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors">User Profile</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-indigo-400 cursor-pointer">Technology</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Music & Concerts</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Workshops</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Business Pitch</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Eventify. Beginner-Friendly Full-Stack Project.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /> for Web Development Viva & Interviews.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
