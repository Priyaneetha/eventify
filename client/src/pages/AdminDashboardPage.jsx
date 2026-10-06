// src/pages/AdminDashboardPage.jsx
// Complete Admin Dashboard with analytics overview, event management, and booking control

import React, { useState, useEffect } from 'react';
import { eventAPI, bookingAPI } from '../services/api';
import EventCard from '../components/EventCard';
import CreateEditEventModal from '../components/CreateEditEventModal';
import { Shield, PlusCircle, Calendar, Ticket, DollarSign, Users, Trash2, Edit, CheckCircle, AlertCircle, RefreshCw, Search } from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'bookings'
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Booking search query
  const [bookingSearch, setBookingSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsRes, bookingsRes] = await Promise.all([
        eventAPI.getAllEvents(),
        bookingAPI.getAllBookings(),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      setErrorMsg('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? All associated bookings will also be removed.')) {
      return;
    }

    try {
      setErrorMsg('');
      const res = await eventAPI.deleteEvent(eventId);
      setSuccessMsg(res.data.message || 'Event deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  // Calculations for Metrics Overview
  const totalEventsCount = events.length;
  const activeEventsCount = events.filter((e) => e.status === 'Upcoming').length;
  const totalBookingsCount = bookings.length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // Filter Bookings by Search
  const filteredBookings = bookings.filter((b) => {
    const term = bookingSearch.toLowerCase();
    const userName = b.user?.name?.toLowerCase() || '';
    const userEmail = b.user?.email?.toLowerCase() || '';
    const eventTitle = b.event?.title?.toLowerCase() || '';
    return userName.includes(term) || userEmail.includes(term) || eventTitle.includes(term);
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Administrative Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        </div>

        <button
          onClick={() => {
            setSelectedEventToEdit(null);
            setShowEventModal(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
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

      {/* Analytics Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Total Events</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalEventsCount}</div>
          <div className="text-[11px] text-emerald-400">{activeEventsCount} Active Upcoming</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Total Bookings</span>
            <Ticket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalBookingsCount}</div>
          <div className="text-[11px] text-purple-300">{confirmedBookingsCount} Confirmed</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Total Ticket Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">${totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Cumulative Revenue</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Occupancy Rate</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {events.length > 0
              ? `${Math.round(
                  (events.reduce((acc, e) => acc + (e.bookedSeats || 0), 0) /
                    Math.max(1, events.reduce((acc, e) => acc + e.capacity, 0))) *
                    100
                )}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-slate-400">Total Seats Filled</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'events'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>All User Bookings ({bookings.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl space-y-3">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No events found</h3>
              <p className="text-xs text-slate-400">Click "Create New Event" to add your first event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEditClick={(ev) => {
                    setSelectedEventToEdit(ev);
                    setShowEventModal(true);
                  }}
                  onDeleteClick={(id) => handleDeleteEvent(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: All Bookings Control Table */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Booking Search Box */}
          <div className="max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by user name, email, or event title..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Table view */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Attendee Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Event Title</th>
                  <th className="px-6 py-4 text-center">Tickets</th>
                  <th className="px-6 py-4 text-right">Total Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Booking Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No bookings matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{b.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-400">{b.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-indigo-300 max-w-xs truncate">
                        {b.event?.title || 'Event Removed'}
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{b.ticketsCount}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-400">
                        {b.totalPrice === 0 ? 'FREE' : `$${b.totalPrice}`}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating or Editing Event */}
      {showEventModal && (
        <CreateEditEventModal
          event={selectedEventToEdit}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEventToEdit(null);
          }}
          onSuccess={() => {
            setSuccessMsg(
              selectedEventToEdit ? 'Event updated successfully!' : 'New event created successfully!'
            );
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
