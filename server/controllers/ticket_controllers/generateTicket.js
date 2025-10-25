import Ticket from '../../models/ticket_model.js';
import Show from '../../models/show_model.js';
import Hall from '../../models/hall_model.js';
import Seat from '../../models/seat_model.js';

const generateTicket = async (req, res) => {
    try {
        const { user, show, seats } = req.body;

        // Validate required fields
        if (!user || !show || !seats || seats.length === 0) {
            return res.status(400).json({ 
                message: 'Missing required fields: user, show, and seats are required' 
            });
        }

        // Fetch the show and populate hall
        const showData = await Show.findById(show).populate('hall');
        if (!showData) {
            return res.status(404).json({ message: 'Show not found' });
        }

        const hall = showData.hall;
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found for this show' });
        }

        // Fetch seat details
        const seatDetails = await Seat.find({ _id: { $in: seats } });
        if (seatDetails.length !== seats.length) {
            return res.status(404).json({ message: 'Some seats not found' });
        }

        // Check if any seats are already booked for this show
        const existingBookings = await Ticket.find({
            show: show,
            seats: { $in: seats },
            status: { $in: ['booked', 'confirmed'] }
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ 
                message: 'Some seats are already booked for this show' 
            });
        }

        // Calculate total price based on seat types
        let totalPrice = 0;
        seatDetails.forEach(seat => {
            if (seat.seatType === 'Regular') {
                totalPrice += hall.normalSeatPrice;
            } else if (seat.seatType === 'VIP') {
                totalPrice += hall.vipSeatPrice;
            } else if (seat.seatType === 'Premium') {
                totalPrice += hall.premiumSeatPrice;
            }
        });

        // Create the ticket
        const newTicket = await Ticket.create({
            owner: user,
            show: show,
            hall: hall._id,
            seats: seats,
            totalPrice: totalPrice,
            status: 'booked'
        });

        // Populate the ticket data before sending response
        const populatedTicket = await Ticket.findById(newTicket._id)
            .populate('owner', 'name email')
            .populate('show', 'showName timing')
            .populate('hall', 'name location')
            .populate('seats', 'seatNo seatType');

        res.status(201).json({
            message: 'Ticket booked successfully',
            ticket: populatedTicket
        });
    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).json({ 
            message: 'Server error while booking ticket', 
            error: error.message 
        });
    }
}

export default generateTicket;