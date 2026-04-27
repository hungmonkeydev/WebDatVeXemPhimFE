import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMovies = () => {
    const [moviesList, setMoviesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://webxemphim-sbim.onrender.com/api/v1/movies'); 
            if (response.data && response.data.data) {
                setMoviesList(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách phim:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchMovies();
    }, []);

    return { moviesList, isLoading };
};