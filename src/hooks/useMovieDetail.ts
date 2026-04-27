import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMovieDetail = (id: string | undefined) => {
    const [movie, setMovie] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/movies/${id}`);
                setMovie(response.data.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết phim:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);
    return { movie, isLoading };
};