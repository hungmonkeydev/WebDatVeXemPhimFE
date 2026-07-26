import { useState, useCallback } from 'react';
import { adminMovieService } from '../services/adminMovieService';

export const useAdminMovies = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalMovies, setTotalMovies] = useState(0);

    const fetchMovies = useCallback(async (page: number, size: number) => {
        setIsLoading(true);
        try {
            const res = await adminMovieService.getAll({ page: page - 1, size });
            if (res && res.data) {
                setMovies(res.data.content || res.data);
                setTotalMovies(res.data.totalElements || res.data.length || 0);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách phim:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createMovie = async (payload: any) => {
        setIsLoading(true);
        try {
            await adminMovieService.create(payload);
            return { success: true, message: "Thêm phim mới thành công!" };
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

    const updateMovie = async (id: number, payload: any) => {
        setIsLoading(true);
        try {
            await adminMovieService.update(id, payload);
            return { success: true, message: "Cập nhật thông tin phim thành công!" };
        } catch (error: any) {
            const responseData = error.response?.data;
            return {
                success: false,
                message: responseData?.message || "Lỗi khi cập nhật phim!",
                fieldErrors: responseData?.data
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMovie = async (id: number) => {
        setIsLoading(true);
        try {
            await adminMovieService.delete(id);
            return { success: true, message: "Đã xóa phim thành công!" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Xóa thất bại! Phim có thể đang có suất chiếu."
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        movies, totalMovies, isLoading,
        fetchMovies, createMovie, updateMovie, deleteMovie
    };
};