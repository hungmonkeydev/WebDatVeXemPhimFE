// src/pages/PaymentPage.tsx
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BookingSummary from '../components/booking/BookingSummary';
import { bookingService } from '../services/bookingService';

export default function PaymentPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();
    const bookingData = location.state;

    const [promoCode, setPromoCode] = useState('');
    const [points, setPoints] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');

    const [guestInfo, setGuestInfo] = useState({ fullName: '', email: '', phone: '' });
    const [guestErrors, setGuestErrors] = useState({ fullName: '', email: '', phone: '' });

    // BẢO MẬT: Chặn khách lạ vô thẳng link
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

    const {
        selectedSeats,
        comboCart,
        finalTotalPrice,
        showtimeInfo,
        roomInfo,
        expireAt,
        isGuest
    } = bookingData;

    let startTimeDisplay = '...';
    let dateDisplay = '...';
    if (showtimeInfo && showtimeInfo.startTime) {
        startTimeDisplay = showtimeInfo.startTime.substring(11, 16);
        const dateObj = new Date(showtimeInfo.startTime.replace('Z', ''));
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        dateDisplay = `${dayNames[dateObj.getDay()]}, ${dateObj.toLocaleDateString('vi-VN')}`;
    }

    // HÀM XỬ LÝ KHI BẤM NÚT "THANH TOÁN"
    const handleProcessPayment = async () => {
        if (paymentMethod !== 'VNPAY') {
            alert(`Tính năng thanh toán qua ${paymentMethod} đang được nâng cấp!`);
            return;
        }

        // KIỂM TRA LỖI (VALIDATE)
        if (isGuest) {
            let isValid = true;
            const newErrors = { fullName: '', email: '', phone: '' };

            if (!guestInfo.fullName.trim()) {
                newErrors.fullName = 'Vui lòng nhập họ tên!';
                isValid = false;
            }

            if (!guestInfo.phone.trim()) {
                newErrors.phone = 'Vui lòng nhập số điện thoại!';
                isValid = false;
            } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(guestInfo.phone)) {
                newErrors.phone = 'Số điện thoại không hợp lệ!';
                isValid = false;
            }

            if (!guestInfo.email.trim()) {
                newErrors.email = 'Vui lòng nhập email!';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
                newErrors.email = 'Email không đúng định dạng!';
                isValid = false;
            }

            setGuestErrors(newErrors);

            if (!isValid) return;
        }

        // HIỆN BẢNG XÁC NHẬN (CONFIRM)
        const userConfirmed = window.confirm(
            "Vui lòng kiểm tra lại thông tin ghế, bắp nước và thông tin liên hệ 1 lần nữa.\n\nBạn đã chắc chắn muốn tiến hành thanh toán?"
        );

        if (!userConfirmed) {
            return;
        }

        // GỌI API TẠO VÉ VÀ VNPAY
        let actualBookingId = bookingData?.bookingId;
        try {
            if (isGuest) {
                const guestPayload = {
                    showtimeId: Number(id),
                    seatIds: selectedSeats.map((seat: any) => seat.id || seat.seatId),
                    combos: Object.keys(comboCart).map(comboId => ({
                        comboId: Number(comboId),
                        quantity: comboCart[Number(comboId)]
                    })),
                    fullName: guestInfo.fullName,
                    email: guestInfo.email,
                    phoneNumber: guestInfo.phone
                };

                console.log("Đang tạo vé cho Guest...", guestPayload);
                const guestRes = await bookingService.guestCreateBooking(guestPayload);
                actualBookingId = guestRes.data?.bookingId || guestRes.data?.id || guestRes.data?.data?.bookingId;

                if (!actualBookingId) {
                    alert("Có lỗi khi tạo vé cho khách vãng lai!");
                    return;
                }
            }

            const vnpayPayload = {
                bookingId: actualBookingId,
                amount: finalTotalPrice,
                orderInfo: `Thanh toan ma ve ${actualBookingId}`,
                bankCode: "",
                locale: "vn"
            };

            console.log("🚨 ĐANG GỌI API VNPAY VỚI PAYLOAD:", vnpayPayload);
            const response = isGuest
                ? await bookingService.createPaymentUrlForGuest(vnpayPayload)
                : await bookingService.createPaymentUrl(vnpayPayload);

            const vnpayUrl = response.data?.data?.paymentUrl || response.data?.paymentUrl || response.data?.url;
            if (vnpayUrl && vnpayUrl.startsWith('http')) {
                window.location.href = vnpayUrl;
            } else {
                alert("Không tìm thấy đường link thanh toán từ Backend trả về!");
            }

        } catch (error: any) {
            console.error("Lỗi thanh toán:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("❌ Lỗi bảo mật: Bạn chưa đăng nhập hoặc Token hết hạn (Lỗi 401/403)!");
            } else {
                const errorMsg = error.response?.data?.message || "Lỗi kết nối đến server!";
                alert(`❌ Không thể khởi tạo thanh toán: ${errorMsg}`);
            }
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen pb-20">
            {/* ====== THANH TIẾN ĐỘ ====== */}
            <div className="hidden md:block bg-white shadow-sm mb-8">
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
                <div className="flex-1 flex flex-col gap-6">

                    {/*FORM NHẬP THÔNG TIN CHO KHÁCH VÃNG LAI */}
                    {isGuest && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-orange-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 text-[#f26b38]">Thông Tin Liên Hệ (Bắt buộc)</h2>
                            <p className="text-sm text-gray-500 mb-6">Vui lòng điền chính xác thông tin để chúng tôi gửi vé điện tử cho bạn.</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                                    <input
                                        type="text"
                                        value={guestInfo.fullName}
                                        onChange={(e) => {
                                            setGuestInfo({ ...guestInfo, fullName: e.target.value });
                                            setGuestErrors({ ...guestErrors, fullName: '' });
                                        }}
                                        placeholder="VD: Nguyễn Văn A"
                                        className={`w-full border rounded px-4 py-2 focus:outline-none ${guestErrors.fullName ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#f26b38]'}`}
                                    />
                                    {guestErrors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{guestErrors.fullName}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            value={guestInfo.phone}
                                            onChange={(e) => {
                                                setGuestInfo({ ...guestInfo, phone: e.target.value });
                                                setGuestErrors({ ...guestErrors, phone: '' });
                                            }}
                                            placeholder="VD: 0912345678"
                                            className={`w-full border rounded px-4 py-2 focus:outline-none ${guestErrors.phone ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#f26b38]'}`}
                                        />
                                        {guestErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{guestErrors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={guestInfo.email}
                                            onChange={(e) => {
                                                setGuestInfo({ ...guestInfo, email: e.target.value });
                                                setGuestErrors({ ...guestErrors, email: '' });
                                            }}
                                            placeholder="VD: email@domain.com"
                                            className={`w-full border rounded px-4 py-2 focus:outline-none ${guestErrors.email ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#f26b38]'}`}
                                        />
                                        {guestErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{guestErrors.email}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KHUYẾN MÃI (CHỈ HIỆN KHI LÀ USER ĐÃ ĐĂNG NHẬP) */}
                    {!isGuest && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-6">Khuyến mãi</h2>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã khuyến mãi</label>
                                <div className="flex gap-4">
                                    <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Nhập mã khuyến mãi" className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f26b38]" />
                                    <button onClick={() => alert(`Đang kiểm tra mã: ${promoCode}`)} className="bg-[#f26b38] hover:bg-[#d95c2b] text-white font-semibold px-6 py-2 rounded">Áp Dụng</button>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 my-4"></div>
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Áp dụng điểm Stars
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        Khả dụng: <strong className="text-[#f26b38]">{10}</strong> điểm
                                    </span>
                                </div>

                                {/* Ô nhập điểm và nút Áp dụng */}
                                <div className="flex gap-4 mb-3">
                                    <input
                                        type="number"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        placeholder="Nhập số điểm cần dùng..."
                                        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#f26b38]"
                                    />
                                    <button
                                        onClick={() => alert(`Đang trừ: ${points} điểm`)}
                                        className="bg-[#f26b38] hover:bg-[#d95c2b] text-white font-semibold px-6 py-2 rounded transition-colors"
                                    >
                                        Áp Dụng
                                    </button>
                                </div>

                                {/* BẢNG HƯỚNG DẪN DÀNH CHO KHÁCH HÀNG Ở ĐÂY */}
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
                                        <span>⭐</span> Thông tin điểm Stars
                                    </h4>
                                    <ul className="text-[13px] text-blue-700 list-disc pl-5 space-y-1.5">
                                        <li><strong>Tỷ lệ quy đổi:</strong> 1 điểm Star = 1.000 VNĐ.</li>
                                        <li>Điểm Stars có thể dùng để giảm giá trực tiếp vào tổng hóa đơn mua vé và bắp nước.</li>
                                        <li>Tích lũy thêm điểm thưởng sau mỗi giao dịch hoàn tất (1 điểm cho mỗi 10.000 VNĐ thanh toán).</li>
                                        <li>
                                            <strong>Đặc quyền chiết khấu theo hạng thành viên:</strong>
                                            <ul className="list-[circle] pl-5 mt-1 space-y-1 text-blue-800">
                                                <li>
                                                    <span className="font-bold text-slate-500">Silver:</span> Giảm 5% (Yêu cầu đạt 1.000 điểm)
                                                </li>
                                                <li>
                                                    <span className="font-bold text-yellow-600">Gold:</span> Giảm 10% (Yêu cầu đạt 5.000 điểm)
                                                </li>
                                                <li>
                                                    <span className="font-bold text-cyan-600">Diamond:</span> Giảm 15% (Yêu cầu đạt 10.000 điểm)
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LỰA CHỌN PHƯƠNG THỨC THANH TOÁN */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4 uppercase">Phương thức thanh toán</h2>
                        <div className="flex flex-col gap-4">
                            <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                                <div className="font-bold text-blue-800 text-xl tracking-wider mr-2">VNPAY</div>
                                <span className="text-[15px] text-gray-700 font-medium">Thanh toán qua VNPAY</span>
                            </label>
                        </div>
                    </div>

                </div>

                {/* CỘT PHẢI: BILL THANH TOÁN */}
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
                    combos={bookingData.combos}
                    comboCart={comboCart}
                    onBack={() => navigate(-1)}
                    onNext={handleProcessPayment}
                    nextLabel="Thanh toán ngay"
                />
            </div>
        </div>
    );
}