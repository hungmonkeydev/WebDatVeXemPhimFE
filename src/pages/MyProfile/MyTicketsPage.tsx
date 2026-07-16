import { useState, useEffect } from 'react';
import axios from 'axios';
import TicketDetailCard from '../../components/Booking/TicketDetailCard';
export default function MyTicketsPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8080/api/bookings/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200 || response.data?.statusCode === "200") {
                    setHistory(response.data?.data || []);
                }
            } catch (err: any) {
                console.error("Lỗi:", err);
                setError(err.response?.data?.message || "Có lỗi xảy ra khi tải lịch sử giao dịch.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Hàm chuyển đổi ngày giờ thành dạng: "09:00 - Chủ Nhật, 02/03/2025"
    const formatDateTimeTicket = (isoString: string) => {
        if (!isoString) return '--:-- - --, --/--/----';
        const dateObj = new Date(isoString);

        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dayName = days[dateObj.getDay()];

        const timeString = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const dateString = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

        return `${timeString} - ${dayName}, ${dateString}`;
    };

    if (isLoading) {
        return (
            <div className="py-12 flex flex-col justify-center items-center gap-3">
                <div className="w-8 h-8 border-4 border-[#f26b38] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500 text-[14px]">Đang tải hóa đơn...</span>
            </div>
        );
    }

    if (error) {
        return <div className="py-12 text-center text-red-500 font-medium">{error}</div>;
    }

    if (history.length === 0) {
        return (
            <div className="py-16 text-center">
                <div className="text-4xl mb-3">🎫</div>
                <h3 className="font-bold text-gray-800">Bạn chưa có giao dịch nào</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-2">
            {history.map((ticket, index) => {
                const showtime = ticket.showtime;
                const movie = ticket.movie;
                const displayTime = formatDateTimeTicket(showtime?.startTime);

                return (
                    <div
                        key={index}
                        className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow gap-4 md:gap-0"
                    >
                        {/* Hiệu ứng xé vé (2 nửa hình tròn ở 2 mép) - Ẩn trên mobile cho đỡ rối */}
                        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f4f4f4] rounded-full border-r border-gray-200 hidden md:block"></div>
                        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f4f4f4] rounded-full border-l border-gray-200 hidden md:block"></div>

                        {/* Cột 1: Ảnh + Tên phim + Nhãn dán */}
                        <div className="flex items-center gap-4 md:w-5/12 pl-0 md:pl-2">
                            <img
                                src={showtime?.posterUrl || movie?.posterUrl || "https://via.placeholder.com/60x85?text=Phim"}
                                alt="Poster"
                                className="w-[60px] h-[85px] object-cover rounded-md shadow-sm shrink-0"
                            />
                            <div className="flex flex-col">
                                <h4 className="text-[16px] font-medium text-gray-800 line-clamp-2">
                                    {showtime?.movieTitle || movie?.title || 'Tên phim đang cập nhật'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[13px] text-gray-500">2D Phụ Đề</span>
                                    <span className="bg-[#f26b38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                                        {showtime?.ageRating || movie?.ageRating || 'T18'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cột 2: Tên rạp + Ngày giờ */}
                        <div className="flex flex-col md:w-5/12">
                            <span className="text-[13.5px] text-gray-500 mb-0.5">
                                {showtime?.cinemaName || ticket.cinema?.name || 'Rạp chiếu đang cập nhật'}
                            </span>
                            <span className="text-[14px] font-medium text-gray-800">
                                {displayTime}
                            </span>
                        </div>

                        {/* Cột 3: Nút Chi tiết */}
                        <div className="md:w-2/12 flex justify-start md:justify-end pr-0 md:pr-4">
                            <button
                                onClick={() => setSelectedTicket(ticket)}
                                className="text-[#f26b38] font-medium text-[14px] hover:text-[#d95a2b] transition-colors border-b border-dotted border-[#f26b38] pb-[1px]"
                            >
                                Chi tiết
                            </button>
                        </div>

                    </div>

                );
            })}
            {selectedTicket && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setSelectedTicket(null)}></div>

                    <div className="relative z-10 w-full max-w-[380px] flex justify-center animate-slide-up">
                        <TicketDetailCard
                            booking={selectedTicket}
                            onClose={() => setSelectedTicket(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}