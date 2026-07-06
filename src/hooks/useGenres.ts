import { useState, useEffect } from 'react';
import { genreService } from '../services/genreService';

export function useGenres() {
    const [genres, setGenres] = useState<any[]>([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoadingGenres(true);
            try {
                const result = await genreService.getAllGenres();

                const dataList = result?.data || result || [];
                setGenres(dataList);
            } catch (error) {
                console.error("Lỗi khi tải danh sách thể loại:", error);
            } finally {
                setIsLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    return { genres, isLoadingGenres };
}