import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHallById, selectAllHalls } from '../features/halls/hallSlice';
import { fetchShowsForHall, selectShows, selectShowStatus } from '../features/shows/showSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const HallPage = () => {
    const { hallId } = useParams();
    const dispatch = useDispatch();

    // A better way to get the current hall
    const hall = useSelector(state => state.halls.halls.find(h => h._id === hallId));
    const shows = useSelector(selectShows);
    const showStatus = useSelector(selectShowStatus);

    useEffect(() => {
        if (!hall) {
            dispatch(fetchHallById(hallId));
        }
        dispatch(fetchShowsForHall(hallId));
    }, [hallId, dispatch, hall]);

    if (!hall) {
        return <div>Loading hall details...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{hall.name}</h1>
            <p className="text-xl text-muted-foreground mb-8">{hall.location}</p>

            <h2 className="text-3xl font-semibold tracking-tight mb-4">Now Showing</h2>
            {showStatus === 'loading' && <p>Loading shows...</p>}
            {showStatus === 'succeeded' && shows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shows.map(show => (
                        <Card key={show._id}>
                            <CardHeader>
                                <CardTitle>{show.showName}</CardTitle>
                                <CardDescription>{new Date(show.timing).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{show.description}</p>
                                <Link to={`/book/${show._id}`}>
                                    <Button className="w-full">Book Tickets</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                showStatus === 'succeeded' && <p>No shows currently scheduled for this hall.</p>
            )}
        </div>
    );
};

export default HallPage;
