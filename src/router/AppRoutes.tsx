import { Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import HomePage from '../pages/HomePage';
import Footer from '../components/layout/Footer';
import MovieDetail from '../pages/MovieDetailPage';
import SeatSelection from '../pages/SeatSelectionPage';
import FoodSelection from '../pages/FoodSelection';
import ScrollToTop from '../components/ScrollToTop';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow">
            {children}
        </div>
        <Footer/>
    </div>
);

export default function AppRoutes() {
    return (
        <CustomerLayout>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/phim/:id" element={<MovieDetail />} />
                <Route path="/dat-ve/:id/chon-ghe" element={<SeatSelection />} />
                <Route path="/dat-ve/:id/thuc-an" element={<FoodSelection />} />
                {/* Các route khác thêm vào đây */}
            </Routes>
        </CustomerLayout>
    );
}