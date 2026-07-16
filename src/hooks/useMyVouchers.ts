import { useEffect, useState } from "react"
import { loyaltyService, type VoucherItem } from "../services/loyaltyService";

export const useMyVoucher = (isGuest: boolean) => {
    const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
    const [isLoadingVoucher, setIsLoadingVoucher] = useState<boolean>(false);

    useEffect(() => {
        if (isGuest) {
            return;
        }
        const fetchVouchers = async () => {
            setIsLoadingVoucher(true);
            try {
                const res = await loyaltyService.getMyVouchers();
                const active = (res.data?.data || []).filter(v => v.status === 'PENDING');
                setVouchers(active);
            } catch (error) {
                console.error("Lỗi lấy danh sách voucher:", error);
            } finally {
                setIsLoadingVoucher(false);
            }
        }
        fetchVouchers();
    }, [isGuest])
    return { vouchers, isLoadingVoucher };
}