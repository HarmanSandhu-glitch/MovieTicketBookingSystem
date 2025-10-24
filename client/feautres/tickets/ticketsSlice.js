import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tickets';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

// Generate Ticket (Authenticated users only)
export const generateTicket = createAsyncThunk(
  'tickets/generate',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/generate`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate ticket'
      );
    }
  }
);

// Get All Tickets (Authenticated users only)
export const getAllTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tickets'
      );
    }
  }
);

// Get User Tickets (Authenticated users only)
export const getUserTickets = createAsyncThunk(
  'tickets/getUserTickets',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user tickets'
      );
    }
  }
);

// Update Ticket Status (Authenticated users only)
export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update-status`, statusData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update ticket status'
      );
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    userTickets: [],
    currentTicket: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetTickets: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Ticket
      .addCase(generateTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(generateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTicket = action.payload;
        state.tickets.push(action.payload);
        state.userTickets.push(action.payload);
      })
      .addCase(generateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Tickets
      .addCase(getAllTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get User Tickets
      .addCase(getUserTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getUserTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userTickets = action.payload;
      })
      .addCase(getUserTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Ticket Status
      .addCase(updateTicketStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update in tickets array
        const ticketIndex = state.tickets.findIndex(
          (ticket) => ticket._id === action.payload._id
        );
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex] = action.payload;
        }
        // Update in userTickets array
        const userTicketIndex = state.userTickets.findIndex(
          (ticket) => ticket._id === action.payload._id
        );
        if (userTicketIndex !== -1) {
          state.userTickets[userTicketIndex] = action.payload;
        }
        // Update current ticket if it matches
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTickets, clearCurrentTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;