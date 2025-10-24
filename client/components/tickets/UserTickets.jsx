import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTickets, resetTickets } from '../../feautres/tickets/ticketsSlice';
import { toast } from 'react-toastify';
import TicketCard from './TicketCard';

const UserTickets = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userTickets, isLoading, isError, message } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserTickets(user._id));
    }

    return () => {
      dispatch(resetTickets());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-700 font-medium">Please sign in to view your tickets</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 font-medium">{message || 'Failed to load tickets'}</p>
        </div>
      </div>
    );
  }

  if (!userTickets || userTickets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Tickets</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tickets Found</h3>
          <p className="text-gray-500 mb-4">You haven't booked any tickets yet.</p>
          <button
            onClick={() => window.location.href = '/shows'}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Shows
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Tickets</h2>
        <p className="text-gray-600">You have {userTickets.length} ticket{userTickets.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userTickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticketId={ticket._id}
            showName={ticket.showName || 'Show Name'}
            showTiming={ticket.showTiming || ticket.timing}
            seats={ticket.seats || []}
            status={ticket.status}
            price={ticket.price || ticket.totalPrice}
            onClick={() => {
              // Handle ticket click - could navigate to ticket details
              console.log('Ticket clicked:', ticket._id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserTickets;