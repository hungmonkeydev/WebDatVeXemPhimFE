// src/pages/FoodSelection.tsx
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useShowtimeDetail } from '../hooks/useShowtimeDetail';
import { useCombos } from '../hooks/useCombos';

export default function FoodSelection() {
    const navigate = useNavigate();
    const { id } = useParams();

    // 1. NHẬN "HÀNH LÝ" (GHẾ ĐÃ CHỌN) TỪ TRANG TRƯỚC
    const location = useLocation();
    const selectedSeats = location.state?.selectedSeats || [];
    
    const { showtime } = useShowtimeDetail(id);
    
    const { combos, isLoadingCombos } = useCombos();

    const TICKET_PRICE = 85000;
    const totalTicketPrice = selectedSeats.length * TICKET_PRICE;

    // 2. STATE QUẢN LÝ GIỎ HÀNG COMBO
    const [comboCart, setComboCart] = useState<Record<number, number>>({});

    // Hàm cập nhật số lượng
    const updateQuantity = (comboId: number, delta: number) => {
        setComboCart(prev => {
            const currentQty = prev[comboId] || 0;
            const newQty = currentQty + delta;
            
            // Nếu giảm xuống dưới 0 thì coi như xóa khỏi giỏ
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
        const qty = comboCart[combo.id] || 0;
        return total + (combo.price * qty);
    }, 0);

    const finalTotalPrice = totalTicketPrice + totalComboPrice;

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
                                const quantity = comboCart[combo.id] || 0;
                                return (
                                    <div key={combo.id} className="flex gap-6 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <img 
                                            src={combo.image_url || 'https://via.placeholder.com/150'} 
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
                                                onClick={() => updateQuantity(combo.id, -1)}
                                                className="w-6 h-6 flex justify-center items-center font-bold text-gray-500 hover:text-[#f26b38]"
                                            >-</button>
                                            <span className="text-[14px] font-semibold text-gray-800 w-4 text-center">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(combo.id, 1)}
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
                <div className="w-full lg:w-[350px]">
                    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">

                        <div className="flex gap-4 mb-4">
                            <img src={showtime?.movie?.poster_url || 'https://picsum.photos/id/1043/400/600'} alt={showtime?.movie?.title || 'Poster'} className="w-24 rounded object-cover" />
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

                        <div className="text-[14px] text-gray-700 font-medium mb-1">
                            <span className="font-bold">{showtime?.room?.cinema?.name || 'VieCinema'}</span> - {showtime?.room?.name || 'Đang tải...'}
                        </div>
                        <div className="text-[14px] text-gray-700 mb-4">
                            Suất: <span className="font-bold">
                                {showtime?.start_time ? new Date(showtime.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '...'}
                            </span> - <span className="font-bold">
                                {showtime?.start_time ? new Date(showtime.start_time).toLocaleDateString('vi-VN', {
                                    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit'
                                }) : '...'}
                            </span>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-4 text-[14px] text-gray-700">
                            {/* Hiển thị tiền vé */}
                            <div className="flex justify-between mb-1">
                                <span>{selectedSeats.length}x Ghế</span>
                                <span className="font-bold">{totalTicketPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-3">Ghế: <span className="font-bold text-gray-800">{selectedSeats.map((s:any) => s.seat_name).join(', ')}</span></div>

                            {/* Hiển thị tiền Combo (Chỉ hiện khi có mua) */}
                            {combos.map(combo => {
                                const qty = comboCart[combo.id];
                                if (!qty) return null;
                                return (
                                    <div key={combo.id} className="flex justify-between mb-1">
                                        <span>{qty}x {combo.name}</span>
                                        <span className="font-bold">{(combo.price * qty).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-dashed border-gray-300 my-4"></div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-800">Tổng cộng</span>
                            <span className="text-2xl font-bold text-[#f26b38]">
                                {finalTotalPrice.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => navigate(-1)} className="w-1/2 py-2 text-[#f26b38] border border-[#f26b38] rounded font-semibold hover:bg-[#fff5f2]">Quay lại</button>
                            <button 
                                onClick={() => navigate(`/dat-ve/${id}/thanh-toan`, { state: { selectedSeats, comboCart, finalTotalPrice } })}
                                className="w-1/2 py-2 rounded text-white font-semibold transition-colors bg-[#f26b38] hover:bg-[#d95c2b]"
                            >
                                Tiếp tục
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}