import { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Trỏ đường dẫn cho đúng nha

export const useMovieReviews = (movieId: number) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        if (!movieId) return;

        try {
            setIsLoading(true);
            const response = await api.get(`/reviews/${movieId}`);
            console.log("Đánh giá phim:", response.data);
            const data = response.data?.data?.content || response.data?.data || [];
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải đánh giá:", error);
        } finally {
            setIsLoading(false);
        }
    }, [movieId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return { reviews, isLoading, fetchReviews };
};