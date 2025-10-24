# Redux Toolkit Usage Examples

## Overview
All Redux slices have been set up with the following features:
- Async thunks for API calls
- Loading, success, and error states
- Redux Persist for auth state (persists to localStorage)

## Store Configuration
The store is configured in `app/store.js` with:
- Auth slice (persisted)
- Halls slice
- Seats slice
- Shows slice
- Tickets slice

## Usage Examples

### 1. Auth Slice (`feautres/auth/authSlice.js`)

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, updateUserProfile, logout, reset } from '../feautres/auth/authSlice';

function LoginComponent() {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { email: 'user@example.com', password: 'password123' };
    await dispatch(signIn(credentials));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
    await dispatch(signUp(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async () => {
    const userData = { name: 'John Updated' };
    await dispatch(updateUserProfile({ id: user._id, userData }));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {message}</p>}
      {user && <p>Welcome, {user.name}</p>}
      {/* Your form here */}
    </div>
  );
}
```

### 2. Halls Slice (`feautres/halls/hallsSlice.js`)

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { 
  createHall, 
  getAllHalls, 
  getHallById, 
  getHallShows, 
  updateHall, 
  deleteHall,
  resetHalls,
  clearCurrentHall 
} from '../feautres/halls/hallsSlice';

function HallsComponent() {
  const dispatch = useDispatch();
  const { halls, currentHall, hallShows, isLoading, isError, message } = useSelector((state) => state.halls);

  useEffect(() => {
    dispatch(getAllHalls());
  }, [dispatch]);

  const handleCreateHall = async () => {
    const hallData = { name: 'Hall A', capacity: 100, rows: 10, seatsPerRow: 10 };
    await dispatch(createHall(hallData));
  };

  const handleGetHall = async (id) => {
    await dispatch(getHallById(id));
  };

  const handleGetHallShows = async (id) => {
    await dispatch(getHallShows(id));
  };

  const handleUpdateHall = async (id) => {
    const hallData = { name: 'Hall A Updated' };
    await dispatch(updateHall({ id, hallData }));
  };

  const handleDeleteHall = async (id) => {
    await dispatch(deleteHall(id));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {halls.map(hall => (
        <div key={hall._id}>{hall.name}</div>
      ))}
    </div>
  );
}
```

### 3. Shows Slice (`feautres/shows/showsSlice.js`)

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { 
  createShow, 
  getAllShows, 
  getShowById, 
  updateShow, 
  deleteShow,
  resetShows,
  clearCurrentShow 
} from '../feautres/shows/showsSlice';

function ShowsComponent() {
  const dispatch = useDispatch();
  const { shows, currentShow, isLoading, isError, message } = useSelector((state) => state.shows);

  useEffect(() => {
    dispatch(getAllShows());
  }, [dispatch]);

  const handleCreateShow = async () => {
    const showData = { 
      movieName: 'Inception', 
      hallId: 'hall123', 
      startTime: '2024-10-25T18:00:00',
      price: 12.99
    };
    await dispatch(createShow(showData));
  };

  const handleGetShow = async (id) => {
    await dispatch(getShowById(id));
  };

  const handleUpdateShow = async (id) => {
    const showData = { price: 14.99 };
    await dispatch(updateShow({ id, showData }));
  };

  const handleDeleteShow = async (id) => {
    await dispatch(deleteShow(id));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {shows.map(show => (
        <div key={show._id}>{show.movieName}</div>
      ))}
    </div>
  );
}
```

### 4. Tickets Slice (`feautres/ticekts/ticketsSlice.js`)

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { 
  generateTicket, 
  getAllTickets, 
  getUserTickets, 
  updateTicketStatus,
  resetTickets,
  clearCurrentTicket 
} from '../feautres/ticekts/ticketsSlice';

function TicketsComponent() {
  const dispatch = useDispatch();
  const { tickets, userTickets, currentTicket, isLoading, isError, message } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getUserTickets(user._id));
    }
  }, [dispatch, user]);

  const handleGenerateTicket = async () => {
    const ticketData = { 
      showId: 'show123', 
      seatIds: ['seat1', 'seat2'],
      userId: user._id
    };
    await dispatch(generateTicket(ticketData));
  };

  const handleGetAllTickets = async () => {
    await dispatch(getAllTickets());
  };

  const handleUpdateTicketStatus = async (id) => {
    const statusData = { status: 'confirmed' };
    await dispatch(updateTicketStatus({ id, statusData }));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {userTickets.map(ticket => (
        <div key={ticket._id}>Ticket for {ticket.showId}</div>
      ))}
    </div>
  );
}
```

### 5. Seats Slice (`feautres/seats/seatSlice.js`)

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { getSeatById, resetSeats, clearCurrentSeat } from '../feautres/seats/seatSlice';

function SeatsComponent() {
  const dispatch = useDispatch();
  const { seats, currentSeat, isLoading, isError, message } = useSelector((state) => state.seats);

  const handleGetSeat = async (id) => {
    await dispatch(getSeatById(id));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {currentSeat && <p>Seat: {currentSeat.number}</p>}
    </div>
  );
}
```

## API Configuration

All slices use `axios` with the following configuration:
- Base URL: `http://localhost:5000/api`
- Credentials: Enabled (cookies sent with requests)

To change the API URL, update the `API_URL` constant in each slice file.

## State Structure

### Auth State
```javascript
{
  user: null | Object,
  token: null | string,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### Halls State
```javascript
{
  halls: [],
  currentHall: null | Object,
  hallShows: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### Shows State
```javascript
{
  shows: [],
  currentShow: null | Object,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### Tickets State
```javascript
{
  tickets: [],
  userTickets: [],
  currentTicket: null | Object,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### Seats State
```javascript
{
  seats: [],
  currentSeat: null | Object,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

## Important Notes

1. **Authentication**: The auth state is persisted to localStorage, so users will remain logged in even after page refresh.

2. **Error Handling**: All slices handle errors and store error messages in the `message` field.

3. **Loading States**: Use `isLoading` to show loading indicators in your components.

4. **Reset Functions**: Each slice has a reset function to clear loading/error states:
   - `reset()` for auth
   - `resetHalls()` for halls
   - `resetShows()` for shows
   - `resetTickets()` for tickets
   - `resetSeats()` for seats

5. **Admin Routes**: Some endpoints require admin authentication (createHall, updateHall, deleteHall, createShow, updateShow, deleteShow). Make sure the user has the appropriate role.

6. **Cleanup**: Use the clear functions to reset current items:
   - `clearCurrentHall()`
   - `clearCurrentShow()`
   - `clearCurrentTicket()`
   - `clearCurrentSeat()`
