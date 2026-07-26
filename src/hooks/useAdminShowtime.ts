import { useState, useCallback } from 'react';
import { adminShowtimeService } from '../services/adminShowtimeService';

export const useAdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalShowtimes, setTotalShowtimes] = useState(0);

    const fetchShowtimes = useCallback(async (page: number, size: number) => {
        setIsLoading(true);
        try {
            const res = await adminShowtimeService.getAll({ page: page - 1, size: size });
            if (res && res.data) {
                setShowtimes(res.data);
                setTotalShowtimes(res.data.totalElements || 0);
            }
        } catch (error) {
            console.error("Lỗi fetch suất chiếu:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    const createShowtime = async (payload: any) => {
        setIsLoading(true);
        try {
            await adminShowtimeService.create(payload);
            return { success: true, message: "Thêm suất chiếu mới thành công!" };
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

    const updateShowtime = async (id: number, payload: any) => {
        setIsLoading(true);
        try {
            await adminShowtimeService.update(id, payload);
            return { success: true, message: "Cập nhật suất chiếu thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật suất chiếu!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };
    const deleteShowtime = async (id: number) => {
        setIsLoading(true);
        try {
            await adminShowtimeService.delete(id);
            return { success: true, message: "Đã xóa suất chiếu thành công!" };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || "Xóa thất bại! Suất chiếu có thể đã có người đặt vé." };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        showtimes,
        totalShowtimes,
        isLoading,
        fetchShowtimes,
        createShowtime,
        updateShowtime,
        deleteShowtime
    };
};