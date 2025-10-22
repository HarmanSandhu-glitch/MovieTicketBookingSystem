import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import hallReducer from '../features/halls/hallSlice';
import showReducer from '../features/shows/showSlice';
import ticketReducer from '../features/tickets/ticketSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        halls: hallReducer,
        shows: showReducer,
        tickets: ticketReducer,
    },
});