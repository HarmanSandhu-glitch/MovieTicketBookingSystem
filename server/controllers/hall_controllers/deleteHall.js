import Hall from '../../models/hall_model.js';

const deleteHall = (req, res) => {
    try {
        const hallId = req.params.id;

        Hall.findByIdAndDelete(hallId)
            .then(deletedHall => {
                if (!deletedHall) {
                    return res.status(404).json({ message: 'Hall not found' });
                }
                res.status(200).json({ message: 'Hall deleted successfully' });
            })
            .catch(error => {
                console.error('Error deleting hall:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error deleting hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default deleteHall;