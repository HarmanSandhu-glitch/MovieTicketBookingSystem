import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllHalls } from '../feautres/halls/hallsSlice';
import { getAllShows } from '../feautres/shows/showsSlice';
import { getAllTickets } from '../feautres/tickets/ticketsSlice';
import HallCard from '../components/halls/HallCard';
import ShowCard from '../components/shows/ShowCard';
import AddHall from '../components/halls/AddHall';
import AddShow from '../components/shows/AddShow';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const hallsState = useSelector((state) => state.halls);
  const showsState = useSelector((state) => state.shows);
  const ticketsState = useSelector((state) => state.tickets);
  
  // Extract arrays safely
  const halls = Array.isArray(hallsState?.halls) ? hallsState.halls : [];
  const hallsLoading = hallsState?.isLoading || false;
  
  const shows = Array.isArray(showsState?.shows) ? showsState.shows : [];
  const showsLoading = showsState?.isLoading || false;
  
  const tickets = Array.isArray(ticketsState?.tickets) ? ticketsState.tickets : [];
  const ticketsLoading = ticketsState?.isLoading || false;

  const [activeSection, setActiveSection] = useState('overview');
  const [showAddHallModal, setShowAddHallModal] = useState(false);
  const [showAddShowModal, setShowAddShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!user.isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(getAllHalls());
    dispatch(getAllShows());
    dispatch(getAllTickets());
  }, [dispatch]);

  // Calculate metrics
  const totalHalls = halls.length;
  const totalShows = shows.length;
  const totalBookings = tickets.length;
  
  const totalRevenue = tickets
    .filter((ticket) => ticket.status === 'booked')
    .reduce((sum, ticket) => sum + (ticket.totalPrice || 0), 0);

  const bookedTickets = tickets.filter((ticket) => ticket.status === 'booked').length;
  const pendingTickets = tickets.filter((ticket) => ticket.status === 'pending').length;
  const cancelledTickets = tickets.filter((ticket) => ticket.status === 'cancelled').length;

  // Recent activities (last 5 bookings)
  const recentActivities = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const isLoading = hallsLoading || showsLoading || ticketsLoading;

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-blue-100 text-sm mt-1">Management Console</p>
          </div>

          <nav className="p-4">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 mb-2 ${
                activeSection === 'overview'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </button>
            <button
              onClick={() => setActiveSection('halls')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 mb-2 ${
                activeSection === 'halls'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Halls
            </button>
            <button
              onClick={() => setActiveSection('shows')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 mb-2 ${
                activeSection === 'shows'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Shows
            </button>
            <button
              onClick={() => setActiveSection('bookings')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 mb-2 ${
                activeSection === 'bookings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Bookings
            </button>
            <hr className="my-4" />
            <Link
              to="/"
              className="w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}! Manage your cinema operations.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div>
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Halls</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{totalHalls}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Shows</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{totalShows}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{bookedTickets}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Booked</span>
                          <span className="font-semibold text-green-600">{bookedTickets}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pending</span>
                          <span className="font-semibold text-amber-600">{pendingTickets}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cancelled</span>
                          <span className="font-semibold text-red-600">{cancelledTickets}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                      <div className="space-y-3">
                        {recentActivities.length > 0 ? (
                          recentActivities.map((ticket) => (
                            <div key={ticket._id} className="flex items-center gap-3 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                ticket.status === 'booked' ? 'bg-green-500' :
                                ticket.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-gray-600">
                                New booking for {ticket.show?.showName || 'N/A'}
                              </span>
                              <span className="text-gray-400 ml-auto">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No recent activities</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Halls Management */}
              {activeSection === 'halls' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Halls Management</h2>
                    <button
                      onClick={() => setShowAddHallModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Hall
                    </button>
                  </div>

                  {showAddHallModal && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Add New Hall</h3>
                        <button onClick={() => setShowAddHallModal(false)} className="text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <AddHall onSuccess={() => setShowAddHallModal(false)} />
                    </div>
                  )}

                  {halls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {halls.map((hall) => (
                        <HallCard
                          key={hall._id}
                          hallId={hall._id}
                          hallName={hall.name}
                          location={hall.location}
                          normalSittingCapacity={hall.normalSittingCapacity}
                          vipSittingCapacity={hall.vipSittingCapacity}
                          premiumSittingCapacity={hall.premiumSittingCapacity}
                          normalSeatPrice={hall.normalSeatPrice}
                          vipSeatPrice={hall.vipSeatPrice}
                          premiumSeatPrice={hall.premiumSeatPrice}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <p className="text-gray-500">No halls available. Add your first hall!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Shows Management */}
              {activeSection === 'shows' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Shows Management</h2>
                    <button
                      onClick={() => setShowAddShowModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Show
                    </button>
                  </div>

                  {showAddShowModal && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Add New Show</h3>
                        <button onClick={() => setShowAddShowModal(false)} className="text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <AddShow onSuccess={() => setShowAddShowModal(false)} />
                    </div>
                  )}

                  {shows.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shows.map((show) => (
                        <ShowCard
                          key={show._id}
                          showId={show._id}
                          showName={show.showName}
                          timing={show.timing}
                          length={show.length}
                          description={show.description}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <p className="text-gray-500">No shows available. Add your first show!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Management */}
              {activeSection === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings Management</h2>
                  
                  {tickets.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Show</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map((ticket) => (
                              <tr key={ticket._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{ticket._id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {ticket.show?.showName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {ticket.user?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {ticket.seats?.length || 0} seats
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{ticket.totalPrice || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    ticket.status === 'booked' ? 'bg-green-100 text-green-800' :
                                    ticket.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {ticket.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <p className="text-gray-500">No bookings available yet.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;