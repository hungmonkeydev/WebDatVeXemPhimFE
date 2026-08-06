import React, { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyaltyService';
import { bookingService } from '../services/bookingService';

const REDEEM_RATE = 1000; 
const MIN_POINTS_TO_REDEEM = 50;

const LoyaltyStore = () => {
    const [currentPoints, setCurrentPoints] = useState<number>(0);
    const [combos, setCombos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loyaltyData, setLoyaltyData] = useState<any>(null);
    const [pointsInput, setPointsInput] = useState<number | ''>('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const pointsRes = await loyaltyService.getMyPointsSummary();
                if (pointsRes.data?.status === 'success') {
                    setCurrentPoints(pointsRes.data.data.currentPoints || 0);
                    setLoyaltyData(pointsRes.data.data);
                }

                const combosRes = await bookingService.getCombos();
                if (combosRes.data?.status === 'success') {
                    setCombos(combosRes.data.data);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Xử lý đổi Voucher giảm giá
    const handleRedeemVoucher = async () => {
        const pointsToUse = Number(pointsInput);

        if (!pointsToUse || pointsToUse < MIN_POINTS_TO_REDEEM) {
            alert(`Vui lòng nhập tối thiểu ${MIN_POINTS_TO_REDEEM} điểm (tương đương ${(MIN_POINTS_TO_REDEEM * REDEEM_RATE).toLocaleString()}đ)!`);
            return;
        }
        if (pointsToUse > currentPoints) {
            alert("Bạn không có đủ số điểm này!");
            return;
        }

        const confirm = window.confirm(`Dùng ${pointsToUse} điểm để lấy Voucher giảm ${(pointsToUse * REDEEM_RATE).toLocaleString()}đ?`);
        if (!confirm) return;

        try {
            const res = await loyaltyService.redeemPoints({
                redemptionType: 'VOUCHER',
                pointsToUse: pointsToUse
            });

            if (res.data.status === 'success') {
                alert(`🎉 Đổi thành công! Voucher đã được thêm vào ví của bạn.`);
                setCurrentPoints(res.data.data.remainingPoints);
                setPointsInput(''); 
            }
        } catch (error: any) {
            alert("Đổi quà thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
        }
    };

    // Xử lý đổi Combo bắp nước
    const handleRedeemCombo = async (combo: any) => {
        console.log("Cục combo nè:", combo);
        // Tính toán số điểm cần thiết dựa trên tỉ giá mới (ví dụ combo 85.000đ / 1000 = 85 điểm)
        const pointsNeeded = Math.ceil(combo.price / REDEEM_RATE);

        if (currentPoints < pointsNeeded) {
            alert(`Bạn cần ${pointsNeeded} điểm để đổi Combo này!`);
            return;
        }

        const confirm = window.confirm(`Dùng ${pointsNeeded} điểm để đổi ${combo.name}?`);
        if (!confirm) return;
        try {
            const res = await loyaltyService.redeemPoints({
                redemptionType: 'COMBO',
                comboId: combo.comboId ?? combo.id,
                quantity: 1
            });

            if (res.data.status === 'success') {
                alert(`🍿 Đổi thành công Combo ${combo.name}! Quà đã nằm trong ví của bạn.`);
                setCurrentPoints(res.data.data.remainingPoints);
            }
        } catch (error: any) {
            alert("Đổi quà thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-xl font-semibold text-gray-600">Đang tải Kho Quà Tặng...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            {/* Header Điểm Tích Lũy */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-2xl p-8 mb-10 text-center shadow-xl">
                <h1 className="text-3xl font-bold mb-2">VieCinema Rewards</h1>

                {/* Render Hạng Thành Viên*/}
                {loyaltyData && (
                    <div className="mb-4">
                        <span
                            className="inline-block px-4 py-1 rounded-full font-bold bg-white shadow-sm"
                            style={{ color: loyaltyData.tierColorCode || '#C0C0C0' }}
                        >
                            Hạng: {loyaltyData.membershipTierName}
                        </span>
                        <p className="text-sm mt-2 opacity-80">
                            Cần {loyaltyData.pointsToNextTier} điểm nữa để lên hạng {loyaltyData.nextTierName}
                        </p>
                    </div>
                )}

                <p className="text-lg opacity-90">Điểm tích lũy hiện tại của bạn</p>
                <p className="text-5xl font-black text-yellow-400 mt-4 drop-shadow-md">
                    {currentPoints.toLocaleString()} <span className="text-2xl">Stars</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Khu Vực 1: Đổi Voucher Bằng Điểm (Bên trái) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3 mb-6">
                        Đổi Voucher Giảm Giá
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập số điểm muốn đổi (Tối thiểu {MIN_POINTS_TO_REDEEM})
                        </label>
                        <input
                            type="number"
                            min={MIN_POINTS_TO_REDEEM}
                            max={currentPoints}
                            value={pointsInput}
                            onChange={(e) => setPointsInput(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-bold text-blue-600"
                            placeholder="Ví dụ: 50"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                        <p className="text-sm text-gray-600 mb-1">Bạn sẽ nhận được Voucher trị giá:</p>
                        <p className="text-2xl font-bold text-green-600">
                            {pointsInput ? (Number(pointsInput) * REDEEM_RATE).toLocaleString() : 0} VNĐ
                        </p>
                    </div>

                    <button
                        onClick={handleRedeemVoucher}
                        disabled={!pointsInput || Number(pointsInput) < MIN_POINTS_TO_REDEEM || Number(pointsInput) > currentPoints}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Đổi Voucher Ngay
                    </button>
                </div>

                {/* Khu Vực 2: Đổi Combo Bắp Nước (Bên phải) */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 border-l-4 border-yellow-500 pl-3 mb-6">
                        Đổi Combo Bắp Nước
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {combos.filter(c => c.isActive).map((combo) => {
                            // Số điểm = giá combo / 1000
                            const pointsNeeded = Math.ceil(combo.price / REDEEM_RATE);
                            const canAfford = currentPoints >= pointsNeeded;

                            return (
                                <div
                                    key={combo.id}
                                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all"
                                >
                                    {/* Ảnh full width + badge điểm */}
                                    <div className="relative">
                                        <img
                                            src={combo.imageUrl}
                                            alt={combo.name}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Combo';
                                            }}
                                        />
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {pointsNeeded.toLocaleString()} Stars
                                        </span>
                                    </div>

                                    {/* Nội dung */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-gray-800">{combo.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{combo.description}</p>

                                        <button
                                            onClick={() => handleRedeemCombo(combo)}
                                            disabled={!canAfford}
                                            className={`mt-4 w-full py-2.5 rounded-lg font-bold transition-all ${canAfford
                                                ? 'bg-[#f26b38] hover:bg-[#d95c2b] text-white shadow-md'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {canAfford ? 'Đổi Quà' : 'Chưa đủ điểm'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoyaltyStore;