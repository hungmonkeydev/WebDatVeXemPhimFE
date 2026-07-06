import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

export const useCombos = () => {
    const [combos, setCombos] = useState<any[]>([]);
    const [isLoadingCombos, setIsLoadingCombos] = useState(false);

    useEffect(() => {
        const fetchCombos = async () => {
            setIsLoadingCombos(true);
            try {
                const response = await bookingService.getCombos();
                
                const rawData = response.data.data || response.data || [];
                setCombos(rawData);
                console.log('Data loaded:', rawData);
            } catch (error) {
                console.error("Lỗi khi tải danh sách Combo:", error);
            } finally {
                setIsLoadingCombos(false);
            }
        };

        fetchCombos();
    }, []);

    return { combos, isLoadingCombos };
};