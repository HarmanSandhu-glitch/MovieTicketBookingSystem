import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shows';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

// Create Show (Admin only)
export const createShow = createAsyncThunk(
  'shows/create',
  async (showData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, showData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create show'
      );
    }
  }
);

// Get All Shows
export const getAllShows = createAsyncThunk(
  'shows/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      console.log('Backend response for getAllShows:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch shows'
      );
    }
  }
);

// Get Show by ID
export const getShowById = createAsyncThunk(
  'shows/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch show'
      );
    }
  }
);

// Update Show (Admin only)
export const updateShow = createAsyncThunk(
  'shows/update',
  async ({ id, showData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, showData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update show'
      );
    }
  }
);

// Delete Show (Admin only)
export const deleteShow = createAsyncThunk(
  'shows/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}/delete`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete show'
      );
    }
  }
);

const showsSlice = createSlice({
  name: 'shows',
  initialState: {
    shows: [],
    currentShow: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetShows: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentShow: (state) => {
      state.currentShow = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Show
      .addCase(createShow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createShow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shows.push(action.payload);
      })
      .addCase(createShow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Shows
      .addCase(getAllShows.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAllShows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shows = action.payload.shows; // Extract the shows array from the response
      })
      .addCase(getAllShows.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Show by ID
      .addCase(getShowById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getShowById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentShow = action.payload;
      })
      .addCase(getShowById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Show
      .addCase(updateShow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateShow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.shows.findIndex(
          (show) => show._id === action.payload._id
        );
        if (index !== -1) {
          state.shows[index] = action.payload;
        }
        if (state.currentShow?._id === action.payload._id) {
          state.currentShow = action.payload;
        }
      })
      .addCase(updateShow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Show
      .addCase(deleteShow.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteShow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shows = state.shows.filter((show) => show._id !== action.payload.id);
        if (state.currentShow?._id === action.payload.id) {
          state.currentShow = null;
        }
      })
      .addCase(deleteShow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetShows, clearCurrentShow } = showsSlice.actions;
export default showsSlice.reducer;
