import React, { useState } from 'react';
import { Modal, Rate, Input, Button } from 'antd';
import { useSubmitReview } from '../../Hooks/useSubmitReview';

const { TextArea } = Input;

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    movieId: number;
    movieTitle: string;
    onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, movieId, movieTitle, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const { submitReview, isSubmitting } = useSubmitReview();

    const handleSubmit = async () => {
        if (!rating) {
            return Modal.error({ title: 'Lỗi', content: 'Vui lòng chọn số sao để đánh giá phim!' });
        }

        const result = await submitReview(movieId, rating, comment);
        if (result.success) {
            setComment('');
            setRating(5);
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <Modal
            title={<span className="text-lg font-bold text-gray-800">Đánh giá phim: {movieTitle}</span>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} disabled={isSubmitting}>
                    Hủy bỏ
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    className="bg-[#f26b38] hover:bg-[#d95c2b] border-none font-medium"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                >
                    Gửi đánh giá
                </Button>,
            ]}
        >
            <div className="flex flex-col items-center py-4 gap-4">
                <p className="text-gray-500 text-sm text-center px-4">
                    Chia sẻ cảm nghĩ của bạn về bộ phim để nhận ngay <span className="font-bold text-orange-500">20 Stars</span> điểm thưởng vào tài khoản nhé!
                </p>

                {/* Khu vực chọn Sao */}
                <div className="flex flex-col items-center gap-1 bg-orange-50/50 w-full py-3 rounded-lg border border-orange-100/50">
                    <span className="text-[13px] font-semibold text-gray-600">Bạn thấy phim này thế nào?</span>
                    <Rate
                        allowClear={false}
                        value={rating}
                        onChange={setRating}
                        className="text-3xl text-yellow-400"
                    />
                </div>

                {/* Khu vực nhập nội dung */}
                <div className="w-full flex flex-col gap-1.5 mt-2">
                    <span className="text-sm font-medium text-gray-600">Nội dung bình luận</span>
                    <TextArea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Phim có hay không pro? Diễn viên diễn tốt không? Chia sẻ cho mọi người cùng biết với nhé..."
                        maxLength={500}
                        showCount
                        className="rounded hover:border-[#f26b38] focus:border-[#f26b38]"
                    />
                </div>
            </div>
        </Modal>
    );
}