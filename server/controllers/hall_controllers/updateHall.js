import Hall from "../../models/hall_model.js";
import Seat from "../../models/seat_model.js";

const updateHall = async (req, res) => {
    try {
        const hallId = req.params.id;
        const updateData = req.body;
        // check presence of capacity fields explicitly (handles 0 values correctly)
        if ('normalSittingCapacity' in updateData || 'vipSittingCapacity' in updateData || 'premiumSittingCapacity' in updateData) {
            // remove existing seats for the hall and recreate them
            await Seat.deleteMany({ hall: hallId });
            const hall = await Hall.findById(hallId);
            const normalSittingCapacity = ('normalSittingCapacity' in updateData) ? updateData.normalSittingCapacity : hall.normalSittingCapacity;
            const vipSittingCapacity = ('vipSittingCapacity' in updateData) ? updateData.vipSittingCapacity : hall.vipSittingCapacity;
            const premiumSittingCapacity = ('premiumSittingCapacity' in updateData) ? updateData.premiumSittingCapacity : hall.premiumSittingCapacity;

            const seatsToCreate = [];
            let seatCounter = 1;

            for (let i = 0; i < normalSittingCapacity; i++) {
                seatsToCreate.push({ seatNo: String(seatCounter++), seatType: 'Regular', hall: hallId });
            }
            for (let i = 0; i < vipSittingCapacity; i++) {
                seatsToCreate.push({ seatNo: String(seatCounter++), seatType: 'VIP', hall: hallId });
            }
            for (let i = 0; i < premiumSittingCapacity; i++) {
                seatsToCreate.push({ seatNo: String(seatCounter++), seatType: 'Premium', hall: hallId });
            }

            if (seatsToCreate.length > 0) {
                // create seats in bulk to avoid race conditions and improve performance
                await Seat.insertMany(seatsToCreate);
            }
        }
        Hall.findByIdAndUpdate(hallId, updateData, { new: true })
            .then(updatedHall => {
                if (!updatedHall) {
                    return res.status(404).json({ message: 'Hall not found' });
                }
                res.status(200).json({ hall: updatedHall });
            })
            .catch(error => {
                console.error('Error updating hall:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error updating hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default updateHall;