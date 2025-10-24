import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

// Import all slices
import authReducer from '../feautres/auth/authSlice';
import hallsReducer from '../feautres/halls/hallsSlice';
import seatsReducer from '../feautres/seats/seatSlice';
import showsReducer from '../feautres/shows/showsSlice';
import ticketsReducer from '../feautres/tickets/ticketsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  halls: hallsReducer,
  seats: seatsReducer,
  shows: showsReducer,
  tickets: ticketsReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
