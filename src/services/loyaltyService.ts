import api from './api';

export type VoucherType = 'GIFT_CARD' | 'DISCOUNT' | 'COMBO';
export type DiscountType = 'AMOUNT' | 'PERCENTAGE';

export interface VoucherItem {
    voucherId: number;
    code: string;
    voucherType: VoucherType;
    status: string;
    originalValue: number;
    currentBalance: number;
    discountType: DiscountType;
    discountValue: number;
    comboName?: string;
}

export interface ApiResponse<T> {
    status: string;
    statusCode: string;
    message: string;
    timestamp: string;
    data: T;
}

export const loyaltyService = {
    getMyVouchers: () => {
        return api.get<ApiResponse<VoucherItem[]>>('/loyalty/my-vouchers');
    },
    redeemPoints: (pointsToRedeem: number) => {
        return api.post<ApiResponse<any>>('/loyalty/redeem', { points: pointsToRedeem });
    }
};