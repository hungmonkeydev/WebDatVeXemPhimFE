import { useState } from 'react';
import { reviewService } from '../services/reviewService';
import { message } from 'antd';

export const useSubmitReview = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const submitReview = async (movieId: number, rating: number, comment: string) => {
        try {
            setIsSubmitting(true);
            const response = await reviewService.submitReview({ movieId, rating, comment });
            console.log("Cục JSON BE trả về nè:", response);
            message.success(response.message || 'Đánh giá thành công! Bạn được cộng 20 Stars.');
            return { success: true };
        } catch (err: any) {
            console.error("Lỗi gửi review phim:", err.response?.data);
            message.error(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại!');
            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitReview, isSubmitting };
};