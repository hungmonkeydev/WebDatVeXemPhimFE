import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useShowtimeDetail } from '../hooks/useShowtimeDetail';
import axios from 'axios';

export default function PaymentPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // 1. NHẬN LẠI HÀNH LÝ TỪ TRANG THỨC ĂN
    const location = useLocation();
    const bookingData = location.state;

    const { showtime } = useShowtimeDetail(id);
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');

    // 2. BẢO MẬT: Chặn khách lạ vô thẳng link mà chưa chọn ghế
    if (!bookingData || bookingData.selectedSeats?.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <h2 className="text-xl font-bold text-gray-800">Vui lòng chọn ghế trước khi thanh toán!</h2>
                <button onClick={() => navigate('/')} className="bg-[#f26b38] text-white px-6 py-2 rounded font-semibold hover:bg-[#d95c2b]">
                    Về trang chủ
                </button>
            </div>
        );
    }

    // 3. BÓC TÁCH DỮ LIỆU ĐỂ XÀI
    const { selectedSeats, comboCart, finalTotalPrice } = bookingData;

    // --- TÍNH TOÁN THỨ VÀ NGÀY CHUẨN XÁC (Tránh lệch múi giờ 03:00) ---
    let dateDisplay = '...';
    if (showtime && showtime.start_time) {
        const rawTime = showtime.start_time; // Ví dụ: "2026-05-03T20:00:00.000Z"
        
        // Ép lấy đúng Ngày, Tháng, Năm để không bị trình duyệt tự cộng
        const year = rawTime.substring(0, 4);   
        const month = rawTime.substring(5, 7);  
        const day = rawTime.substring(8, 10);   

        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const exactDate = new Date(Number(year), Number(month) - 1, Number(day));
        const dayOfWeek = dayNames[exactDate.getDay()];

        // Ráp lại thành: Chủ Nhật, 03/05/2026
        dateDisplay = `${dayOfWeek}, ${day}/${month}/${year}`;
    }
    // ---------------------------------------------------

    // 4. HÀM XỬ LÝ KHI BẤM NÚT "THANH TOÁN"
    const handleProcessPayment = async () => {
        if (paymentMethod === 'VNPAY') {
            try {
                // Gọi sang API tạo link VNPAY từ Backend
                const response = await axios.post(`https://webxemphim-sbim.onrender.com/api/v1/payment/create_url`, {
                    amount: finalTotalPrice,
                    showtimeId: id,
                    seatIds: selectedSeats.map((s: any) => s.id),
                    comboCart: comboCart 
                });

                if (response.data && response.data.url) {
                    // Đá khách hàng văng qua trang web của VNPAY
                    window.location.href = response.data.url;
                }
            } catch (error) {
                console.error("Lỗi tạo thanh toán VNPAY:", error);
                alert("Không thể khởi tạo thanh toán VNPAY. Vui lòng kiểm tra lại kết nối!");
            }
        } else {
            alert(`Tính năng thanh toán qua ${paymentMethod} đang được nâng cấp!`);
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen pb-20 pt-8">
            
            {/* ====== THANH TIẾN ĐỘ ====== */}
            <div className="bg-white shadow-sm mb-8">
                <div className="max-w-6xl mx-auto flex justify-center gap-8 py-4 text-sm font-semibold">
                    <span className="text-gray-400">Chọn phim / Rạp / Suất</span>
                    <span className="text-gray-400">Chọn ghế</span>
                    <span className="text-gray-400 cursor-pointer hover:text-blue-700" onClick={() => navigate(-1)}>Chọn thức ăn</span>
                    <span className="text-blue-700 border-b-2 border-blue-700 pb-4 -mb-4">Thanh toán</span>
                    <span className="text-gray-400">Xác nhận</span>
                </div>
            </div>

            {/* ====== NỘI DUNG CHÍNH ====== */}
            <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
                
                {/* CỘT TRÁI: LỰA CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <div className="flex-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4 uppercase">Phương thức thanh toán</h2>
                        
                        <div className="flex flex-col gap-4">
                            <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="VNPAY" 
                                    checked={paymentMethod === 'VNPAY'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="font-bold text-blue-800 text-xl tracking-wider mr-2">VNPAY</div>
                                <span className="text-[15px] text-gray-700 font-medium">Thanh toán qua VNPAY (ATM / Internet Banking / Ví VNPay)</span>
                            </label>

                            <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'MOMO' ? 'border-[#ae2070] bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="MOMO" 
                                    checked={paymentMethod === 'MOMO'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                                />
                                <div className="font-bold text-[#ae2070] text-xl tracking-wider mr-2">MoMo</div>
                                <span className="text-[15px] text-gray-700 font-medium">Ví Điện Tử MoMo</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: BILL THANH TOÁN (STICKY) */}
                <div className="w-full lg:w-[350px]">
                    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-14">
                        
                        {/* 1. KHU VỰC POSTER VÀ TÊN PHIM */}
                        <div className="flex gap-4 mb-4">
                            <img src={showtime?.movie?.poster_url || 'https://picsum.photos/id/1043/400/600'} alt={showtime?.movie?.title || 'Poster'} className="w-24 rounded object-cover shadow-sm" />
                            <div>
                                <h3 className="font-bold text-gray-800 text-[15px] mb-1">{showtime?.movie?.title || 'Đang tải...'}</h3>
                                <p className="text-gray-500 text-[13px] mb-1">
                                    {showtime?.format === '2d' ? '2D' : showtime?.format?.toUpperCase()} 
                                    {showtime?.subtitle_type === 'subtitled' ? ' Phụ đề' : (showtime?.subtitle_type === 'dubbed' ? ' Lồng tiếng' : '')}
                                    <span className="bg-[#f26b38] text-white px-1 py-0.5 rounded text-[10px] font-bold ml-1">
                                        {showtime?.movie?.age_rating || 'C16'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* 2. THÔNG TIN RẠP & SUẤT CHIẾU */}
                        <div className="text-[14px] text-gray-700 font-medium mb-1 mt-2">
                            <span className="font-bold">{showtime?.room?.cinema?.name || 'VieCinema'}</span> <br/> 
                            {showtime?.room?.name || 'Đang tải...'}
                        </div>
                        <div className="text-[14px] text-gray-700 mb-4">
                            Suất: <span className="font-bold text-gray-900">
                                {showtime?.start_time ? showtime.start_time.substring(11, 16) : '...'} - {dateDisplay}
                            </span>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-4 text-[14px] text-gray-700">
                            {/* 3. THÔNG TIN GHẾ */}
                            <div className="flex justify-between mb-1">
                                <span>{selectedSeats?.length || 0}x Ghế</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-3">
                                Ghế: <span className="font-bold text-gray-800">{selectedSeats?.map((s:any) => s.seat_name).join(', ')}</span>
                            </div>
                            
                            {/* 4. THÔNG TIN COMBO BẮP NƯỚC (Đã fix lỗi TypeScript) */}
                            {comboCart && Object.keys(comboCart).length > 0 && (
                                <div className="text-gray-500 text-[13px] italic">
                                    + {Number(Object.values(comboCart).reduce((a: any, b: any) => Number(a) + Number(b), 0))} phần Combo/Thức ăn
                                </div>
                            )}
                        </div>

                        <div className="border-t border-dashed border-gray-300 my-4"></div>

                        {/* 5. TỔNG CỘNG TIỀN */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-800">Tổng cộng</span>
                            <span className="text-2xl font-bold text-[#f26b38]">
                                {finalTotalPrice?.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        {/* 6. NÚT ĐIỀU HƯỚNG */}
                        <div className="flex gap-4">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="w-1/3 py-2 text-[#f26b38] border border-[#f26b38] rounded font-semibold hover:bg-[#fff5f2] transition-colors"
                            >
                                Trở lại
                            </button>
                            <button 
                                onClick={handleProcessPayment}
                                className="w-2/3 py-2 rounded text-white font-bold transition-colors bg-[#f26b38] hover:bg-[#d95c2b]"
                            >
                                Thanh Toán
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}