import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    tickets: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk to generate a new ticket
export const generateTicket = createAsyncThunk(
    'tickets/generateTicket',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/tickets/generate', bookingData);
            return response.data.ticket;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async thunk to fetch tickets for a specific user
export const fetchUserTickets = createAsyncThunk(
    'tickets/fetchUserTickets',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/tickets/user/${userId}`);
            return response.data.tickets;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Cases for generating a ticket
            .addCase(generateTicket.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(generateTicket.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tickets.push(action.payload); // Add new ticket to the list
            })
            .addCase(generateTicket.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Cases for fetching user tickets
            .addCase(fetchUserTickets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tickets = action.payload;
            })
            .addCase(fetchUserTickets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    },
});

export const selectUserTickets = (state) => state.tickets.tickets;
export const selectTicketStatus = (state) => state.tickets.status;

export default ticketSlice.reducer;
