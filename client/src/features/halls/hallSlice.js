import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    halls: [],
    currentHall: null,
    status: 'idle',
    error: null,
};

export const fetchHalls = createAsyncThunk('halls/fetchHalls', async () => {
    const response = await axios.get('/api/halls/all');
    return response.data.halls; //
});

export const fetchHallById = createAsyncThunk('halls/fetchHallById', async (hallId) => {
    const response = await axios.get(`/api/halls/${hallId}`);
    return response.data.hall; //
});

// Add other thunks for createHall, updateHall, deleteHall as needed

const hallSlice = createSlice({
    name: 'halls',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHalls.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHalls.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.halls = action.payload;
            })
            .addCase(fetchHalls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchHallById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHallById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentHall = action.payload;
            })
            .addCase(fetchHallById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectAllHalls = (state) => state.halls.halls;
export const selectHallStatus = (state) => state.halls.status;

export default hallSlice.reducer;