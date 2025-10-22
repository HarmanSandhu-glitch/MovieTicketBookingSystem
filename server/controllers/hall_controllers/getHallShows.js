import Show from '../../models/show_model.js';

const getHallShow = (req, res) => {
    try {
        const hallId = req.params.id;

        Show.find({ hall: hallId })
            .then(shows => {
                res.status(200).json({ shows });
            })
            .catch(error => {
                console.error('Error fetching shows for hall:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error fetching shows for hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getHallShow;