import api from './api';

export type VoucherType = 'GIFT_CARD' | 'TICKET_DISCOUNT' | 'COMBO_DISCOUNT';
export type RedemptionType = 'VOUCHER' | 'COMBO';

export interface VoucherItem {
    voucherId: number;
    code: string;
    voucherType: VoucherType;
    status: string;
    originalValue: number;
    currentBalance: number;
    discountType: 'AMOUNT' | 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    comboName?: string;
}

export interface RedeemRequestPayload {
    redemptionType: RedemptionType;
    pointsToUse?: number;
    comboId?: number;
    quantity?: number;
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

    redeemPoints: (payload: RedeemRequestPayload) => {
        return api.post<ApiResponse<any>>('/loyalty/redeem', payload);
    },
    getMyPointsSummary: () => {
        return api.get<ApiResponse<any>>('/loyalty/my-points');
    }
};