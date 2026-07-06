import { useState, useEffect } from 'react';
import { showtimeService } from '../services/showtimeService';

export const useShowtimes = (movieId: string | undefined, selectedDate: string) => {
    const [cinemas, setCinemas] = useState<any[]>([]);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
    console.log("cinema" + cinemas);
    useEffect(() => {
        if (!movieId || !selectedDate) return;

        const fetchShowtimes = async () => {
            setIsLoadingShowtimes(true);
            try {
                const response = await showtimeService.getShowtimes({
                    movieId:movieId, 
                    date: selectedDate
                });

                const rawData = response.data.data;
                const formattedCinemas = rawData.map((cinema: any) => {
                    const formatType = '2D - Phụ Đề';
                    return {
                        name: cinema.cinemaName,
                        address: cinema.address,
                        city: cinema.city,
                        formats: [
                            {
                                type: formatType,
                                times: cinema.showtimes.map((st: any) => ({
                                    time: st.startTime.substring(11, 16), 
                                    showtimeId: st.showtimeId,
                                    price: st.basePrice
                                }))
                            }
                        ]
                    };
                });

                setCinemas(formattedCinemas);

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