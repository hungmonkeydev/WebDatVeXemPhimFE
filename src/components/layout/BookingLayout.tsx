import React from 'react';
import { Outlet } from 'react-router-dom';

export default function BookingLayout() {
  return (
    <div className="flex-grow flex flex-col relative">
      <Outlet />
    </div>
  );
}

