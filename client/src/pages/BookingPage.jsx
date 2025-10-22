import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowById, selectCurrentShow, selectShowStatus, clearCurrentShow } from '../features/shows/showSlice';
import { generateTicket, selectTicketStatus } from '../features/tickets/ticketSlice';
import { selectUser } from '../features/auth/authSlice';
import { Button } from '../components/ui/button';
import SeatMatrix from '../components/Booking/SeatMatrix';

const BookingPage = () => {
    const { showId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const show = useSelector(selectCurrentShow);
    const showStatus = useSelector(selectShowStatus);
    const user = useSelector(selectUser);
    const ticketStatus = useSelector(selectTicketStatus);

    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        dispatch(fetchShowById(showId));

        // Cleanup function to clear the show data when component unmounts
        return () => {
            dispatch(clearCurrentShow());
        }
    }, [showId, dispatch]);

    const handleSeatSelect = (seatId) => {
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
        );
    };

    const handleBooking = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        const bookingData = {
            userId: user.id,
            showId: show._id,
            seats: selectedSeats,
        };
        dispatch(generateTicket(bookingData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                alert('Booking successful!');
                navigate('/profile');
            } else {
                alert('Booking failed. Please try again.');
            }
        });
    };

    if (showStatus === 'loading' || !show) {
        return <div>Loading show details...</div>;
    }

    if (showStatus === 'failed') {
        return <div>Error loading show details.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">{show.showName}</h1>
            <p className="text-lg text-muted-foreground mb-4">{new Date(show.timing).toLocaleString()}</p>
            <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-center text-2xl font-semibold mb-6">Select Your Seats</h2>
                {/* The SeatMatrix component will need the hall ID from the show */}
                <SeatMatrix hallId={show.hall} onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />

                <div className="mt-6 flex flex-col items-center">
                    <p className="text-lg mb-4">
                        You have selected {selectedSeats.length} seat(s).
                    </p>
                    <Button
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0 || ticketStatus === 'loading'}
                        size="lg"
                    >
                        {ticketStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
