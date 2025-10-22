import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInUser, selectAuthStatus, selectAuthError } from '../../features/auth/authSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authStatus !== 'loading') {
            dispatch(signInUser({ email, password }));
        }
    };

    useEffect(() => {
        if (authStatus === 'succeeded') {
            navigate('/'); // Redirect to home on successful login
        }
    }, [authStatus, navigate]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {authStatus === 'failed' && (
                <p className="text-sm text-destructive">{authError}</p>
            )}
            <Button type="submit" className="w-full" disabled={authStatus === 'loading'}>
                {authStatus === 'loading' ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    );
};

export default SignInForm;