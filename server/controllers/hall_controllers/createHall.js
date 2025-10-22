import Hall from "../../models/hall_model.js";
import Seat from "../../models/seat_model.js";
const createHall = async (req, res) => {
    try {
        const { name, location, normalSittingCapacity, vipSittingCapacity, premiumSittingCapacity, amenities, normalSeatPrice, vipSeatPrice, premiumSeatPrice } = req.body;

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
        let counter = 1;
        Array.from({ length: normalSittingCapacity }, (_, i) => i + 1).forEach(seatNo => {
            Seat.create({
                seatNo: String(counter++),
                seatType: 'Regular',
                hall: newHall._id
            });
        });
        Array.from({ length: vipSittingCapacity }, (_, i) => i + 1).forEach(seatNo => {
            Seat.create({
                seatNo: String(counter++),
                seatType: 'VIP',
                hall: newHall._id
            });
        });
        Array.from({ length: premiumSittingCapacity }, (_, i) => i + 1).forEach(seatNo => {
            Seat.create({
                seatNo: String(counter++),
                seatType: 'Premium',
                hall: newHall._id
            });
        });
        res.status(201).json({ message: 'Hall created successfully', hall: newHall });
    } catch (error) {
        console.error('Error creating hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default createHall; 