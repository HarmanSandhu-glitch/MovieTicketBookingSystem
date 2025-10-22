import Show from "../../models/show_model.js";
const createShow = async (req, res) => {
    try {
        const hallId = req.body.hallId;
        const { showName, timing, length, description } = req.body;

        const newShow = await Show.create({
            showName,
            timing,
            length,
            description,
            hall: hallId
        });
        res.status(201).json({ message: 'Show created successfully', show: newShow });
    } catch (error) {
        console.error('Error creating show:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default createShow;