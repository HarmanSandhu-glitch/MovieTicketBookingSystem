import Show from '../../models/show_model.js';

const getHallShow = async (req, res) => {
    try {
        const hallId = req.params.id;

        const shows = await Show.find({ hall: hallId });
        console.log('Fetched shows for hall:', hallId, shows);
        res.status(200).json(shows);
    } catch (error) {
        console.error('Error fetching shows for hall:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getHallShow;