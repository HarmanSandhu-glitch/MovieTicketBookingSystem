import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHalls, selectAllHalls, selectHallStatus } from '../features/halls/hallSlice';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card"


const HomePage = () => {
    const dispatch = useDispatch();
    const halls = useSelector(selectAllHalls);
    const status = useSelector(selectHallStatus);

    useEffect(() => {
        // We fetch halls only if they haven't been fetched yet.
        if (status === 'idle') {
            dispatch(fetchHalls());
        }
    }, [status, dispatch]);

    let content;
    if (status === 'loading') {
        content = <p>Loading halls...</p>;
    } else if (status === 'succeeded') {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {halls.map((hall) => (
                    <Link to={`/hall/${hall._id}`} key={hall._id}>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{hall.name}</CardTitle>
                                <CardDescription>{hall.location}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    } else if (status === 'failed') {
        content = <p>Error loading halls.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Available Halls</h1>
            {content}
        </div>
    );
};

export default HomePage;
