const updateShow = (req, res) => {
    try {
        const showId = req.params.id;
        const { showName, timing, length, description, status } = req.body;
        const updateData = {};
        if (showName !== undefined) updateData.showName = showName;
        if (timing !== undefined) updateData.timing = timing;
        if (length !== undefined) updateData.length = length;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;

        updateData.updatedAt = Date.now();

        Show.findByIdAndUpdate(showId, updateData, { new: true })
            .then(updatedShow => {
                if (!updatedShow) {
                    return res.status(404).json({ message: 'Show not found' });
                }
                res.status(200).json(updatedShow);
            })
            .catch(error => {
                console.error('Error updating show:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error updating show:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default updateShow;