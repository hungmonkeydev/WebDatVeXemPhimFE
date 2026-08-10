import { useState, useCallback } from 'react';
import { adminPromotionService } from '../services/adminPromotionService';

export const useAdminPromotions = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPromotions, setTotalPromotions] = useState(0);

    const fetchPromotions = useCallback(async (page: number, size: number, filters?: any) => {
        setIsLoading(true);
        try {
            const params: any = { page: page - 1, size, ...filters };
            const res = await adminPromotionService.getAll(params);
            if (res && res.data) {
                // Tùy thuộc vào backend trả về Page object hay List
                const content = res.data.content || res.data.data?.content || res.data.data || res.data;
                const total = res.data.totalElements || res.data.data?.totalElements || content.length || 0;
                setPromotions(content);
                setTotalPromotions(total);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách promotion:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createPromotion = async (payload: any) => {
        setIsLoading(true);
        try {
            await adminPromotionService.create(payload);
            return { success: true, message: "Thêm khuyến mãi mới thành công!" };
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

    const updatePromotion = async (id: number, payload: any) => {
        setIsLoading(true);
        try {
            await adminPromotionService.update(id, payload);
            return { success: true, message: "Cập nhật thông tin khuyến mãi thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật khuyến mãi!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deletePromotion = async (id: number) => {
        setIsLoading(true);
        try {
            await adminPromotionService.delete(id);
            return { success: true, message: "Đã xóa khuyến mãi thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Xóa thất bại! Khuyến mãi có thể đang được sử dụng."
            };
        } finally {
            setIsLoading(false);
        }
    };
    
    const restorePromotion = async (id: number) => {
        setIsLoading(true);
        try {
            await adminPromotionService.restore(id);
            return { success: true, message: "Đã khôi phục khuyến mãi thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Khôi phục thất bại."
            };
        } finally {
            setIsLoading(false);
        }
    };

    const togglePromotionActive = async (id: number) => {
        setIsLoading(true);
        try {
            await adminPromotionService.toggleActive(id);
            return { success: true, message: "Cập nhật trạng thái thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Cập nhật trạng thái thất bại."
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        promotions, totalPromotions, isLoading,
        fetchPromotions, createPromotion, updatePromotion, deletePromotion, restorePromotion, togglePromotionActive
    };
};
