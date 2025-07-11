import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
const MarketingLayout = () => {
  useEffect(() => {
    // Ensure light mode is applied for marketing pages by removing dark class
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default MarketingLayout;
