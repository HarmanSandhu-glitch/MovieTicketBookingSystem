import Show from "../../models/show_model.js";

const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find();
        res.status(200).json(shows);
    } catch (error) {
        console.error('Error fetching shows:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getAllShows;