import Ticket from '../../models/ticket_model.js';
const updateTicketStatus = (req, res) => {
    const { ticketId } = req.params;
    const { status } = req.body;

    Ticket.findByIdAndUpdate(ticketId, { status }, { new: true })
        .then(updatedTicket => {
            if (!updatedTicket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.status(200).json({ ticket: updatedTicket });
        })
        .catch(error => {
            console.error('Error updating ticket status:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        });
}

export default updateTicketStatus;