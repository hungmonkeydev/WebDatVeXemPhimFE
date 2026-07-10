import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { message } from 'antd';

export const useLoyaltyProgress = () => {
    const [progressData, setProgressData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setIsLoading(true);
                const response = await userService.getMyPointsProgress();
                console.log("Cục JSON BE trả về nè:", response.data); 
                setProgressData(response.data);
            } catch (err: any) {
                console.error("Lỗi lấy thông tin điểm:", err);
                message.error('Không thể tải thông tin hạng thành viên!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, []);

    return { progressData, isLoading };
};