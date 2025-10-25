import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/seats';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

// Get Seat by ID
export const getSeatById = createAsyncThunk(
  'seats/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seat'
      );
    }
  }
);

// Get all seats for a hall
export const getHallSeats = createAsyncThunk(
  'seats/getHallSeats',
  async (hallId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/hall/${hallId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch hall seats'
      );
    }
  }
);

// Get seat status for a specific show
export const getSeatStatus = createAsyncThunk(
  'seats/getSeatStatus',
  async ({ seatId, showId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${seatId}/${showId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seat status'
      );
    }
  }
);

// Create seats for a hall
export const createSeatsForHall = createAsyncThunk(
  'seats/createSeatsForHall',
  async (hallId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/hall/${hallId}/create`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create seats'
      );
    }
  }
);

const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
    hallSeats: [],
    currentSeat: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetSeats: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentSeat: (state) => {
      state.currentSeat = null;
    },
    clearHallSeats: (state) => {
      state.hallSeats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Seat by ID
      .addCase(getSeatById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getSeatById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSeat = action.payload;
        // Add to seats array if not already present
        const exists = state.seats.some(
          (seat) => seat._id === action.payload._id
        );
        if (!exists) {
          state.seats.push(action.payload);
        }
      })
      .addCase(getSeatById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Hall Seats
      .addCase(getHallSeats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getHallSeats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hallSeats = action.payload;
      })
      .addCase(getHallSeats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.hallSeats = [];
      })
      // Get Seat Status
      .addCase(getSeatStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getSeatStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSeat = action.payload;
      })
      .addCase(getSeatStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Seats for Hall
      .addCase(createSeatsForHall.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createSeatsForHall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hallSeats = action.payload.seats || [];
        state.message = action.payload.message;
      })
      .addCase(createSeatsForHall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetSeats, clearCurrentSeat, clearHallSeats } = seatSlice.actions;
export default seatSlice.reducer;