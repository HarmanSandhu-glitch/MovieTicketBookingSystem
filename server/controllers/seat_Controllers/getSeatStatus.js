import Ticket from "../../models/ticket_model.js";
import Seat from "../../models/seat_model.js";

const getSeatStatus = async (req, res) => {
    try {
        const { seatId, showId } = req.params;
        
        // Find the seat
        const seat = await Seat.findById(seatId);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        
        // Check if the seat is booked for this specific show
        const ticket = await Ticket.findOne({ 
            seats: seatId, 
            show: showId,
            status: { $in: ['booked', 'confirmed'] }
        });
        
        const isSeatBooked = ticket ? true : false;
        
        res.status(200).json({ 
            seat,
            isSeatBooked,
            isAvailable: seat.isAvailable && !isSeatBooked
        });
    } catch (error) {
        console.error('Error fetching seat status:', error);
        res.status(500).json({ 
            message: 'Server error while checking seat status', 
            error: error.message 
        });
    }
}

export default getSeatStatus;
