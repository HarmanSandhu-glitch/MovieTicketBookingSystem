const deleteShow = (req, res) => {
    try {
        const showId = req.params.id;

        Show.findByIdAndDelete(showId)
            .then(deletedShow => {
                if (!deletedShow) {
                    return res.status(404).json({ message: 'Show not found' });
                }
                res.status(200).json({ message: 'Show deleted successfully' });
            })
            .catch(error => {
                console.error('Error deleting show:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error deleting show:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default deleteShow;