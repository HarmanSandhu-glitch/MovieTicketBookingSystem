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

const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
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
      });
  },
});

export const { resetSeats, clearCurrentSeat } = seatSlice.actions;
export default seatSlice.reducer;