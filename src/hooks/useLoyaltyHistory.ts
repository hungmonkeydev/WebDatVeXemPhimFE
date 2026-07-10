import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { message } from 'antd';

export const useLoyaltyHistory = () => {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await userService.getLoyaltyHistory();
                console.log("useLoyaltyHistory", response.data);
                let rawData = response.data?.data || response.data;

                // Bóc mảng ra nếu Backend bọc trong biến 'content' (Phân trang của Spring)
                if (rawData && rawData.content) {
                    rawData = rawData.content;
                } setHistoryData(Array.isArray(rawData) ? rawData : []);
            } catch (err: any) {
                console.error("Lỗi lấy lịch sử điểm:", err);
                message.error('Không thể tải lịch sử tích điểm!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return { historyData, isLoading };
};