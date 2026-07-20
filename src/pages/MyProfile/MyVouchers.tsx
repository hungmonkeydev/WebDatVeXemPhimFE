// src/components/Voucher/MyVouchers.tsx
import { useMyVoucher } from '../../Hooks/useMyVouchers';

interface MyVouchersProps {
    isGuest?: boolean;
}

export default function MyVouchers({ isGuest = false }: MyVouchersProps) {
    const { vouchers, isLoadingVoucher } = useMyVoucher(isGuest);

    if (isLoadingVoucher) {
        return (
            <div className="text-center py-16 text-gray-500 font-medium">
                Đang tải voucher của bạn...
            </div>
        );
    }

    if (!vouchers || vouchers.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 font-medium">Bạn chưa có voucher nào.</p>
                <p className="text-sm text-gray-400 mt-1">Đổi điểm Stars hoặc theo dõi khuyến mãi để nhận voucher nhé!</p>
            </div>
        );
    }

    const getVoucherLabel = (v: any) => {
        if (v.voucherType === 'COMBO_DISCOUNT' && v.comboId && v.discountValue == null) {
            return `Tặng: ${v.comboName} x${v.comboQuantity}`;
        }

        if (v.voucherType === 'TICKET_DISCOUNT' || v.voucherType === 'COMBO_DISCOUNT' || v.voucherType === 'DISCOUNT') {
            return v.discountType === 'PERCENT'
                ? `Giảm ${v.discountValue}%`
                : `Giảm ${Number(v.discountValue || 0).toLocaleString('vi-VN')} đ`;
        }

        return `Thẻ quà tặng ${Number(v.currentBalance || 0).toLocaleString('vi-VN')} đ`;
    };
    const getVoucherTypeTag = (type: string) => {
        switch (type) {
            case 'TICKET_DISCOUNT': return { text: 'Giảm giá vé', color: 'bg-blue-100 text-blue-700' };
            case 'COMBO_DISCOUNT': return { text: 'Giảm giá bắp nước', color: 'bg-yellow-100 text-yellow-700' };
            default: return { text: 'Thẻ quà tặng', color: 'bg-green-100 text-green-700' };
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Voucher của tôi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vouchers.map((v: any) => {
                    const tag = getVoucherTypeTag(v.voucherType);
                    const isExpired = v.expiresAt ? new Date(v.expiresAt) < new Date() : false;
                    const isUsed = v.status === 'LOCKED' || v.status === 'USED';
                    const disabled = isExpired || isUsed;

                    return (
                        <div
                            key={v.voucherId}
                            className={`relative flex bg-white rounded-xl shadow-sm border overflow-hidden ${disabled ? 'opacity-50' : 'border-orange-200'
                                }`}
                        >
                            {/* Cuống vé bên trái */}
                            <div className="w-2 bg-[#f26b38]" />

                            <div className="flex-1 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tag.color}`}>
                                        {tag.text}
                                    </span>
                                    {isUsed && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                            Đã dùng
                                        </span>
                                    )}
                                    {isExpired && !isUsed && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                                            Hết hạn
                                        </span>
                                    )}
                                </div>

                                <p className="text-lg font-bold text-gray-800">{getVoucherLabel(v)}</p>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm font-mono tracking-wider text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        {v.code}
                                    </span>
                                    {v.expiresAt && (
                                        <span className="text-xs text-gray-400">
                                            HSD: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}