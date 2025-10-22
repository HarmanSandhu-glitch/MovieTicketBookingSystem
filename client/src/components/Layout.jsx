import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import { Button } from './ui/button';

const Layout = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-primary-foreground p-4">
                <nav className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">MovieTime</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/"><Button variant="ghost">Home</Button></Link>
                        {user ? (
                            <>
                                <span>Hello, {user.name}</span>
                                <Button variant="secondary" onClick={() => dispatch(logout())}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/signin"><Button variant="secondary">Sign In</Button></Link>
                                <Link to="/signup"><Button variant="secondary">Sign Up</Button></Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
            <footer className="text-center p-4 bg-muted text-muted-foreground">
                &copy; 2025 Movie Booking System
            </footer>
        </div>
    );
};

export default Layout;