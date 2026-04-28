import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCombos = () => {
    const [combos, setCombos] = useState<any[]>([]);
    const [isLoadingCombos, setIsLoadingCombos] = useState(false);

    useEffect(() => {
        const fetchCombos = async () => {
            setIsLoadingCombos(true);
            try {
                const response = await axios.get(`https://webxemphim-sbim.onrender.com/api/v1/combos`);
                
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