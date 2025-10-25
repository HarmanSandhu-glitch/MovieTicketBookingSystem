import Hall from '../../models/hall_model.js';
const getAllHalls = (req, res) => {
    try {
        Hall.find()
            .then(halls => {
                res.status(200).json(halls);
            })
            .catch(error => {
                console.error('Error fetching halls:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error fetching halls:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getAllHalls;