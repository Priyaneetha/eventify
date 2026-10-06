// src/pages/MyBookingsPage.jsx
// User's My Bookings page: view reserved tickets and cancel bookings

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { Ticket, Calendar, MapPin, DollarSign, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Confirmed', 'Cancelled'
  const [cancellingId, setCancellingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Tickets will be released.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setErrorMsg('');
      const res = await bookingAPI.cancelBooking(bookingId);
      setSuccessMsg(res.data.message || 'Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'Confirmed') return b.status === 'Confirmed';
    if (filterStatus === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-8 h-8 text-indigo-400" /> My Bookings
          </h1>
          <p className="text-slate-400 text-sm">View and manage all your event ticket reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {['All', 'Confirmed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-lg mx-auto">
          <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-300">No bookings found</h3>
          <p className="text-xs text-slate-400">
            {filterStatus === 'All'
              ? "You haven't booked any event tickets yet."
              : `No ${filterStatus.toLowerCase()} bookings found.`}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500"
          >
            <span>Browse Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const event = booking.event;
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking._id}
                className={`glass-card p-6 rounded-2xl border transition-all ${
                  isCancelled ? 'border-red-500/20 opacity-75' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left Event Thumbnail & Info */}
                  <div className="flex items-start space-x-4">
                    {event?.image ? (
                      <img
                        src={event.image}
                        alt={event?.title || 'Event'}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-700/60 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <Ticket className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                          {event?.category || 'General'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isCancelled
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">
                        {event ? (
                          <Link to={`/events/${event._id}`} className="hover:text-indigo-400 transition-colors">
                            {event.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">Event Removed</span>
                        )}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {event?.date || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {event?.location || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Details & Cancellation */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 gap-3">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-400">
                        Tickets Reserved: <strong className="text-white">{booking.ticketsCount}</strong>
                      </div>
                      <div className="text-base font-extrabold text-indigo-400">
                        {booking.totalPrice === 0 ? 'FREE' : `$${booking.totalPrice}`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-xl border border-red-500/30 transition-all disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
