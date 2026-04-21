import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRoutes from './AppRoutes';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<AppRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}