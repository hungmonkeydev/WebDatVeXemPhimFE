import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminPlayout';
import Dashboard from '../admin/pages/DashboardPage';
import UserPage from '../admin/pages/UsersPage';
import ShowtimePage from '../admin/pages/ShowtimesPage';
import MoviesAdminPage from '../admin/pages/MoviesAdminPage';
import ComboPage from '../admin/pages/ComboPage';
import BookingsPage from '../admin/pages/BookingsPage';
import VoucherManage from '../admin/pages/VoucherPage';
import PromotionManage from '../admin/pages/PromotionPage';
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfoStr = localStorage.getItem('user_info');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  
  if (!userInfo || userInfo.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path='users' element={<UserPage />} />
        <Route path="movies" element={<MoviesAdminPage />} />
        <Route path="showtimes" element={<ShowtimePage />} />
        <Route path='combos' element={<ComboPage />} />
        <Route path='orders' element={<BookingsPage />} />
        {/* <Route path="booking" element={<BookingsPage />} /> */}
        <Route path='vouchers' element={<VoucherManage />} />
        <Route path='promotions' element={<PromotionManage />} />
      </Route>
    </Routes>
  );
}