// src/pages/EventDetailsPage.jsx
// Detailed single event page with complete event summary, organizer info, and booking call-to-action

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import { Calendar, Clock, MapPin, Users, Tag, ArrowLeft, ShieldCheck, Share2, Ticket } from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getEventById(id);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20 glass-panel rounded-2xl space-y-4 max-w-lg mx-auto mt-8">
        <h3 className="text-xl font-bold text-red-400">Event Not Found</h3>
        <p className="text-slate-400 text-sm">{error || 'The requested event could not be found.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const availableSeats = event.capacity - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800">
        <div className="h-72 sm:h-96 w-full relative">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Header Overlay Text */}
        <div className="p-6 sm:p-10 -mt-24 sm:-mt-32 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/40">
              {event.price === 0 ? 'FREE EVENT' : `$${event.price} / Ticket`}
            </span>
            {event.status === 'Cancelled' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                EVENT CANCELLED
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300 pt-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Description vs Booking Info Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">About This Event</h3>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Organizer Info Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                {event.organizer ? event.organizer.charAt(0) : 'O'}
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{event.organizer || 'Event Organizer'}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Host
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Availability & Action Box */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 sticky top-24 space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ticket Price</span>
              <div className="text-3xl font-extrabold text-white">
                {event.price === 0 ? <span className="text-emerald-400">FREE</span> : `$${event.price}`}
              </div>
            </div>

            {/* Capacity gauge */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Seats Status
                </span>
                <span className={`font-semibold ${availableSeats < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {availableSeats} / {event.capacity} Available
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isSoldOut ? 'bg-red-500' : availableSeats < 10 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{
                    width: `${Math.min(100, ((event.bookedSeats || 0) / event.capacity) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={isSoldOut || event.status === 'Cancelled'}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center space-x-2 ${
                isSoldOut || event.status === 'Cancelled'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isSoldOut ? 'Sold Out' : event.status === 'Cancelled' ? 'Cancelled' : 'Book Tickets Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          event={event}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => fetchEventDetails()}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
