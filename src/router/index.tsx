import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import ProfilePage from '../pages/ProfilePage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<AppRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}