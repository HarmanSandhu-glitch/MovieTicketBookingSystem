import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTickets, selectUserTickets, selectTicketStatus } from '../features/tickets/ticketSlice';
import { selectUser } from '../features/auth/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const tickets = useSelector(selectUserTickets);
    const ticketStatus = useSelector(selectTicketStatus);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserTickets(user.id));
        }
    }, [user, dispatch]);

    if (!user) {
        return <div>Please log in to see your profile.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
            {ticketStatus === 'loading' && <p>Loading your tickets...</p>}
            {ticketStatus === 'succeeded' && tickets.length > 0 ? (
                <div className="space-y-4">
                    {tickets.map(ticket => (
                        <Card key={ticket._id}>
                            <CardHeader>
                                {/* Assuming show details need to be populated from the backend */}
                                <CardTitle>Show: {ticket.show.showName || 'Details Unavailable'}</CardTitle>
                                <CardDescription>
                                    Purchased on: {new Date(ticket.purchaseDate).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Status:</strong> <span className="capitalize">{ticket.status}</span></p>
                                <p><strong>Total Price:</strong> ${ticket.totalPrice}</p>
                                <p><strong>Seats:</strong> {ticket.seats.length} (Details need population)</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                ticketStatus === 'succeeded' && <p>You haven't booked any tickets yet.</p>
            )}
            {ticketStatus === 'failed' && <p>Could not load your tickets.</p>}
        </div>
    );
};

export default ProfilePage;
