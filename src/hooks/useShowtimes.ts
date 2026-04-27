import { useState, useEffect } from 'react';
import axios from 'axios';

export const useShowtimes = (movieId: string | undefined, selectedDate: string) => {
    const [cinemas, setCinemas] = useState<any[]>([]);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

    useEffect(() => {
        if (!movieId || !selectedDate) return;

        const fetchShowtimes = async () => {
            setIsLoadingShowtimes(true);
            try {
             
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/movies/${movieId}/showtimes`, {
                    params: { date: selectedDate } 
                });
                
                setCinemas(response.data.data);
            } catch (error) {
                console.error("Lỗi khi tải lịch chiếu:", error);
                setCinemas([]);
            } finally {
                setIsLoadingShowtimes(false);
            }
        };

        fetchShowtimes();
    }, [movieId, selectedDate]);

    return { cinemas, isLoadingShowtimes };
};