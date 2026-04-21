// src/pages/FoodSelection.tsx
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import img from '../../public/promotion/buycombo.png'

export default function FoodSelection() {
    const navigate = useNavigate();
    const { id } = useParams();

    // 1. NHẬN "HÀNH LÝ" TỪ TRANG CHỌN GHẾ GỬI QUA
    const location = useLocation();
    const selectedSeats = location.state?.selectedSeats || [];
    const TICKET_PRICE = 85000;
    const totalTicketPrice = selectedSeats.length * TICKET_PRICE;

    // 2. STATE QUẢN LÝ GIỎ HÀNG COMBO
    const [combos, setCombos] = useState([
        {
            id: 1,
            name: 'Combo 2 Big Extra Premium',
            desc: '"Nhân đôi sự sảng khoái" Combo gồm 1 bắp rang bơ lớn, 2 Pepsi cỡ lớn + 1 snack Premium tuỳ chọn- tiết kiệm hơn 33,000!',
            price: 134000,
            image: img,
            quantity: 0
        },
        {
            id: 2,
            name: 'Snacking Combo 2',
            desc: '1 Bắp ngọt + 2 Nước bất kỳ + 1 Món ăn nhẹ (Gà Karaage / Lạp xưởng / Khoai tây bơ đường)',
            price: 169000,
            image: img,
            quantity: 0
        },
        {
            id: 3,
            name: 'Combo 1 Big Extra Premium',
            desc: '"Thỏa mãn cơn thèm" với 1 phần bắp rang bơ thơm ngon, 1 Pepsi mát lạnh và 1 gói snack Premium tuỳ chọn!',
            price: 115000,
            image: img,
            quantity: 0
        }
    ]);

    // Hàm tăng/giảm số lượng combo
    const updateQuantity = (comboId: number, delta: number) => {
        setCombos(prevCombos =>
            prevCombos.map(combo => {
                if (combo.id === comboId) {
                    const newQuantity = combo.quantity + delta;
                    // Không cho số lượng rớt xuống âm
                    return { ...combo, quantity: newQuantity >= 0 ? newQuantity : 0 };
                }
                return combo;
            })
        );
    };

    // Tính tổng tiền Combo đang chọn
    const totalComboPrice = combos.reduce((total, combo) => total + (combo.price * combo.quantity), 0);

    // TỔNG TIỀN CUỐI CÙNG = TIỀN VÉ + TIỀN COMBO
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

                    <div className="flex flex-col gap-6">
                        {combos.map(combo => (
                            <div key={combo.id} className="flex gap-6 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <img src={combo.image} alt={combo.name} className="w-24 h-24 object-cover rounded-md mix-blend-multiply" />

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-[15px] mb-1">{combo.name}</h3>
                                    <p className="text-gray-500 text-[13px] mb-2 leading-relaxed">{combo.desc}</p>
                                    <p className="font-bold text-gray-800 text-[14px]">
                                        Giá: <span className="text-gray-800">{combo.price.toLocaleString('vi-VN')} đ</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                                    <button
                                        onClick={() => updateQuantity(combo.id, -1)}
                                        className="w-6 h-6 flex justify-center items-center font-bold text-gray-500 hover:text-[#f26b38]"
                                    >-</button>
                                    <span className="text-[14px] font-semibold text-gray-800 w-4 text-center">{combo.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(combo.id, 1)}
                                        className="w-6 h-6 flex justify-center items-center font-bold text-gray-500 hover:text-[#f26b38]"
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CỘT PHẢI: BILL THANH TOÁN (STICKY) */}
                <div className="w-full lg:w-[350px]">
                    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">

                        <div className="flex gap-4 mb-4">
                            <img src="https://picsum.photos/id/1043/400/600" alt="Poster" className="w-24 rounded object-cover" />
                            <div>
                                <h3 className="font-bold text-gray-800 text-[15px] mb-1">Quỷ Dữ Từ Luyện Ngục</h3>
                                <p className="text-gray-500 text-[13px] mb-1">2D Phụ Đề <span className="bg-[#f26b38] text-white px-1 py-0.5 rounded text-[10px] font-bold">T18</span></p>
                            </div>
                        </div>

                        <div className="text-[14px] text-gray-700 font-medium mb-1">
                            <span className="font-bold">VieCinema Nguyễn Du</span> - RẠP 3
                        </div>
                        <div className="text-[14px] text-gray-700 mb-4">
                            Suất: <span className="font-bold">23:00</span> - Hôm nay, <span className="font-bold">13/04/2026</span>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-4 text-[14px] text-gray-700">
                            {/* Hiển thị tiền vé */}
                            <div className="flex justify-between mb-1">
                                <span>{selectedSeats.length}x Ghế</span>
                                <span className="font-bold">{totalTicketPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-3">Ghế: <span className="font-bold text-gray-800">{selectedSeats.join(', ')}</span></div>

                            {/* Hiển thị tiền Combo (Chỉ hiện khi có mua) */}
                            {combos.filter(c => c.quantity > 0).map(combo => (
                                <div key={combo.id} className="flex justify-between mb-1">
                                    <span>{combo.quantity}x {combo.name}</span>
                                    <span className="font-bold">{(combo.price * combo.quantity).toLocaleString('vi-VN')} đ</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-300 my-4"></div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-800">Tổng cộng</span>
                            <span className="text-2xl font-bold text-[#f26b38]">
                                {finalTotalPrice.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => navigate(-1)} className="w-1/2 py-2 text-[#f26b38] font-semibold hover:underline">Quay lại</button>
                            <button className="w-1/2 py-2 rounded text-white font-semibold transition-colors bg-[#f26b38] hover:bg-[#d95c2b]">
                                Tiếp tục
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}