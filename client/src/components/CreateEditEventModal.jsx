// src/components/CreateEditEventModal.jsx
// Modal component for Admin to create or edit event details

import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { X, Calendar, MapPin, Clock, DollarSign, Image, Users, Tag, AlertCircle } from 'lucide-react';

const CreateEditEventModal = ({ event, onClose, onSuccess }) => {
  const isEditing = !!event;

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'Technology',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    price: event?.price ?? 0,
    capacity: event?.capacity ?? 100,
    image: event?.image || '',
    organizer: event?.organizer || 'Event Team',
    status: event?.status || 'Upcoming',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Technology', 'Music', 'Workshop', 'Business', 'Sports', 'Arts', 'General'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await eventAPI.updateEvent(event._id, formData);
      } else {
        await eventAPI.createEvent(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <p className="text-xs text-slate-400">Fill in event specifications for attendees</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 uppercase tracking-wider">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. AI & Cloud Developer Conference 2026"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 uppercase tracking-wider">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Detailed description of the event agenda, highlights, speaker details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Event Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Time *</label>
              <input
                type="text"
                name="time"
                required
                placeholder="e.g. 10:00 AM - 04:00 PM"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 uppercase tracking-wider">Location / Venue *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Grand Auditorium, Tech City"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Price ($) (0 for Free)</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Total Capacity (Seats) *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Image URL & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Banner Image URL</label>
              <input
                type="text"
                name="image"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">Organizer Name</label>
              <input
                type="text"
                name="organizer"
                placeholder="e.g. Global Tech Team"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditEventModal;
