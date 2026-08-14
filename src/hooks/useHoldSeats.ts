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
            let errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi giữ ghế!';
            
            // Lấy chi tiết lỗi validation từ trường data (Map<String, String>)
            const responseData = error.response?.data;
            if (responseData?.data && typeof responseData.data === 'object') {
                const errorDetails = Object.values(responseData.data);
                if (errorDetails.length > 0) {
                    errorMsg = errorDetails[0] as string;
                }
            }
            
            return { success: false, message: errorMsg };
        } finally {
            setIsHolding(false);
        }
    };

    return { holdSeats, isHolding };
};