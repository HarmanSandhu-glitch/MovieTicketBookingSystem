import Show from '../../models/show_model.js';
const getShow = (req, res) => {
    try {
        const showId = req.params.id;

        Show.findById(showId)
            .then(show => {
                if (!show) {
                    return res.status(404).json({ message: 'Show not found' });
                }
                res.status(200).json({ show });
            })
            .catch(error => {
                console.error('Error fetching show:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error fetching show:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getShow;