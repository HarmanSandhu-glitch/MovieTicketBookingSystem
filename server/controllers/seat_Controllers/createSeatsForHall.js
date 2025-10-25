import Seat from "../../models/seat_model.js";
import Hall from "../../models/hall_model.js";

const createSeatsForHall = async (req, res) => {
    try {
        const hallId = req.params.hallId;
        
        // Find the hall
        const hall = await Hall.findById(hallId);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
        
        // Check if seats already exist for this hall
        const existingSeats = await Seat.find({ hall: hallId });
        if (existingSeats.length > 0) {
            return res.status(400).json({ 
                message: 'Seats already exist for this hall',
                seats: existingSeats
            });
        }
        
        const seats = [];
        let seatNumber = 1;
        
        // Create Regular seats
        for (let i = 0; i < hall.normalSittingCapacity; i++) {
            seats.push({
                hall: hallId,
                seatNo: `R${seatNumber++}`,
                seatType: 'Regular',
                isAvailable: true
            });
        }
        
        // Create VIP seats
        seatNumber = 1;
        for (let i = 0; i < hall.vipSittingCapacity; i++) {
            seats.push({
                hall: hallId,
                seatNo: `V${seatNumber++}`,
                seatType: 'VIP',
                isAvailable: true
            });
        }
        
        // Create Premium seats
        seatNumber = 1;
        for (let i = 0; i < hall.premiumSittingCapacity; i++) {
            seats.push({
                hall: hallId,
                seatNo: `P${seatNumber++}`,
                seatType: 'Premium',
                isAvailable: true
            });
        }
        
        // Insert all seats
        const createdSeats = await Seat.insertMany(seats);
        
        res.status(201).json({
            message: 'Seats created successfully',
            count: createdSeats.length,
            seats: createdSeats
        });
    } catch (error) {
        console.error('Error creating seats:', error);
        res.status(500).json({ 
            message: 'Server error while creating seats', 
            error: error.message 
        });
    }
}

export default createSeatsForHall;
