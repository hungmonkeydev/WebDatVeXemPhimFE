import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export const useMovieDetail = (id: string | undefined) => {
    const [movie, setMovie] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await movieService.getMovieDetail(id);
                const movieData = response?.data?.data || response?.data || response;
                setMovie(movieData);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết phim:", error);
                setError("Lỗi khi tải chi tiết phim hoặc phim không tồn tại");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);
    return { movie, isLoading,error };
};