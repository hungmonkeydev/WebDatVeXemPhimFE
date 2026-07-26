import { useState, useCallback } from 'react';
import { adminVoucherService } from '../services/adminVoucherService'; // Nhớ check lại đường dẫn

export const useAdminVouchers = () => {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalVouchers, setTotalVouchers] = useState(0);

    const fetchVouchers = useCallback(async (page: number, size: number, filters?: any) => {
        setIsLoading(true);
        try {
            const params: any = { page: page - 1, size, ...filters };
            const res = await adminVoucherService.getAll(params);
            if (res && res.data) {
                setVouchers(res.data.content || res.data);
                setTotalVouchers(res.data.totalElements || res.data.length || 0);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách voucher:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createVoucher = async (payload: any) => {
        setIsLoading(true);
        try {
            await adminVoucherService.create(payload);
            return { success: true, message: "Thêm voucher mới thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Vui lòng kiểm tra lại thông tin!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateVoucher = async (id: number, payload: any) => {
        setIsLoading(true);
        try {
            await adminVoucherService.update(id, payload);
            return { success: true, message: "Cập nhật thông tin voucher thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật voucher!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };

    const lockVoucher = async (id: number) => {
        setIsLoading(true);
        try {
            await adminVoucherService.lock(id);
            return { success: true, message: "Đã khóa voucher thành công!" };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Khóa voucher thất bại." };
        } finally {
            setIsLoading(false);
        }
    };

    const unlockVoucher = async (id: number) => {
        setIsLoading(true);
        try {
            await adminVoucherService.unlock(id);
            return { success: true, message: "Đã mở khóa voucher!" };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Mở khóa thất bại." };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        vouchers, totalVouchers, isLoading,
        fetchVouchers, createVoucher, updateVoucher, lockVoucher, unlockVoucher
    };
};