import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShowById } from '../feautres/shows/showsSlice';
import { getHallById } from '../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '../components/general/Button';

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const showsState = useSelector((state) => state.shows);
  const hallsState = useSelector((state) => state.halls);
  const { user } = useSelector((state) => state.auth);
  
  const selectedShow = showsState?.selectedShow || showsState?.currentShow;
  const showLoading = showsState?.isLoading || false;
  const showError = showsState?.isError || false;
  const showMessage = showsState?.message || '';
  
  const selectedHall = hallsState?.selectedHall || hallsState?.currentHall;
  const hallLoading = hallsState?.isLoading || false;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch show details
  useEffect(() => {
    if (id) {
      dispatch(getShowById(id));
    }
  }, [dispatch, id]);

  // Fetch hall details when show is loaded
  useEffect(() => {
    if (selectedShow && selectedShow.hall) {
      dispatch(getHallById(selectedShow.hall._id || selectedShow.hall));
    }
  }, [dispatch, selectedShow]);

  // Fetch seats for the hall
  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedShow && selectedShow.hall) {
        setSeatsLoading(true);
        try {
          const hallId = selectedShow.hall._id || selectedShow.hall;
          
          // Fetch all seats for the hall
          const response = await axios.get(`http://localhost:5000/api/seats/hall/${hallId}`);
          
          if (!response.data || response.data.length === 0) {
            // If no seats exist, try to create them
            console.log('No seats found, attempting to create seats for hall:', hallId);
            try {
              const createResponse = await axios.post(`http://localhost:5000/api/seats/hall/${hallId}/create`);
              console.log('Seats created:', createResponse.data);
              
              // Fetch the newly created seats
              const newSeatsResponse = await axios.get(`http://localhost:5000/api/seats/hall/${hallId}`);
              
              // Check booking status for each seat
              const seatsWithStatus = await Promise.all(
                newSeatsResponse.data.map(async (seat) => {
                  try {
                    const statusResponse = await axios.get(`http://localhost:5000/api/seats/${seat._id}/${id}`);
                    return {
                      ...seat,
                      isBooked: statusResponse.data.isSeatBooked || false
                    };
                  } catch (error) {
                    console.error('Error checking seat status:', error);
                    return {
                      ...seat,
                      isBooked: false
                    };
                  }
                })
              );
              
              setSeats(seatsWithStatus);
            } catch (createError) {
              console.error('Error creating seats:', createError);
              toast.error('Failed to initialize seats for this hall');
              setSeats([]);
            }
          } else {
            // Check booking status for each existing seat
            const seatsWithStatus = await Promise.all(
              response.data.map(async (seat) => {
                try {
                  const statusResponse = await axios.get(`http://localhost:5000/api/seats/${seat._id}/${id}`);
                  return {
                    ...seat,
                    isBooked: statusResponse.data.isSeatBooked || false
                  };
                } catch (error) {
                  console.error('Error checking seat status:', error);
                  return {
                    ...seat,
                    isBooked: false
                  };
                }
              })
            );
            
            setSeats(seatsWithStatus);
          }
        } catch (error) {
          console.error('Error fetching seats:', error);
          toast.error('Failed to fetch seats');
          setSeats([]);
        } finally {
          setSeatsLoading(false);
        }
      }
    };

    fetchSeats();
  }, [selectedShow, id]);

  useEffect(() => {
    if (showError && showMessage) {
      toast.error(showMessage);
    }
  }, [showError, showMessage]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked || !seat.isAvailable) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s._id === seat._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== seat._id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBookTickets = async () => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/signin');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBookingInProgress(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tickets/generate',
        {
          show: id,
          seats: selectedSeats.map((seat) => seat._id),
          user: user._id
        },
        { withCredentials: true }
      );

      toast.success('Tickets booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setBookingInProgress(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedHall) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      let price = 0;
      if (seat.seatType === 'Regular') {
        price = selectedHall.normalSeatPrice;
      } else if (seat.seatType === 'VIP') {
        price = selectedHall.vipSeatPrice;
      } else if (seat.seatType === 'Premium') {
        price = selectedHall.premiumSeatPrice;
      }
      return total + price;
    }, 0);
  };

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.find((s) => s._id === seat._id);
    
    if (seat.isBooked || !seat.isAvailable) {
      return 'bg-red-500 cursor-not-allowed';
    } else if (isSelected) {
      return 'bg-blue-500 cursor-pointer hover:bg-blue-600';
    } else {
      return 'bg-green-500 cursor-pointer hover:bg-green-600';
    }
  };

  const groupSeatsByType = (seats) => {
    return seats.reduce((acc, seat) => {
      if (!acc[seat.seatType]) {
        acc[seat.seatType] = [];
      }
      acc[seat.seatType].push(seat);
      return acc;
    }, {});
  };

  if (showLoading || hallLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedShow) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <svg
          className="w-24 h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p className="text-gray-500 text-lg mb-4">Show not found</p>
        <Link
          to="/shows"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shows
        </Link>
      </div>
    );
  }

  const groupedSeats = groupSeatsByType(seats);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/shows" className="hover:text-blue-600">Shows</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{selectedShow.showName}</span>
        </nav>

        {/* Show Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">{selectedShow.showName}</h1>
                <div className="space-y-2 text-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(selectedShow.timing).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedShow.length} minutes</span>
                  </div>
                  {selectedHall && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{selectedHall.name} - {selectedHall.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Link
                to="/shows"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{selectedShow.description}</p>
          </div>
        </div>

        {/* Seat Selection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h2>

          {/* Screen */}
          <div className="mb-8">
            <div className="bg-gray-800 text-white text-center py-3 rounded-t-3xl shadow-lg">
              SCREEN
            </div>
            <div className="h-2 bg-linear-to-b from-gray-300 to-transparent"></div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              <span className="text-gray-700">Booked</span>
            </div>
          </div>

          {/* Seats Grid */}
          {seatsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : seats.length > 0 ? (
            <div className="space-y-8">
              {['Regular', 'VIP', 'Premium'].map((type) => {
                const typeSeats = groupedSeats[type] || [];
                if (typeSeats.length === 0) return null;

                return (
                  <div key={type} className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {type} Seats
                      {selectedHall && (
                        <span className="ml-3 text-sm font-normal text-gray-600">
                          (₹
                          {type === 'Regular' ? selectedHall.normalSeatPrice :
                           type === 'VIP' ? selectedHall.vipSeatPrice :
                           selectedHall.premiumSeatPrice})
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                      {typeSeats.map((seat) => (
                        <button
                          key={seat._id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.isBooked || !seat.isAvailable}
                          className={`${getSeatColor(seat)} text-white text-xs font-semibold py-3 px-2 rounded transition-all transform hover:scale-105`}
                          title={`${seat.seatNo} - ${seat.isBooked ? 'Booked' : seat.isAvailable ? 'Available' : 'Not Available'}`}
                        >
                          {seat.seatNo}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No seats available</p>
          )}
        </div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 sticky bottom-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selected Seats ({selectedSeats.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat._id}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {seat.seatNo}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ₹{calculateTotal()}
                </div>
                <Button
                  onClick={handleBookTickets}
                  disabled={bookingInProgress}
                  variant="primary"
                  loading={bookingInProgress}
                >
                  {bookingInProgress ? 'Booking...' : 'Book Tickets'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetails;