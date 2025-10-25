import Ticket from "../../models/ticket_model.js";
import Seat from "../../models/seat_model.js";

const getSeat = async (req, res) => {
    try {
        const seatId = req.params.id;
        const showId = req.params.showId;
        
        // Find the seat
        const seat = await Seat.findById(seatId);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        
        let isSeatBooked = false;
        
        // If showId is provided, check if seat is booked for that show
        if (showId) {
            const ticket = await Ticket.findOne({ 
                seats: seatId, 
                show: showId,
                status: { $in: ['booked', 'confirmed'] }
            });
            isSeatBooked = ticket ? true : false;
        }
        
        res.status(200).json({ 
            seat, 
            isSeatBooked,
            isAvailable: seat.isAvailable && !isSeatBooked
        });
    } catch (error) {
        console.error('Error fetching seat information:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}

export default getSeat;