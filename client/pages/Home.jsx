import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllShows } from '../feautres/shows/showsSlice';
import { getAllHalls } from '../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import ShowCard from '../components/shows/ShowCard';
import HallCard from '../components/halls/HallCard';

const Home = () => {
  const dispatch = useDispatch();
  const showsState = useSelector((state) => state.shows);
  const hallsState = useSelector((state) => state.halls);
  
  // Extract shows array safely
  const shows = Array.isArray(showsState?.shows) ? showsState.shows : [];
  const showsLoading = showsState?.isLoading || false;
  const showsError = showsState?.isError || false;
  const showsMessage = showsState?.message || '';
  
  // Extract halls array safely
  const halls = Array.isArray(hallsState?.halls) ? hallsState.halls : [];
  const hallsLoading = hallsState?.isLoading || false;
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllShows());
    dispatch(getAllHalls());
  }, [dispatch]);

  useEffect(() => {
    if (showsError && showsMessage) {
      toast.error(showsMessage);
    }
  }, [showsError, showsMessage]);

  // Filter shows by search query
  const filteredShows = shows.filter((show) =>
    show.showName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize shows
  const newReleases = filteredShows.slice(0, 4);
  const upcomingShows = filteredShows
    .filter((show) => new Date(show.timing) > new Date())
    .slice(0, 4);
  const featuredHalls = halls.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Welcome to MovieTicket
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Book your favorite movies with ease
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* New Releases Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New Releases</h2>
            <Link
              to="/shows"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {showsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : newReleases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newReleases.map((show) => (
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
            <p className="text-gray-500 text-center py-8">No shows available</p>
          )}
        </section>

        {/* Featured Halls Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Halls</h2>
            <Link
              to="/halls"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {hallsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredHalls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredHalls.map((hall) => (
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
            <p className="text-gray-500 text-center py-8">No halls available</p>
          )}
        </section>

        {/* Upcoming Shows Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Shows</h2>
            <Link
              to="/shows"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {showsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : upcomingShows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingShows.map((show) => (
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
            <p className="text-gray-500 text-center py-8">No upcoming shows</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;