import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import TicketDetailCard from '../components/Booking/TicketDetailCard';

export default function BookingSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingCode = searchParams.get('bookingCode');

    const [booking, setBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isGuest = !localStorage.getItem('access_token');

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingCode) {
                alert("Không tìm thấy mã vé hợp lệ!");
                navigate('/');
                return;
            }

            if (isGuest) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await bookingService.getMyBookings();
                const allMyTickets = response.data?.data || response.data || [];
                const currentTicket = allMyTickets.find((ticket: any) =>
                    ticket.bookingCode == bookingCode || ticket.booking_code == bookingCode
                );

                if (currentTicket) {
                    setBooking(currentTicket);
                } else {
                    alert("Không tìm thấy thông tin vé này trong lịch sử!");
                    navigate('/');
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin vé:", error);
                alert("Không thể tải thông tin vé lúc này!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookingDetails();
    }, [bookingCode, navigate, isGuest]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#f26b38] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isGuest) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4 px-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                    <p className="text-gray-600 mb-1">Mã vé của bạn:</p>
                    <p className="text-lg font-bold text-[#f26b38] mb-4">{bookingCode}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Vé điện tử đã được gửi đến email bạn đã đăng ký. Vui lòng kiểm tra hộp thư để xem chi tiết.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#f26b38] text-white px-6 py-2 rounded-md font-bold hover:bg-[#d95a2b] transition-colors w-full"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4">
                <p className="text-gray-600 font-medium">Không tìm thấy thông tin vé!</p>
                <button onClick={() => navigate('/')} className="bg-[#f26b38] text-white px-6 py-2 rounded-md font-bold hover:bg-[#d95a2b] transition-colors">Về trang chủ</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
            <TicketDetailCard booking={booking} />
        </div>
    );
}