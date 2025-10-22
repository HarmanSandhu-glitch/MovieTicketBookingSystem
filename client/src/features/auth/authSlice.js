import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk for user sign-in
export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/users/signin', credentials);
            return response.data.user; // Returns user object on success
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async thunk for user sign-up
export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/users/signup', userData);
            return response.data.user; // Returns user object on success
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign-in cases
            .addCase(signInUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Sign-up cases
            .addCase(signUpUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    },
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;