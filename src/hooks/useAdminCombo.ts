import { useState, useCallback } from 'react';
import { adminComboService } from '../services/adminComboService'; 

export const useAdminCombos = () => {
    const [combos, setCombos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCombos, setTotalCombos] = useState(0);

    const fetchCombos = useCallback(async (page: number, size: number, keyword?: string) => {
        setIsLoading(true);
        try {
            const params: any = { page: page - 1, size };
            if (keyword) params.keyword = keyword;

            const res = await adminComboService.getAll(params);
            if (res && res.data) {
                setCombos(res.data.content || res.data);
                setTotalCombos(res.data.totalElements || res.data.length || 0);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách combo:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createCombo = async (payload: any) => {
        setIsLoading(true);
        try {
            await adminComboService.create(payload);
            return { success: true, message: "Thêm combo mới thành công!" };
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

    const updateCombo = async (id: number, payload: any) => {
        setIsLoading(true);
        try {
            await adminComboService.update(id, payload);
            return { success: true, message: "Cập nhật thông tin combo thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật combo!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCombo = async (id: number) => {
        setIsLoading(true);
        try {
            await adminComboService.delete(id);
            return { success: true, message: "Đã xóa combo thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Xóa thất bại! Combo có thể đang được sử dụng."
            };
        } finally {
            setIsLoading(false);
        }
    };

    const toggleComboActive = async (id: number) => {
        setIsLoading(true);
        try {
            await adminComboService.toggleActive(id);
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
        combos, totalCombos, isLoading,
        fetchCombos, createCombo, updateCombo, deleteCombo, toggleComboActive
    };
};