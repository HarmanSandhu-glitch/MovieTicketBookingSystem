import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/general/Navbar';
import Footer from '../components/general/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;