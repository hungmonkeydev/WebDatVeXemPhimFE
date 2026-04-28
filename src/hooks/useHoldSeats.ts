import { useState } from 'react';
import axios from 'axios';

export const useHoldSeats = () => {
    const [isHolding, setIsHolding] = useState(false);

    const holdSeats = async (showtimeId: string | undefined, seatIds: number[]) => {
        setIsHolding(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'https://webxemphim-sbim.onrender.com/api/v1/bookings/hold',
                { showtime_id: showtimeId, seat_ids: seatIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { success: true };
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi giữ ghế!';
            return { success: false, message: errorMsg };
        } finally {
            setIsHolding(false);
        }
    };

    return { holdSeats, isHolding };
};