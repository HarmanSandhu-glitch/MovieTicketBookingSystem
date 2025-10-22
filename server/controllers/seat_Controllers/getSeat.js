import Ticket from "../../models/ticket_model.js";
import Seat from "../../models/seat_model.js";

const getSeat = (req, res) => {
    try {
        const seatId = req.params.id;
        const showId = req.params.showId;
        let isSeatBooked = false;

        Ticket.findOne({ seats: seatId, status: "booked", show: showId })
            .then(ticket => {
                if (ticket) {
                    isSeatBooked = true;
                }
            });
        const seat = Seat.findById(seatId);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }
        res.status(200).json({ seat, isSeatBooked });
    } catch (error) {
        console.error('Error fetching seat information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getSeat;