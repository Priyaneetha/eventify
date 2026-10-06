// src/components/BookingModal.jsx
// Interactive Modal for ticket booking and confirmation

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import { X, Ticket, Calendar, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const BookingModal = ({ event, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const availableSeats = event.capacity - (event.bookedSeats || 0);
  const maxTicketsAllowed = Math.min(5, availableSeats);

  const [ticketsCount, setTicketsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Login Required</h3>
          <p className="text-slate-300 text-sm">
            Please log in or create an account to book tickets for <span className="font-semibold text-indigo-400">{event.title}</span>.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await bookingAPI.createBooking({
        eventId: event._id,
        ticketsCount: Number(ticketsCount),
      });

      setSuccessMsg('Booking Confirmed! Redirecting to your bookings...');
      if (onSuccess) onSuccess(res.data.booking);

      setTimeout(() => {
        onClose();
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = (event.price || 0) * ticketsCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Book Tickets</h2>
            <p className="text-xs text-slate-400">Select number of tickets and confirm booking</p>
          </div>
        </div>

        {/* Event Brief Box */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 mb-6 space-y-2">
          <h4 className="font-bold text-slate-100 text-sm">{event.title}</h4>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {event.location}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleBooking} className="space-y-6">
          {/* User Details Preview */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendee Info</label>
            <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-300 flex justify-between">
              <span>{user.name}</span>
              <span className="text-slate-400">{user.email}</span>
            </div>
          </div>

          {/* Ticket Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Number of Tickets</label>
              <span className="text-xs text-slate-400">Available: {availableSeats}</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setTicketsCount((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-xl font-bold text-white px-4 min-w-[40px] text-center">{ticketsCount}</span>
              <button
                type="button"
                onClick={() => setTicketsCount((prev) => Math.min(maxTicketsAllowed, prev + 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ticket Price</span>
              <span>{event.price === 0 ? 'FREE' : `$${event.price} x ${ticketsCount}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-1">
              <span>Total Amount</span>
              <span className="text-indigo-400">{totalPrice === 0 ? 'FREE' : `$${totalPrice}`}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
