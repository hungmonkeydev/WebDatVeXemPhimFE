import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSeats = (showtimeId: string | undefined) => {
    const [seatMatrix, setSeatMatrix] = useState<any>({});
    const [isLoadingSeats, setIsLoadingSeats] = useState(false);

    useEffect(() => {
        if (!showtimeId) return;

        const fetchSeats = async () => {
            setIsLoadingSeats(true);
            try {
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/showtimes/${showtimeId}/seats`);
                console.log("DỮ LIỆU GHẾ TỪ API:", response.data);
                const rawSeats = response.data.data?.seats || response.data.seats || []; 
                if (rawSeats.length === 0) {
                    console.warn("API có gọi được nhưng mảng ghế vẫn rỗng!");
                }
                const grouped: any = {};
                rawSeats.forEach((seat: any) => {
                    const row = seat.row_label;
                    if (!grouped[row]) {
                        grouped[row] = [];
                    }
                    grouped[row].push(seat);
                });

                // Sắp xếp lại các ghế trong 1 hàng theo thứ tự cột (1, 2, 3...) cho chắc ăn
                Object.keys(grouped).forEach(row => {
                    grouped[row].sort((a: any, b: any) => a.col_number - b.col_number);
                });

                setSeatMatrix(grouped);

            } catch (error) {
                console.error("Lỗi khi tải sơ đồ ghế:", error);
            } finally {
                setIsLoadingSeats(false);
            }
        };

        fetchSeats();
    }, [showtimeId]);

    return { seatMatrix, isLoadingSeats };
};