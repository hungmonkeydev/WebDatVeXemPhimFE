import { useState, useEffect } from 'react';
import { showtimeService } from '../services/showtimeService';

export const useShowtimeDetail = (showtimeId: string | undefined) => {
    const [showtime, setShowtime] = useState<any>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    useEffect(() => {
        if (!showtimeId) return;
        console.log("Fetching showtime detail for", showtime);
        const fetchShowtimeDetail = async () => {
            setIsLoadingDetail(true); 
            try {
                const response = await showtimeService.getShowtimeDetail(showtimeId);
                setShowtime(response.data.data);
                console.log("Showtime detail:", response.data.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin chi tiết suất chiếu:", error);
                setShowtime(null); 
            } finally {
                setIsLoadingDetail(false); 
            }
        };

        fetchShowtimeDetail();
    }, [showtimeId]);

    return { showtime, isLoadingDetail };
};