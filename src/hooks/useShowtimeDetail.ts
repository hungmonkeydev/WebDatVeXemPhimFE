import { useState, useEffect } from 'react';
import axios from 'axios';

export const useShowtimeDetail = (showtimeId: string | undefined) => {
    const [showtime, setShowtime] = useState<any>(null);

    useEffect(() => {
        if (!showtimeId) return;

        const fetchShowtimeDetail = async () => {
            try {
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/showtimes/${showtimeId}`);
                setShowtime(response.data.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin suất chiếu:", error);
            }
        };

        fetchShowtimeDetail();
    }, [showtimeId]);

    return { showtime };
};