import Seat from "../../models/seat_model.js";

const getHallSeats = async (req, res) => {
    try {
        const hallId = req.params.hallId;
        
        const seats = await Seat.find({ hall: hallId }).sort({ seatNo: 1 });
        
        if (!seats || seats.length === 0) {
            return res.status(404).json({ 
                message: 'No seats found for this hall',
                seats: []
            });
        }
        
        res.status(200).json(seats);
    } catch (error) {
        console.error('Error fetching hall seats:', error);
        res.status(500).json({ 
            message: 'Server error while fetching seats', 
            error: error.message 
        });
    }
}

export default getHallSeats;
