import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Halls from '../pages/Halls';
import HallDetails from '../pages/HallDetails';
import Shows from '../pages/Shows';
import ShowDetails from '../pages/ShowDetails';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="halls" element={<Halls />} />
          <Route path="halls/:id" element={<HallDetails />} />
          <Route path="shows" element={<Shows />} />
          <Route path="shows/:id" element={<ShowDetails />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
