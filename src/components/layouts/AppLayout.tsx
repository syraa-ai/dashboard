import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      {/* This layout intentionally doesn't include the marketing Navbar 
          since app pages either have their own headers or are full-page components */}
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
