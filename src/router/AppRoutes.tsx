import { Routes, Route, Outlet } from 'react-router-dom';
import Header from '../components/Layout/Header';
import HomePage from '../pages/HomePage';
import Footer from '../components/Layout/Footer';
import MovieDetail from '../pages/MovieDetailPage';
import SeatSelection from '../pages/SeatSelectionPage';
import FoodSelection from '../pages/FoodSelection';
import ScrollToTop from '../components/ScrollToTop';
import ProfilePage from '../pages/MyProfile/ProfilePage';
import BookingLayout from '../components/Layout/BookingLayout';
import PaymentPage from '../pages/PaymentPage';
import BookingSuccessPage from '../pages/BookingSuccessPage';
import MoviesPage from '../pages/MoviesPage';
import AdminRoutes from './AdminRoutes';
import LoyaltyStore from '../pages/LoyaltyStore';
import VerifyEmailSuccessPage from '../pages/VerifyEmailSuccessPage';
import MovieFeedPage from '../pages/MovieFeedPage';
const CustomerLayout = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow">
            <Outlet />
        </div>
        <Footer />
    </div>
);

export default function AppRoutes() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route element={<CustomerLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/movies/now-showing" element={<MoviesPage />} />
                    <Route path="/movies/coming-soon" element={<MoviesPage />} />
                    <Route path="/movies/imax" element={<MoviesPage />} />
                    <Route path="/kham-pha" element={<MovieFeedPage />} />
                    <Route path="/phim/:id" element={<MovieDetail />} />
                    {/* BookingLayout nằm lồng bên trong CustomerLayout */}
                    <Route element={<BookingLayout />}>
                        <Route path="/dat-ve/:id/chon-ghe" element={<SeatSelection />} />
                        <Route path="/dat-ve/:id/thuc-an" element={<FoodSelection />} />
                    </Route>
                    <Route path="/dat-ve/:id/thanh-toan" element={<PaymentPage />} />
                    <Route path="/dat-ve/:id/thanh-cong" element={<BookingSuccessPage />} />
                    <Route path="/booking/payment-success" element={<BookingSuccessPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/loyalty-store" element={<LoyaltyStore />} />
                    <Route path="/verify-email" element={<VerifyEmailSuccessPage />} />

                </Route>
            </Routes>
        </>
    );
}