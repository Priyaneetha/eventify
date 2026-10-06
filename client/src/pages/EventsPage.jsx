// src/pages/EventsPage.jsx
// Browse all events with live search, category filtering, and sorting options

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import { Search, Filter, Calendar, SlidersHorizontal, RefreshCw } from 'lucide-react';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'price-low', 'price-high'
  const [onlyFree, setOnlyFree] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  const categories = ['All', 'Technology', 'Music', 'Workshop', 'Business', 'Sports', 'Arts'];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAllEvents({
        search: search || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredEvents = events
    .filter((event) => (onlyFree ? event.price === 0 : true))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(a.date) - new Date(b.date);
    });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('date');
    setOnlyFree(false);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse Events</h1>
        <p className="text-slate-400 text-sm">Find upcoming conferences, concerts, workshops, and meetups.</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search title, description, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="date">Sort: Upcoming Date</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Free Checkbox & Reset */}
          <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={(e) => setOnlyFree(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Free Events</span>
            </label>

            <button
              onClick={handleResetFilters}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredEvents.length}</strong> events
        </span>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl space-y-4">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No events found matching your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, changing categories, or resetting the filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onBookClick={(ev) => setSelectedEventForBooking(ev)}
            />
          ))}
        </div>
      )}

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

export default EventsPage;
