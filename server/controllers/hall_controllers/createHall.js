import Hall from "../../models/hall_model.js";
import Seat from "../../models/seat_model.js";

const createHall = async (req, res) => {
    try {
        const { 
            name, 
            location, 
            normalSittingCapacity, 
            vipSittingCapacity, 
            premiumSittingCapacity, 
            amenities, 
            normalSeatPrice, 
            vipSeatPrice, 
            premiumSeatPrice 
        } = req.body;

        // Create the hall
        const newHall = await Hall.create({
            name,
            location,
            normalSittingCapacity,
            vipSittingCapacity,
            premiumSittingCapacity,
            amenities,
            normalSeatPrice,
            vipSeatPrice,
            premiumSeatPrice
        });

        // Create seats for the hall
        const seats = [];
        
        // Create Regular seats with prefix 'R'
        for (let i = 1; i <= normalSittingCapacity; i++) {
            seats.push({
                seatNo: `R${i}`,
                seatType: 'Regular',
                hall: newHall._id,
                isAvailable: true
            });
        }
        
        // Create VIP seats with prefix 'V'
        for (let i = 1; i <= vipSittingCapacity; i++) {
            seats.push({
                seatNo: `V${i}`,
                seatType: 'VIP',
                hall: newHall._id,
                isAvailable: true
            });
        }
        
        // Create Premium seats with prefix 'P'
        for (let i = 1; i <= premiumSittingCapacity; i++) {
            seats.push({
                seatNo: `P${i}`,
                seatType: 'Premium',
                hall: newHall._id,
                isAvailable: true
            });
        }
        
        // Insert all seats at once for better performance
        await Seat.insertMany(seats);
        
        console.log(`Created ${seats.length} seats for hall: ${newHall.name}`);
        
        res.status(201).json({ 
            message: 'Hall and seats created successfully', 
            hall: newHall,
            seatsCreated: seats.length
        });
    } catch (error) {
        console.error('Error creating hall:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}

export default createHall; 