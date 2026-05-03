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
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/showtimes`, {
                    params: {
                        movie_id: movieId,
                        date: selectedDate 
                    }
                });

                const rawData = response.data.data;

                const groupedCinemas: any = {};

                rawData.forEach((item: any) => {
                    const cinemaName = item.room?.name || 'VieCinema - Đang cập nhật';
                    const formatType = `${item.format} - ${item.subtitle_type === 'subtitled' ? 'Phụ Đề' : 'Lồng Tiếng'}`;

                    const timeString = item.start_time.substring(11, 16);
                    // Tạo cấu trúc nhóm
                    if (!groupedCinemas[cinemaName]) {
                        groupedCinemas[cinemaName] = { name: cinemaName, formats: {} };
                    }
                    if (!groupedCinemas[cinemaName].formats[formatType]) {
                        groupedCinemas[cinemaName].formats[formatType] = { type: formatType, times: [] };
                    }

                    // Nhét giờ vào mảng, kèm theo id của suất chiếu (cực kỳ quan trọng cho trang đặt vé sau này)
                    groupedCinemas[cinemaName].formats[formatType].times.push({
                        time: timeString,
                        showtimeId: item.id
                    });
                });

                // Chuyển cái Object gom nhóm về lại thành Array để UI dễ lặp .map()
                const finalCinemasArray = Object.values(groupedCinemas).map((c: any) => ({
                    ...c,
                    formats: Object.values(c.formats)
                }));

                setCinemas(finalCinemasArray);

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