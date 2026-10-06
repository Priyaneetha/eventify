// src/components/EventCard.jsx
// Visual Event Card component for displaying event highlights in grids

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Tag, Edit, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EventCard = ({ event, onBookClick, onEditClick, onDeleteClick }) => {
  const { isAdmin } = useContext(AuthContext);

  const availableSeats = event.capacity - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  // Category Color Badges
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Technology':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Music':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Workshop':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Business':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Arts':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Event Banner Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)} shadow-sm backdrop-blur-md`}>
            {event.category}
          </span>
        </div>

        {/* Price Tag Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/40 shadow-lg backdrop-blur-md">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>

        {/* Sold out overlay tag */}
        {isSoldOut && (
          <div className="absolute bottom-3 left-3 bg-red-500/90 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow">
            SOLD OUT
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event.date}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Seat Capacity Progress */}
        <div className="pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Seats Available
            </span>
            <span className={`font-semibold ${availableSeats < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {availableSeats} / {event.capacity} left
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isSoldOut ? 'bg-red-500' : availableSeats < 10 ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{
                width: `${Math.min(100, ((event.bookedSeats || 0) / event.capacity) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors border border-slate-700"
          >
            Details
          </Link>

          {onBookClick && (
            <button
              onClick={() => onBookClick(event)}
              disabled={isSoldOut}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all shadow-md ${
                isSoldOut
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Book Ticket'}
            </button>
          )}

          {/* Admin Edit/Delete Controls */}
          {isAdmin && (onEditClick || onDeleteClick) && (
            <div className="flex items-center gap-1 ml-1">
              {onEditClick && (
                <button
                  onClick={() => onEditClick(event)}
                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDeleteClick && (
                <button
                  onClick={() => onDeleteClick(event._id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
