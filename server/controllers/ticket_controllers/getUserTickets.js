import Ticket from '../../models/ticket_model.js';

const getUserTickets = (req, res) => {
    try {
        const userId = req.params.userId;
        Ticket.find({ userId })
            .populate('userId')
            .populate('movieId')
            .populate('showId')
            .then(tickets => {
                res.status(200).json(tickets);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            });
    } catch (error) {
        console.error('Error in getAllTickets controller:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default getUserTickets;