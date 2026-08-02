import { useState } from 'react';
import { bookingService } from '../services/bookingService';

export const useBooking = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [booking, setBooking] = useState<any>(null);

    const fetchBookingDetail = async (bookingCode: string) => {
        setIsLoading(true);
        try {
            const response = await bookingService.getMyBookings();
            const allMyTickets = response.data?.data || response.data || [];
            const currentTicket = allMyTickets.find((ticket: any) =>
                ticket.bookingCode == bookingCode || ticket.booking_code == bookingCode || ticket.id == bookingCode
            );

            if (currentTicket) {
                setBooking(currentTicket); // Lưu vào state để hiển thị
                return { success: true, data: currentTicket };
            }
            return { success: false };
        } catch (error) {
            console.error("Lỗi lấy thông tin vé:", error);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, booking, fetchBookingDetail, setBooking };
};