// src/pages/FoodSelection.tsx
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCombos } from '../hooks/useCombos';
import { useEffect } from 'react';
import BookingSummary from '../components/booking/BookingSummary';
import { bookingService } from '../services/bookingService';
export default function FoodSelection() {
    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();
    const {
        selectedSeats = [],
        expireAt,
        showtimeInfo,
        roomInfo,
        totalTicketPrice = 0,
        remainingSeconds = 600 // Mặc định 10 phút nếu không có
    } = location.state || {};
    const bookingData = location.state;

    useEffect(() => {
        if (selectedSeats.length === 0) {
            navigate(`/dat-ve/${id}/chon-ghe`);
        }
    }, [selectedSeats, id, navigate]);

    const { combos, isLoadingCombos } = useCombos();

    const [comboCart, setComboCart] = useState<Record<number, number>>({});
    // Hàm cập nhật số lượng
    const updateQuantity = (comboId: number, delta: number) => {
        setComboCart(prev => {
            const currentQty = prev[comboId] || 0;
            const newQty = currentQty + delta;
            if (newQty <= 0) {
                const newCart = { ...prev };
                delete newCart[comboId];
                return newCart;
            }
            return { ...prev, [comboId]: newQty };
        });
    };

    // TÍNH TIỀN COMBO & TỔNG BILL
    const totalComboPrice = combos.reduce((total, combo) => {
        const qty = comboCart[combo.comboId] || 0;
        return total + (Number(combo.price) * qty);
    }, 0);

    const finalTotalPrice = totalTicketPrice + totalComboPrice;
    let startTimeDisplay = showtimeInfo?.startTime ? showtimeInfo.startTime.substring(11, 16) : '...';
    let dateDisplay = '...';
    if (showtimeInfo && showtimeInfo.startTime) {
        const dateObj = new Date(showtimeInfo.startTime.replace('Z', ''));
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        dateDisplay = `${dayNames[dateObj.getDay()]}, ${dateObj.toLocaleDateString('vi-VN')}`;
    }
    return (
        <div className="w-full bg-gray-50 min-h-screen pb-20">

            {/* ====== 1. THANH TIẾN ĐỘ ====== */}
            <div className="bg-white shadow-sm mb-8">
                <div className="max-w-6xl mx-auto flex justify-center gap-8 py-4 text-sm font-semibold">
                    <span className="text-gray-400">Chọn phim / Rạp / Suất</span>
                    <span className="text-gray-400 cursor-pointer hover:text-blue-700" onClick={() => navigate(-1)}>Chọn ghế</span>
                    <span className="text-blue-700 border-b-2 border-blue-700 pb-4 -mb-4">Chọn thức ăn</span>
                    <span className="text-gray-400">Thanh toán</span>
                    <span className="text-gray-400">Xác nhận</span>
                </div>
            </div>

            {/* ====== 2. NỘI DUNG CHÍNH ====== */}
            <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">

                <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Chọn Combo / Sản phẩm</h2>

                    {isLoadingCombos ? (
                        <div className="text-center py-10 text-gray-500">Đang tải danh sách bắp nước...</div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {combos.map(combo => {
                                const quantity = comboCart[combo.comboId] || 0;
                                return (
                                    <div key={combo.comboId} className="flex gap-6 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <img
                                            src={combo.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={combo.name}
                                            className="w-24 h-24 object-cover rounded-md mix-blend-multiply border"
                                        />

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-[15px] mb-1">{combo.name}</h3>
                                            <p className="text-gray-500 text-[13px] mb-2 leading-relaxed">{combo.description || combo.desc}</p>
                                            <p className="font-bold text-gray-800 text-[14px]">
                                                Giá: <span className="text-gray-800">{Number(combo.price).toLocaleString('vi-VN')} đ</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(combo.comboId, -1)}
                                                className="w-6 h-6 flex justify-center items-center font-bold text-gray-500 hover:text-[#f26b38]"
                                            >-</button>
                                            <span className="text-[14px] font-semibold text-gray-800 w-4 text-center">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(combo.comboId, 1)}
                                                className="w-6 h-6 flex justify-center items-center font-bold text-gray-500 hover:text-[#f26b38]"
                                            >+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: BILL THANH TOÁN (STICKY) */}
                <BookingSummary
                    showtimeInfo={showtimeInfo}
                    roomInfo={roomInfo}
                    startTimeDisplay={startTimeDisplay}
                    dateDisplay={dateDisplay}
                    selectedSeats={selectedSeats}
                    totalPrice={finalTotalPrice}
                    remainingSeconds={bookingData.remainingSeconds || 600}
                    expireAt={expireAt}
                    onTimeout={() => {
                        alert("Đã hết thời gian giữ ghế! Vui lòng chọn lại từ đầu.");
                        navigate(`/dat-ve/${id}/chon-ghe`); 
                    }}
                    combos={combos}
                    comboCart={comboCart}

                    onBack={() => navigate(-1)}
                    onNext={async () => {
                        const rawToken = localStorage.getItem('access_token');
                        const isValidToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined';

                        // LUỒNG KHÁCH VÃNG LAI: CHƯA TẠO VÉ VỘI
                        if (!isValidToken) {
                            console.log("Khách vãng lai -> Chuyển sang trang Thanh Toán để điền thông tin!");
                            navigate(`/dat-ve/${id}/thanh-toan`, {
                                state: {
                                    selectedSeats,
                                    comboCart,
                                    combos,
                                    finalTotalPrice,
                                    showtimeInfo,
                                    roomInfo,
                                    expireAt,
                                    isGuest: true 
                                }
                            });
                            return; 
                        }

                        // LUỒNG USER (ĐÃ ĐĂNG NHẬP): TẠO VÉ LUÔN
                        try {
                            const payload = {
                                showtimeId: Number(id),
                                seatIds: selectedSeats.map((seat: any) => seat.id || seat.seatId),
                                combos: Object.keys(comboCart).map(comboId => ({
                                    comboId: Number(comboId),
                                    quantity: comboCart[Number(comboId)]
                                }))
                            };

                            console.log("Đang gửi yêu cầu tạo vé cho User:", payload);
                            const response = await bookingService.createBooking(payload);

                            const newBookingId = response.data?.bookingId || response.data?.id || response.data?.data?.bookingId;

                            if (!newBookingId) {
                                alert("Không thể tạo vé lúc này. Vui lòng thử lại!");
                                return;
                            }

                            console.log("Tạo vé thành công! ID:", newBookingId);

                            navigate(`/dat-ve/${id}/thanh-toan`, {
                                state: {
                                    selectedSeats,
                                    comboCart,
                                    combos,
                                    finalTotalPrice,
                                    showtimeInfo,
                                    roomInfo,
                                    expireAt,
                                    bookingId: newBookingId, 
                                    isGuest: false
                                }
                            });

                        } catch (error: any) {
                            console.error("Lỗi tạo vé:", error);
                            alert("Có lỗi xảy ra khi tạo vé: " + (error.response?.data?.message || "Lỗi mạng"));
                        }
                    }}
                    nextLabel="Tiếp tục"
                />
            </div>
        </div>
    );
}