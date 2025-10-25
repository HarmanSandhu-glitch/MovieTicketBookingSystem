import Ticket from '../../models/ticket_model.js';

const generateTicket = (req, res) => {
    const { userId, showId, seats } = req.body;

    const newTicket = new Ticket({
        owner: userId,
        show: showId,
        seats: seats
    });
    newTicket.save()
        .then(ticket => {
            res.status(201).json(ticket);
        })
        .catch(error => {
            console.error('Error generating ticket:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        });
}

export default generateTicket;