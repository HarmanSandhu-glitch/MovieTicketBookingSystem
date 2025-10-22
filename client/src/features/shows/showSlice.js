import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    shows: [],
    currentShow: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Fetches all shows for a specific hall
export const fetchShowsForHall = createAsyncThunk(
    'shows/fetchShowsForHall',
    async (hallId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/halls/${hallId}/shows`);
            return response.data.shows;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Fetches a single show by its ID
export const fetchShowById = createAsyncThunk(
    'shows/fetchShowById',
    async (showId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/shows/${showId}`);
            return response.data.show;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const showSlice = createSlice({
    name: 'shows',
    initialState,
    reducers: {
        clearCurrentShow: (state) => {
            state.currentShow = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Cases for fetching shows for a hall
            .addCase(fetchShowsForHall.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchShowsForHall.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.shows = action.payload;
            })
            .addCase(fetchShowsForHall.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Cases for fetching a single show
            .addCase(fetchShowById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchShowById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentShow = action.payload;
            })
            .addCase(fetchShowById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    },
});

export const { clearCurrentShow } = showSlice.actions;

export const selectShows = (state) => state.shows.shows;
export const selectCurrentShow = (state) => state.shows.currentShow;
export const selectShowStatus = (state) => state.shows.status;

export default showSlice.reducer;
