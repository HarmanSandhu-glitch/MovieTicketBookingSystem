import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHalls } from '../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import HallCard from '../components/halls/HallCard';

const Halls = () => {
  const dispatch = useDispatch();
  const hallsState = useSelector((state) => state.halls);
  const { user } = useSelector((state) => state.auth);
  
  // Extract halls array safely
  const halls = Array.isArray(hallsState?.halls) ? hallsState.halls : [];
  const isLoading = hallsState?.isLoading || false;
  const isError = hallsState?.isError || false;
  const message = hallsState?.message || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    dispatch(getAllHalls());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  // Get unique locations for filter
  const locations = [...new Set(halls.map((hall) => hall.location))];

  // Filter halls by search query and location
  const filteredHalls = halls.filter((hall) => {
    const matchesSearch = hall.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hall.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filterLocation || hall.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Halls</h1>
          <p className="text-gray-600">Browse and explore all available movie halls</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search halls by name or location..."
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

            {/* Location Filter */}
            <div className="relative">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredHalls.length} of {halls.length} halls
          </div>
        </div>

        {/* Halls Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredHalls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHalls.map((hall) => (
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
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 text-lg">No halls found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Halls;