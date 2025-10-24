import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/halls';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

// Create Hall (Admin only)
export const createHall = createAsyncThunk(
  'halls/create',
  async (hallData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, hallData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create hall'
      );
    }
  }
);

// Get All Halls
export const getAllHalls = createAsyncThunk(
  'halls/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch halls'
      );
    }
  }
);

// Get Hall by ID
export const getHallById = createAsyncThunk(
  'halls/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch hall'
      );
    }
  }
);

// Get Hall Shows
export const getHallShows = createAsyncThunk(
  'halls/getShows',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/shows`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch hall shows'
      );
    }
  }
);

// Update Hall (Admin only)
export const updateHall = createAsyncThunk(
  'halls/update',
  async ({ id, hallData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, hallData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update hall'
      );
    }
  }
);

// Delete Hall (Admin only)
export const deleteHall = createAsyncThunk(
  'halls/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}/delete`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete hall'
      );
    }
  }
);

const hallsSlice = createSlice({
  name: 'halls',
  initialState: {
    halls: [],
    currentHall: null,
    hallShows: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetHalls: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentHall: (state) => {
      state.currentHall = null;
      state.hallShows = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Hall
      .addCase(createHall.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createHall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.halls.push(action.payload);
      })
      .addCase(createHall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Halls
      .addCase(getAllHalls.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAllHalls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.halls = action.payload;
      })
      .addCase(getAllHalls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Hall by ID
      .addCase(getHallById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getHallById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentHall = action.payload;
      })
      .addCase(getHallById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Hall Shows
      .addCase(getHallShows.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getHallShows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hallShows = action.payload;
      })
      .addCase(getHallShows.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Hall
      .addCase(updateHall.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateHall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.halls.findIndex(
          (hall) => hall._id === action.payload._id
        );
        if (index !== -1) {
          state.halls[index] = action.payload;
        }
        if (state.currentHall?._id === action.payload._id) {
          state.currentHall = action.payload;
        }
      })
      .addCase(updateHall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Hall
      .addCase(deleteHall.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteHall.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.halls = state.halls.filter((hall) => hall._id !== action.payload.id);
        if (state.currentHall?._id === action.payload.id) {
          state.currentHall = null;
        }
      })
      .addCase(deleteHall.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHalls, clearCurrentHall } = hallsSlice.actions;
export default hallsSlice.reducer;
