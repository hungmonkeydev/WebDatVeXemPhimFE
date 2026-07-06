import { useState } from 'react';
import { bookingService } from '../services/bookingService';

export const useHoldSeats = () => {
    const [isHolding, setIsHolding] = useState(false);

    const holdSeats = async (showtimeId: string | undefined, seatIds: number[]) => {
        setIsHolding(true);
        try {
            const response = await bookingService.holdSeats(showtimeId || '', seatIds);
            const remainingSeconds = response.data?.data?.remainingSeconds || 600;
            return { success: true, remainingSeconds };
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi giữ ghế!';
            return { success: false, message: errorMsg };
        } finally {
            setIsHolding(false);
        }
    };

    return { holdSeats, isHolding };
};