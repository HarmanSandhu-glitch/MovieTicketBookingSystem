import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShows } from '../feautres/shows/showsSlice';
import { toast } from 'react-toastify';
import ShowCard from '../components/shows/ShowCard';

const Shows = () => {
  const dispatch = useDispatch();
  const showsState = useSelector((state) => state.shows);
  
  // Extract shows array safely
  const shows = Array.isArray(showsState?.shows) ? showsState.shows : [];
  const isLoading = showsState?.isLoading || false;
  const isError = showsState?.isError || false;
  const message = showsState?.message || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, upcoming, past

  useEffect(() => {
    dispatch(getAllShows());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  useEffect(() => {
    console.log('Fetched shows:', shows);
  }, [shows]);

  // Filter shows by search query and date
  const filteredShows = shows.filter((show) => {
    const matchesSearch = show.showName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          show.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const showDate = new Date(show.timing);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = showDate >= today && showDate < tomorrow;
    } else if (dateFilter === 'upcoming') {
      matchesDate = showDate >= tomorrow;
    } else if (dateFilter === 'past') {
      matchesDate = showDate < today;
    }

    return matchesSearch && matchesDate;
  });

  // Sort shows by timing (newest first)
  const sortedShows = [...filteredShows].sort((a, b) => new Date(b.timing) - new Date(a.timing));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Shows</h1>
          <p className="text-gray-600">Browse and book tickets for your favorite movies</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search shows by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter('all')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  dateFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  dateFilter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('upcoming')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  dateFilter === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setDateFilter('past')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                  dateFilter === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedShows.length} of {shows.length} shows
          </div>
        </div>

        {/* Shows Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : sortedShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedShows.map((show) => (
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
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-gray-500 text-lg">No shows found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shows;