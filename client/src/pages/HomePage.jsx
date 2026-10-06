// src/pages/HomePage.jsx
// Main Landing Page featuring hero section, categories, and top events

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import { Calendar, Search, Sparkles, TrendingUp, ShieldCheck, Ticket, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  const categories = ['All', 'Technology', 'Music', 'Workshop', 'Business', 'Sports', 'Arts'];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAllEvents({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching home events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 mt-4 px-4 sm:px-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover & Book Unforgettable Experiences</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Event Management & <span className="gradient-text">Instant Ticket Booking</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From high-tech developer summits to live music concerts and interactive workshops — find your next memorable event in just a few clicks.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-xl backdrop-blur-md">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by event title, topic, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none px-2"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {/* Highlights Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl glass-panel text-center">
              <div className="text-2xl font-extrabold text-indigo-400">50+</div>
              <div className="text-xs text-slate-400">Upcoming Events</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel text-center">
              <div className="text-2xl font-extrabold text-pink-400">10k+</div>
              <div className="text-xs text-slate-400">Happy Attendees</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel text-center">
              <div className="text-2xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Verified Organizers</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel text-center">
              <div className="text-2xl font-extrabold text-purple-400">Instant</div>
              <div className="text-xs text-slate-400">Digital Tickets</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Explore by Category
            </h2>
            <p className="text-slate-400 text-sm">Filter events according to your interest</p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <p className="text-slate-400 text-sm">Handpicked top events happening soon</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-700/40" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl space-y-3">
            <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No events found in this category</h3>
            <p className="text-xs text-slate-500">Check back later or try selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onBookClick={(ev) => setSelectedEventForBooking(ev)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onSuccess={() => fetchEvents()}
        />
      )}
    </div>
  );
};

export default HomePage;
