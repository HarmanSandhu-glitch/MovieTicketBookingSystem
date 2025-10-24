# Quick Start Guide - Redux Toolkit Setup

## 🚀 Getting Started

Your Redux Toolkit implementation is complete and ready to use! Follow these steps to start using it in your components.

## 📋 Prerequisites

All dependencies have been installed:
- ✅ @reduxjs/toolkit
- ✅ react-redux
- ✅ redux-persist
- ✅ axios

## 🎯 Basic Usage in Components

### 1. Sign In Example

```jsx
// src/components/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../feautres/auth/authSlice';

function Login() {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signIn(formData));
  };

  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </button>
      {isError && <p style={{color: 'red'}}>{message}</p>}
    </form>
  );
}

export default Login;
```

### 2. Display Halls Example

```jsx
// src/components/HallsList.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHalls } from '../feautres/halls/hallsSlice';

function HallsList() {
  const dispatch = useDispatch();
  const { halls, isLoading, isError, message } = useSelector((state) => state.halls);

  useEffect(() => {
    dispatch(getAllHalls());
  }, [dispatch]);

  if (isLoading) return <div>Loading halls...</div>;
  if (isError) return <div>Error: {message}</div>;

  return (
    <div>
      <h2>Available Halls</h2>
      {halls.map((hall) => (
        <div key={hall._id}>
          <h3>{hall.name}</h3>
          <p>Capacity: {hall.capacity}</p>
        </div>
      ))}
    </div>
  );
}

export default HallsList;
```

### 3. Display Shows Example

```jsx
// src/components/ShowsList.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShows } from '../feautres/shows/showsSlice';

function ShowsList() {
  const dispatch = useDispatch();
  const { shows, isLoading, isError, message } = useSelector((state) => state.shows);

  useEffect(() => {
    dispatch(getAllShows());
  }, [dispatch]);

  if (isLoading) return <div>Loading shows...</div>;
  if (isError) return <div>Error: {message}</div>;

  return (
    <div>
      <h2>Now Showing</h2>
      {shows.map((show) => (
        <div key={show._id}>
          <h3>{show.movieName}</h3>
          <p>Price: ${show.price}</p>
          <p>Time: {new Date(show.startTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ShowsList;
```

### 4. Generate Ticket Example

```jsx
// src/components/BookTicket.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateTicket } from '../feautres/ticekts/ticketsSlice';

function BookTicket({ showId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message, currentTicket } = useSelector((state) => state.tickets);
  
  const [seatIds, setSeatIds] = useState([]);

  const handleBooking = async () => {
    const ticketData = {
      showId,
      seatIds,
      userId: user._id
    };
    await dispatch(generateTicket(ticketData));
  };

  if (currentTicket) {
    return <div>Ticket booked successfully! ID: {currentTicket._id}</div>;
  }

  return (
    <div>
      <h3>Book Your Tickets</h3>
      {/* Add seat selection UI here */}
      <button onClick={handleBooking} disabled={isLoading || !user}>
        {isLoading ? 'Booking...' : 'Book Tickets'}
      </button>
      {isError && <p style={{color: 'red'}}>{message}</p>}
      {!user && <p>Please sign in to book tickets</p>}
    </div>
  );
}

export default BookTicket;
```

### 5. Protected Admin Route Example

```jsx
// src/components/admin/CreateHall.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHall } from '../feautres/halls/hallsSlice';

function CreateHall() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message } = useSelector((state) => state.halls);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    rows: 0,
    seatsPerRow: 0
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <div>Access Denied: Admin only</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createHall(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Hall</h2>
      <input
        type="text"
        placeholder="Hall Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Rows"
        value={formData.rows}
        onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Seats Per Row"
        value={formData.seatsPerRow}
        onChange={(e) => setFormData({ ...formData, seatsPerRow: parseInt(e.target.value) })}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Hall'}
      </button>
      {isError && <p style={{color: 'red'}}>{message}</p>}
    </form>
  );
}

export default CreateHall;
```

## 🔍 Checking Authentication Status

```jsx
// src/App.jsx or any component
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as: {user.name}</p>
          {user.role === 'admin' && <p>Admin Access</p>}
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## 🧹 Cleanup and Reset

```jsx
import { useDispatch } from 'react-redux';
import { logout, reset } from '../feautres/auth/authSlice';
import { resetHalls, clearCurrentHall } from '../feautres/halls/hallsSlice';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear auth state
    dispatch(logout());
    dispatch(reset());
    
    // Clear other states if needed
    dispatch(resetHalls());
    dispatch(clearCurrentHall());
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## 📱 Using Multiple Slices Together

```jsx
// src/components/UserTickets.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTickets } from '../feautres/ticekts/ticketsSlice';
import { getShowById } from '../feautres/shows/showsSlice';

function UserTickets() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userTickets, isLoading } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (user) {
      dispatch(getUserTickets(user._id));
    }
  }, [dispatch, user]);

  const handleShowDetails = (showId) => {
    dispatch(getShowById(showId));
  };

  if (!user) return <div>Please sign in</div>;
  if (isLoading) return <div>Loading tickets...</div>;

  return (
    <div>
      <h2>My Tickets</h2>
      {userTickets.map((ticket) => (
        <div key={ticket._id}>
          <p>Ticket ID: {ticket._id}</p>
          <p>Status: {ticket.status}</p>
          <button onClick={() => handleShowDetails(ticket.showId)}>
            View Show Details
          </button>
        </div>
      ))}
    </div>
  );
}

export default UserTickets;
```

## ⚡ Performance Tips

1. **Selective Subscriptions**: Only subscribe to the state you need
```jsx
// ❌ Bad - subscribes to all auth state
const auth = useSelector((state) => state.auth);

// ✅ Good - only subscribes to user
const user = useSelector((state) => state.auth.user);
```

2. **Memoization**: Use `useMemo` for derived state
```jsx
import { useMemo } from 'react';

const activeShows = useMemo(() => 
  shows.filter(show => new Date(show.startTime) > new Date()),
  [shows]
);
```

3. **Cleanup Effects**: Always cleanup when component unmounts
```jsx
useEffect(() => {
  dispatch(getAllHalls());
  
  return () => {
    dispatch(clearCurrentHall());
  };
}, [dispatch]);
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Add optional chaining and checks
```jsx
const userName = user?.name || 'Guest';
```

### Issue: Infinite loop in useEffect
**Solution**: Add proper dependencies
```jsx
// ❌ Bad
useEffect(() => {
  dispatch(getAllHalls());
}); // Missing dependency array

// ✅ Good
useEffect(() => {
  dispatch(getAllHalls());
}, [dispatch]);
```

### Issue: State not persisting
**Solution**: Check Redux Persist configuration in `app/store.js`

## 📚 Next Steps

1. Create your component files in `src/components/`
2. Import and use the Redux hooks
3. Test authentication flow
4. Test CRUD operations for halls, shows, tickets
5. Add error boundaries for production
6. Implement loading states and skeletons
7. Add toast notifications for user feedback

## 🎉 You're Ready!

Everything is set up and ready to use. Start building your components and integrate them with these Redux slices. Refer to `REDUX_USAGE_EXAMPLES.md` for more detailed examples.

Happy coding! 🚀
