// src/pages/PaymentPage.tsx
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BookingSummary from '../components/Booking/BookingSummary';
import { bookingService } from '../services/bookingService';
import { useMyVoucher } from '../Hooks/useMyVouchers';
import { useLoyaltyProgress } from '../Hooks/useLoyaltyProgress';
export default function PaymentPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();
    const bookingData = location.state;


    const [points, setPoints] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');

    const [guestInfo, setGuestInfo] = useState({ fullName: '', email: '', phone: '' });
    const [guestErrors, setGuestErrors] = useState({ fullName: '', email: '', phone: '' });

    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const { progressData } = useLoyaltyProgress() || {};
    const { vouchers: myVoucher, isLoadingVoucher } = useMyVoucher(bookingData?.isGuest || false);
    const [usedPoints, setUsedPoints] = useState(0);
    const availablePoints = progressData?.data?.currentPoints || progressData?.currentPoints || 0;
    const [voucherInput, setVoucherInput] = useState('');

    const [isVoucherApplied, setIsVoucherApplied] = useState(false);

    // Tính discount mặc định ngay khi vào trang (membership discount, loyalty discount...)
    useEffect(() => {
        if (!bookingData || bookingData.selectedSeats?.length === 0 || bookingData.isGuest) return;

        const fetchInitialDiscount = async () => {
            try {
                const payload = {
                    showtimeId: Number(id),
                    seatIds: bookingData.selectedSeats.map((s: any) => s.seatId),
                    combos: Object.keys(bookingData.comboCart || {})
                        .map(comboId => ({
                            comboId: Number(comboId),
                            quantity: bookingData.comboCart[Number(comboId)]
                        }))
                        .filter(c => c.quantity > 0),
                    promotionCode: null,
                    ticketVoucherId: null,
                    comboVoucherId: null
                };

                const response = await bookingService.getBookingCaculate(payload);
                if (response.data && response.data.status === 'success') {
                    const data = response.data.data;
                    const discount = data.pricingBreakdown.totalDiscount;
                    setDiscountAmount(discount);
                }
            } catch (error) {
                console.error("Lỗi khi tải giảm giá mặc định:", error);
            }
        };

        fetchInitialDiscount();
    }, []);

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
        combos,
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
            } else if (!/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(guestInfo.fullName.trim()) || guestInfo.fullName.trim().length < 2) {
                newErrors.fullName = 'Họ tên chỉ được chứa chữ cái và phải từ 2 ký tự trở lên!';
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
            } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(guestInfo.email.trim())) {
                newErrors.email = 'Vui lòng sử dụng email đuôi @gmail.com!';
                isValid = false;
            }

            setGuestErrors(newErrors);

            if (!isValid) return;
        }

        // HIỆN BẢNG XÁC NHẬN (CONFIRM)
        Modal.confirm({
            title: 'Xác nhận thanh toán',
            content: 'Vui lòng kiểm tra lại thông tin ghế, bắp nước và thông tin liên hệ 1 lần nữa. Bạn đã chắc chắn muốn tiến hành thanh toán?',
            okText: 'Thanh toán ngay',
            cancelText: 'Hủy bỏ',
            onOk: async () => {
                // GỌI API TẠO VÉ VÀ VNPAY
                let actualBookingId = null;
                try {
                    if (isGuest) {
                        const guestPayload = {
                            showtimeId: Number(id),
                            seatIds: selectedSeats.map((seat: any) => seat.id || seat.seatId),
                            combos: Object.keys(comboCart || {}).map(comboId => ({
                                comboId: Number(comboId),
                                quantity: comboCart[Number(comboId)]
                            })),
                            fullName: guestInfo.fullName,
                            email: guestInfo.email,
                            phoneNumber: guestInfo.phone,
                            //promoCode: isVoucherApplied && voucherInput ? voucherInput.trim() : null,
                            //promotionCode: isVoucherApplied && voucherInput ? voucherInput.trim() : null
                        };

                        console.log("Đang tạo vé cho Guest...", guestPayload);
                        const guestRes = await bookingService.guestCreateBooking(guestPayload);
                        actualBookingId = guestRes.data?.bookingId || guestRes.data?.id || guestRes.data?.data?.bookingId || guestRes.data?.data?.id;
                        if (!actualBookingId) {
                            alert("Có lỗi khi tạo vé cho khách vãng lai!");
                            return;
                        }
                    }
                    else {
                        const userPayload = {
                            showtimeId: Number(id),
                            seatIds: selectedSeats.map((seat: any) => seat.id || seat.seatId),
                            combos: Object.keys(comboCart).map(comboId => ({
                                comboId: Number(comboId),
                                quantity: comboCart[Number(comboId)]
                            })),
                            useLoyaltyPoints: usedPoints > 0,
                            loyaltyPointsToUse: usedPoints > 0 ? usedPoints : 0,
                            ticketVoucherId: isVoucherApplied && selectedVoucher?.voucherType === 'TICKET_DISCOUNT' ? selectedVoucher.voucherId : null,
                            comboVoucherId: isVoucherApplied && selectedVoucher?.voucherType === 'COMBO_DISCOUNT' ? selectedVoucher.voucherId : null,
                            promoCode: isVoucherApplied && voucherInput ? voucherInput.trim() : null,
                            promotionCode: isVoucherApplied && voucherInput ? voucherInput.trim() : null
                        };

                        console.log("Đang tạo vé cho User...", userPayload);
                        const userRes = await bookingService.createBooking(userPayload);
                        actualBookingId = userRes.data?.data?.bookingId || userRes.data?.data?.id || userRes.data?.id || userRes.data?.bookingId;
                        const actualBookingCode = userRes.data?.data?.bookingCode || userRes.data?.bookingCode || actualBookingId;
                        
                        if (!actualBookingId) {
                            console.error("userRes error:", userRes);
                            alert("Có lỗi khi tạo vé cho thành viên! Vui lòng thử lại.");
                            return;
                        }
                        
                        // Xử lý 0đ ngay đây thay vì ở dưới
                        if (actualAmountToPay === 0) {
                            const codeToPass = isGuest ? actualBookingId : actualBookingCode;
                            navigate(`/booking/payment-success?bookingCode=${codeToPass}`); return;
                        }
                    }
                    localStorage.setItem('successBookingCode', actualBookingId);
                    const vnpayPayload = {
                        bookingId: actualBookingId,
                        amount: actualAmountToPay,
                        orderInfo: `Thanh toan ma ve ${actualBookingId}`,
                        bankCode: "",
                        locale: "vn"
                    };
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

                        // Nếu lỗi do ghế đã bị đặt thì đẩy về lại trang chọn ghế
                        if (errorMsg.toLowerCase().includes('seat') || errorMsg.toLowerCase().includes('ghế')) {
                            window.location.href = `/dat-ve/${id}/chon-ghe`;
                        }
                    }
                }
            }
        });
    };
    // const handleApplyPoints = () => {
    //     const p = Number(points);
    //     if (isNaN(p) || p <= 0) {
    //         alert("Vui lòng nhập số điểm hợp lệ!");
    //         return;
    //     }
    //     if (p > availablePoints) {
    //         alert(`Rất tiếc, bạn chỉ có tối đa ${availablePoints} điểm Stars!`);
    //         return;
    //     }
    //     const remainingBill = finalTotalPrice - discountAmount;
    //     const maxPointsCanUse = Math.ceil(remainingBill / 1000);

    //     if (p > maxPointsCanUse) {
    //         alert(`Hóa đơn của bạn chỉ cần tối đa ${maxPointsCanUse} điểm là được miễn phí rồi!`);
    //         setUsedPoints(maxPointsCanUse);
    //         setPoints(maxPointsCanUse.toString());
    //         return;
    //     }

    //     setUsedPoints(p);
    //     alert(`Áp dụng thành công! Bạn dùng ${p} điểm để giảm ${(p * 1000).toLocaleString('vi-VN')} đ`);
    // };
    const handleApplyVoucher = async (voucherToApply: any = selectedVoucher) => {
        if (!voucherToApply && !voucherInput) {
            setDiscountAmount(0);
            setIsVoucherApplied(false);
            return;
        }

        try {
            const payload = {
                showtimeId: Number(id),
                seatIds: bookingData.selectedSeats.map((s: any) => s.seatId),
                combos: Object.keys(comboCart || {})
                    .map(comboId => ({
                        comboId: Number(comboId),
                        quantity: comboCart[Number(comboId)]
                    }))
                    .filter(c => c.quantity > 0), // tránh gửi combo có quantity 0 lên backend
                promotionCode: voucherInput ? voucherInput.trim() : null,
                ticketVoucherId: voucherToApply?.voucherType === 'TICKET_DISCOUNT' ? voucherToApply.voucherId : null,
                comboVoucherId: voucherToApply?.voucherType === 'COMBO_DISCOUNT' ? voucherToApply.voucherId : null
            };
            console.log('PAYLOAD', payload);

            const response = await bookingService.getBookingCaculate(payload);

            if (response.data && response.data.status === 'success') {
                const data = response.data.data;
                const discount = data.pricingBreakdown.totalDiscount;

                setDiscountAmount(discount);
                setIsVoucherApplied(true);

                const effectiveDiscount = Math.min(discount, finalTotalPrice);
                alert(`Áp dụng thành công! Giảm ${effectiveDiscount.toLocaleString('vi-VN')} đ`);
            } else {
                alert(response.data.message || "Mã giảm giá không hợp lệ!");
                setDiscountAmount(0);
                setIsVoucherApplied(false);
            }

        } catch (error: any) {
            console.error("Lỗi gọi API tính tiền:", error);
            alert(error.response?.data?.message || "Không thể tính toán khuyến mãi lúc này. Vui lòng thử lại!");
            setDiscountAmount(0);
            setIsVoucherApplied(false);
        }
    };

    const pointsDiscount = usedPoints * 1000;
    const actualAmountToPay = Math.max(0, finalTotalPrice - discountAmount - pointsDiscount);
    return (
        <div className="w-full bg-gray-50 min-h-screen pb-20">
            {/* ====== THANH TIẾN ĐỘ ====== */}
            <div className="hidden md:block bg-white shadow-sm mb-8">
                <div className="max-w-6xl mx-auto flex justify-center gap-8 py-4 text-sm font-semibold">
                    <span className="text-gray-400">Chọn phim / Rạp / Suất</span>
                    <span className="text-gray-400">Chọn ghế</span>
                    <span className="text-gray-400 cursor-pointer hover:text-blue-700" onClick={() => navigate(`/dat-ve/${id}/thuc-an`, { state: bookingData })}>Chọn thức ăn</span>
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
                            <div className="flex items-center gap-3 md:gap-8 mb-8 border-b border-gray-200 pb-2 w-full">
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
                                    <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Khuyến mãi</h2>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Nhập hoặc chọn mã khuyến mãi của bạn</label>

                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã khuyến mãi ở đây..."
                                        value={voucherInput}
                                        onChange={(e) => {
                                            setVoucherInput(e.target.value.toUpperCase());
                                        }}
                                        className="flex-1 border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] uppercase text-sm font-medium"
                                    />
                                    <button
                                        onClick={() => handleApplyVoucher(selectedVoucher)}
                                        className="bg-[#f26b38] hover:bg-[#d95c2b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded whitespace-nowrap transition-colors shadow-sm"
                                    >
                                        Áp Dụng
                                    </button>
                                </div>

                                {/* THÔNG BÁO GIẢM GIÁ */}
                                {discountAmount > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-6">
                                        <p className="text-green-700 text-sm font-semibold">
                                            ✓ Áp dụng thành công! Đã giảm: {discountAmount.toLocaleString('vi-VN')} đ
                                        </p>
                                    </div>
                                )}

                                {/* DANH SÁCH VOUCHER CÓ SẴN (Gợi ý) */}
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mã giảm giá của bạn</p>

                                {isLoadingVoucher && (
                                    <p className="text-sm text-gray-400 py-2">Đang tải ưu đãi...</p>
                                )}

                                {!isLoadingVoucher && (!myVoucher || myVoucher.length === 0) && (
                                    <p className="text-sm text-gray-400 py-2 italic">Bạn chưa có voucher nào khả dụng.</p>
                                )}

                                {!isLoadingVoucher && myVoucher && myVoucher.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        {myVoucher.map((v: any) => {
                                            const isSelected = selectedVoucher?.voucherId === v.voucherId;
                                            let label = '';
                                            if (v.voucherType === 'GIFT_CARD') {
                                                label = `Thẻ quà tặng ${Number(v.currentBalance || 0).toLocaleString('vi-VN')} đ`;
                                            } else if (v.voucherType === 'COMBO_DISCOUNT') {
                                                label = `Voucher Combo: ${v.comboName || 'Không rõ'}`;
                                            } else {
                                                label = v.discountType === 'PERCENT'
                                                    ? `Giảm ${v.discountValue}% vé`
                                                    : `Giảm ${Number(v.discountValue || 0).toLocaleString('vi-VN')} đ vé`;
                                            }

                                            return (
                                                <button
                                                    key={v.voucherId}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedVoucher(null);
                                                        } else {
                                                            if (v.voucherType === 'COMBO_DISCOUNT') {
                                                                const comboNamesInCart = combos.filter((c: any) => comboCart[c.comboId || c.id] > 0)
                                                                    .map((c: any) => c.name);
                                                                if (!comboNamesInCart.includes(v.comboName)) {
                                                                    alert(`Voucher này chỉ áp dụng cho combo "${v.comboName}". Vui lòng quay lại trang chọn thức ăn để thêm vào giỏ hàng!`);
                                                                    return;
                                                                }
                                                            }
                                                            setSelectedVoucher(v);
                                                            handleApplyVoucher(v);
                                                        }
                                                    }}
                                                    className={`text-left flex items-center gap-3 border rounded-lg p-3 transition-colors ${isSelected
                                                        ? 'border-[#f26b38] bg-orange-50 ring-1 ring-[#f26b38]'
                                                        : 'border-gray-200 hover:border-orange-300'
                                                        }`}
                                                >
                                                    <div className={`w-1.5 self-stretch rounded ${isSelected ? 'bg-[#f26b38]' : 'bg-gray-200'}`} />
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-800 text-sm">{label}</p>
                                                        <p className="text-xs text-gray-400 font-mono mt-0.5">{v.code}</p>
                                                    </div>
                                                    {isSelected && <span className="text-[#f26b38] text-lg leading-none">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* LỰA CHỌN PHƯƠNG THỨC THANH TOÁN */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 md:gap-8 mb-8 border-b border-gray-200 pb-2 w-full">

                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
                                <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Phương thức thanh toán</h2>
                            </div>
                        </div>
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
                    totalPrice={actualAmountToPay}
                    remainingSeconds={bookingData.remainingSeconds ?? 600}
                    expireAt={expireAt}
                    onTimeout={() => {
                        alert("Đã hết thời gian giữ ghế! Vui lòng chọn lại từ đầu.");
                        navigate(`/dat-ve/${id}/chon-ghe`);
                    }}
                    combos={bookingData.combos}
                    comboCart={comboCart}
                    onBack={() => navigate(`/dat-ve/${id}/thuc-an`, { state: bookingData })}
                    onNext={handleProcessPayment}
                    nextLabel="Thanh toán ngay"
                />
            </div>
        </div>
    );
}