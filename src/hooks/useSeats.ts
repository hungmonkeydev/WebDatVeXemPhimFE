import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

export const useSeats = (showtimeId: string | undefined) => {
    const [seatRows, setSeatRows] = useState<any[]>([]);
    const [seatTypes, setSeatTypes] = useState<any[]>([]);
    const [showtimeInfo, setShowtimeInfo] = useState<any>(null);
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [isLoadingSeats, setIsLoadingSeats] = useState(false);

    useEffect(() => {
        if (!showtimeId) return;

        const fetchSeats = async () => {
            try {
                const response = await bookingService.getSeats(showtimeId);
                const data = response.data.data;

                console.log("DỮ LIỆU TỪ API CHUẨN:", data);

                if (data?.seatLayout?.rows) {
                    setSeatRows(data.seatLayout.rows);
                } else {
                    console.warn("API không trả về seatLayout.rows!");
                }

                if (data?.seatTypes) setSeatTypes(data.seatTypes);
                if (data?.showtimeInfo) setShowtimeInfo(data.showtimeInfo);
                if (data?.roomInfo) setRoomInfo(data.roomInfo);
            } catch (error) {
                console.error("Lỗi khi tải sơ đồ ghế:", error);
                setSeatRows([]);
            }
        };
        const initialLoad = async () => {
            setIsLoadingSeats(true);
            await fetchSeats();
            setIsLoadingSeats(false);
        };
        initialLoad();
        const pollingInterval = setInterval(() => {
            fetchSeats();
        }, 3000);
        return () => {
            clearInterval(pollingInterval);
        };
    }, [showtimeId]);

    return { seatRows, seatTypes, showtimeInfo, roomInfo, isLoadingSeats };
};