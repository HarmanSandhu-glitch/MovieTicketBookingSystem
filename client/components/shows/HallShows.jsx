import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHallShows } from '../../feautres/shows/showsSlice';
import ShowCard from './ShowCard';

function HallShows({ _hallId }) {
  const dispatch = useDispatch();
  const { hallShows, isLoading, isError, message } = useSelector((state) => state.shows);
  const fetchedRef = useRef(false);

  console.log('HallShows rendered with:', hallShows);

  useEffect(() => {
    console.log('Effect running, fetchedRef.current:', fetchedRef.current);

    // Reset fetchedRef when hallId changes
    fetchedRef.current = false;

    if (_hallId) {
      console.log('Dispatching getHallShows for hallId:', _hallId);
      dispatch(getHallShows(_hallId));
      fetchedRef.current = true;
    }
  }, [_hallId, dispatch]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="text-red-700 font-medium">{message || 'Failed to load shows'}</p>
      </div>
    );
  }

  if (!hallShows || hallShows.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Shows Found</h3>
        <p className="text-gray-500">There are currently no shows scheduled for this hall.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        Shows ({hallShows.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hallShows.map((show) => (
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
    </div>
  );
}

export default HallShows;