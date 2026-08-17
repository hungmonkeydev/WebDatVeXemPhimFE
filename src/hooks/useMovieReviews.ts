import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/reviewService';

export const useMovieReviews = (movieId: number) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        if (!movieId) return;

        try {
            setIsLoading(true);
            const response = await reviewService.getReviewsByMovieId(movieId);
            console.log("Đánh giá phim:", response);
            const data = response?.data?.content || response?.data || [];
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