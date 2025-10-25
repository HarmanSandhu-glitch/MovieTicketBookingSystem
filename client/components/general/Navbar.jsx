import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../feautres/auth/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(signOut());
        toast.success('Logged out successfully!');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span className="text-xl font-bold text-gray-800">MovieTicket</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                            Home
                        </Link>
                        <Link to="/halls" className="text-gray-700 hover:text-blue-600 transition">
                            Halls
                        </Link>
                        <Link to="/shows" className="text-gray-700 hover:text-blue-600 transition">
                            Shows
                        </Link>
                        {user && (
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">
                                    Welcome, <span className="font-semibold">{user.name}</span>
                                </span>
                                {user.role === 'admin' && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        Admin
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signin"
                                    className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-3">
                        <Link
                            to="/"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/halls"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Halls
                        </Link>
                        <Link
                            to="/shows"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shows
                        </Link>
                        {user && (
                            <Link
                                to="/dashboard"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="border-t pt-3">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-gray-700">
                                        Welcome, <span className="font-semibold">{user.name}</span>
                                    </div>
                                    {user.role === 'admin' && (
                                        <div className="px-4 py-2">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                Admin
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;