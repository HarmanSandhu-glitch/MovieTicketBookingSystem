import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

// This is a placeholder for actual seat data fetched from the backend.
// In a real app, you would fetch all seats for the given hallId.
const DummySeats = Array.from({ length: 50 }, (_, i) => ({
    _id: `seat_${i + 1}`,
    seatNo: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
    seatType: i < 20 ? 'Regular' : i < 40 ? 'Premium' : 'VIP',
    isReserved: Math.random() > 0.8 // Randomly mark some seats as already reserved
}));


const SeatMatrix = ({ hallId, onSeatSelect, selectedSeats }) => {
    // In a real application, you would make an API call here to fetch seats for the hallId
    // e.g. useEffect(() => { dispatch(fetchSeatsForHall(hallId)) }, [hallId, dispatch])
    // For now, we use dummy data.
    const seats = DummySeats;

    const getSeatColor = (seat) => {
        if (seat.isReserved) return "bg-destructive text-destructive-foreground cursor-not-allowed";
        if (selectedSeats.includes(seat._id)) return "bg-primary text-primary-foreground";
        switch (seat.seatType) {
            case 'Premium': return "bg-yellow-500 hover:bg-yellow-600";
            case 'VIP': return "bg-purple-600 hover:bg-purple-700";
            default: return "bg-secondary hover:bg-secondary/80";
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-foreground text-background text-center py-2 rounded-md mb-6">
                SCREEN
            </div>
            <div className="grid grid-cols-10 gap-2">
                {seats.map(seat => (
                    <Button
                        key={seat._id}
                        variant="outline"
                        className={cn("p-2 h-10 w-10", getSeatColor(seat))}
                        onClick={() => !seat.isReserved && onSeatSelect(seat._id)}
                        disabled={seat.isReserved}
                    >
                        {seat.seatNo}
                    </Button>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-secondary"></div><span>Regular</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span>Premium</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-600"></div><span>VIP</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary"></div><span>Selected</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-destructive"></div><span>Reserved</span></div>
            </div>
        </div>
    );
};

export default SeatMatrix;
