import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminPlayout'; // Nhớ check lại đường dẫn nha
import Dashboard from '../admin/pages/DashboardPage';
import MovieManage from '../admin/pages/MoviesAdminPage';
import UserPage from '../admin/pages/UsersPage';
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<Dashboard />} />
        <Route path='users' element={<UserPage />} />
        <Route path="movies" element={<MovieManage />} />
      </Route>
    </Routes>
  );
}