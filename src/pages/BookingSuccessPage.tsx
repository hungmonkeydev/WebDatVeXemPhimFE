import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TicketDetailCard from '../components/Booking/TicketDetailCard';
import { QRCodeSVG } from 'qrcode.react';
import { useBooking } from '../Hooks/useBooking';
export default function BookingSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const urlBookingCode = searchParams.get('bookingCode');
    const bookingCode = urlBookingCode || localStorage.getItem('successBookingCode');

    const [guestTicketData, setGuestTicketData] = useState<any>(null);
    const isGuest = !localStorage.getItem('access_token');

    const { isLoading, booking, fetchBookingDetail } = useBooking();

    useEffect(() => {
        if (!bookingCode && !isGuest) {
            alert("Không tìm thấy mã vé hợp lệ!");
            navigate('/');
            return;
        }

        if (isGuest) {
            const savedData = localStorage.getItem('pendingTicket');
            if (savedData) setGuestTicketData(JSON.parse(savedData));
            // Sếp nhớ tạo thêm một state local để tắt loading cho Guest ở đây nếu cần
            return;
        }

        // Gọi hàm API siêu gọn gàng
        fetchBookingDetail(bookingCode as string).then((res) => {
            if (!res.success) {
                alert("Không tìm thấy thông tin vé này!");
                navigate('/');
            }
            localStorage.removeItem('successBookingCode');
            localStorage.removeItem('pendingTicket');
        });

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
            <div className="min-h-screen bg-gray-50 py-10 flex justify-center items-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
                    <p className="text-gray-500 mb-6">
                        Vé điện tử đã được gửi về email của bạn.
                    </p>

                    {guestTicketData && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg border-dashed border-2 border-gray-300 text-left">
                            <h3 className="text-center text-lg font-bold mb-4">Thông tin vé</h3>

                            {/* Hiển thị Mã QR dựa vào bookingCode */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="p-2 bg-white rounded shadow-sm">
                                    <QRCodeSVG value={bookingCode || 'VIECINEMA'} size={140} />
                                </div>
                                <p className="font-bold text-blue-600 mt-2 text-xl">
                                    Mã ĐH: {bookingCode}
                                </p>
                                <p className="text-xs text-red-500 mt-2 italic px-2 text-center">
                                    *Lưu ý: Mã QR này chỉ mang tính chất minh họa. Vui lòng sử dụng mã QR được gửi trong Email để quét vé qua cổng.
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700 border-t pt-4">
                                <p><strong>Phim:</strong> {guestTicketData.movieName}</p>
                                <p><strong>Cụm rạp:</strong> {guestTicketData.cinemaName} - {guestTicketData.roomName}</p>
                                <p><strong>Suất chiếu:</strong> {guestTicketData.showTime}</p>
                                <p><strong>Ghế:</strong> <span className="text-red-500 font-bold">{guestTicketData.seatLabels}</span></p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-[#f26b38] text-white px-6 py-2 rounded font-semibold hover:bg-[#d95c2b] w-full transition-colors"
                        >
                            Về trang chủ
                        </button>
                    </div>
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
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-10 px-4">
            <div className="mb-6 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-green-600">Thanh toán thành công!</h2>
                <p className="text-gray-600 mt-2">Vé điện tử kèm mã QR đã được gửi đến email của bạn.</p>
            </div>

            <TicketDetailCard booking={booking} />

            <button
                onClick={() => navigate('/')}
                className="mt-6 bg-[#f26b38] text-white px-8 py-3 rounded-md font-bold hover:bg-[#d95a2b] transition-colors"
            >
                Về trang chủ
            </button>
        </div>
    );
}
