import Hall from '../../models/hall_model.js';
const getHallById = (req, res) => {
    try {
        const hallId = req.params.id;

        Hall.findById(hallId)
            .then(hall => {
                if (!hall) {
                    return res.status(404).json({ message: 'Hall not found' });
                }
                res.status(200).json({ hall });
            })
            .catch(error => {
                console.error('Error fetching hall:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error fetching hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getHallById;