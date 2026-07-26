import { useState, useCallback } from 'react';
import { adminBookingService } from '../services/adminBookingService';

export const useAdminBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalBookings, setTotalBookings] = useState(0);

    const fetchBookings = useCallback(async (page: number, size: number, filters?: any) => {
        setIsLoading(true);
        try {
            const params: any = { page: page - 1, size, ...filters };
            const res = await adminBookingService.getAll(params);
            if (res && res.data) {
                setBookings(res.data.content || res.data);
                setTotalBookings(res.data.totalElements || res.data.length || 0);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách đơn hàng:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateBookingStatus = async (id: number, status: string) => {
        setIsLoading(true);
        try {
            await adminBookingService.updateStatus(id, { newStatus: status });
            return { success: true, message: "Cập nhật trạng thái đơn hàng thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật trạng thái!"
            };
        } finally {
            setIsLoading(false);
        }
    };

    const cancelBooking = async (id: number) => {
        setIsLoading(true);
        try {
            await adminBookingService.cancel(id);
            return { success: true, message: "Đã hủy đơn và giải phóng ghế thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Ép hủy đơn hàng thất bại."
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        bookings, totalBookings, isLoading,
        fetchBookings, updateBookingStatus, cancelBooking
    };
};