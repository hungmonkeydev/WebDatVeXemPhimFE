// src/components/TicketDetailCard.tsx
import { useNavigate } from 'react-router-dom';

interface TicketDetailCardProps {
    booking: any;
    onClose?: () => void;
}

export default function TicketDetailCard({ booking, onClose }: TicketDetailCardProps) {
    const navigate = useNavigate();

    if (!booking) return null;

    const movieName = booking.movie?.title || booking.showtime?.movieTitle || 'Đang cập nhật...';
    const ageRating = booking.movie?.ageRating || booking.showtime?.ageRating || 'T18';
    const formatInfo = `2D Phụ đề`; 

    let showDate = '...';
    let showTime = '...';
    let dayOfWeek = '...';
    if (booking.showtime?.startTime) {
        const dateObj = new Date(booking.showtime.startTime);
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        dayOfWeek = days[dateObj.getDay()];
        showDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        showTime = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    const cinemaName = booking.cinema?.name || booking.showtime?.cinemaName || 'Galaxy Tan Binh';
    const roomName = booking.showtime?.roomName || '';
    const totalPrice = booking.finalAmount || booking.totalAmount || 0;
    const qrData = booking.bookingCode || 'NO-CODE';
    const stars = 4;

    // LẤY DANH SÁCH GHẾ NGỒI
    const seatsDisplay = booking.seats && booking.seats.length > 0
        ? booking.seats.map((s:any) => s.seatLabel).join(', ') 
        : 'Chưa có ghế';

    // KIỂM TRA XEM CÓ MUA COMBO KHÔNG
    const hasCombo = booking.combos && booking.combos.length > 0;

    return (
        <div className="bg-white w-full max-w-[380px] rounded-lg shadow-2xl relative flex flex-col font-sans overflow-hidden border border-gray-100">

            {/* NÚT TẮT NẰM GÓC PHẢI TRÊN (NỔI) */}
            <button
                onClick={() => {
                    if (onClose) onClose();
                    else navigate('/');
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold transition-colors z-20"
            >
                ✕
            </button>

            {/* PHẦN 1: POSTER VÀ TÊN PHIM */}
            <div className="flex flex-col items-center pt-8 px-6 pb-4">
                <img
                    src={booking.showtime?.posterUrl || booking.movie?.posterUrl || "https://via.placeholder.com/150x220"}
                    alt={movieName}
                    className="w-[120px] h-[170px] object-cover rounded-md shadow-md mb-4"
                />
                <h2 className="text-[20px] font-bold text-gray-800 text-center leading-tight mb-2">
                    {movieName}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-gray-600 font-medium">{formatInfo}</span>
                    <span className="bg-[#f26b38] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">
                        {ageRating}
                    </span>
                </div>
            </div>

            <div className="w-full px-6">
                <div className="w-full border-t border-dashed border-gray-400"></div>
            </div>

            {/* PHẦN 2: THÔNG TIN RẠP, GIỜ CHIẾU, GHẾ VÀ COMBO */}
            <div className="px-6 py-5 flex flex-col items-center w-full">
                {/* Rạp và Giờ */}
                <p className="font-bold text-gray-700 text-[16px] mb-1 text-center">{cinemaName}</p>
                {roomName && <p className="text-[14px] text-gray-500 mb-1">{roomName}</p>}
                
                <p className="text-[15px] text-gray-600 text-center mb-4">
                    Suất: <span className="font-bold text-[#f26b38]">{showTime}</span> - {dayOfWeek}, <span className="font-bold text-gray-800">{showDate}</span>
                </p>

                {/* Khung chứa Ghế và Combo */}
                <div className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-2">                    <div className="flex justify-between items-start">
                        <span className="text-[13px] text-gray-500 w-16 shrink-0">Ghế ngồi:</span>
                        <span className="font-bold text-gray-800 text-[14px] text-right break-words">{seatsDisplay}</span>
                    </div>

                    {/* Hàng Combo */}
                    {hasCombo && (
                        <>
                            <div className="w-full border-t border-gray-200/60 my-0.5"></div>
                            <div className="flex justify-between items-start">
                                <span className="text-[13px] text-gray-500 w-16 shrink-0 pt-0.5">Bắp nước:</span>
                                <div className="flex flex-col items-end">
                                    {booking.combos.map((combo: any, idx: number) => (
                                        <span key={idx} className="font-medium text-gray-700 text-[13px] text-right">
                                            {combo.quantity}x {combo.comboName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* QR CODE TO ĐÙNG */}
                <div className="mt-6 mb-2">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`}
                        alt="QR Code"
                        className="w-[140px] h-[140px] object-contain"
                    />
                </div>
            </div>

            <div className="relative w-full flex items-center justify-center my-1">
                <div className="absolute -left-3 w-6 h-6 bg-gray-100 rounded-full"></div>
                <div className="w-full px-6">
                    <div className="w-full border-t-2 border-dashed border-gray-800"></div>
                </div>
                <div className="absolute -right-3 w-6 h-6 bg-gray-100 rounded-full"></div>
            </div>

            {/* PHẦN 3: GIÁ TIỀN & ĐIỂM THƯỞNG */}
            <div className="px-6 py-4 flex justify-between items-center text-center">
                <div className="flex flex-col items-start w-[45%] overflow-hidden">
                    <span className="text-[13px] text-gray-500 mb-1">Mã vé</span>
                    <span className="font-bold text-gray-700 text-[14px] truncate w-full text-left" title={qrData}>{qrData}</span>
                </div>
                <div className="flex flex-col items-center w-[33%]">
                    <span className="text-[13px] text-gray-500 mb-1">Stars</span>
                    <span className="font-bold text-gray-800 text-[16px]">{stars}</span>
                </div>
                <div className="flex flex-col items-end w-[33%]">
                    <span className="text-[13px] text-gray-500 mb-1">Giá</span>
                    <span className="font-bold text-[#f26b38] text-[18px]">{Number(totalPrice).toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>

            <div className="w-full px-6">
                <div className="w-full border-t border-dashed border-gray-400"></div>
            </div>

            {/* PHẦN FOOTER: GHI CHÚ */}
            <div className="px-6 py-5 text-center bg-white rounded-b-lg">
                <p className="text-[13px] text-gray-500 leading-relaxed">
                    Bạn cần trợ giúp? Liên hệ:<br />
                    <a href="tel:19002224" className="font-bold text-gray-700 border-b border-dotted border-gray-500 hover:text-[#f26b38] transition-colors">1900 2224</a>
                    {' '}•{' '}
                    <a href="mailto:hotro@galaxycinema.vn" className="font-bold text-gray-700 border-b border-dotted border-gray-500 hover:text-[#f26b38] transition-colors">hotro@galaxycinema.vn</a>
                </p>
            </div>

        </div>
    );
}