import React, { useState } from 'react';
import { Spin, Rate, Button } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import ReviewModal from './ReviewModal';
import { useMovieReviews } from '../../Hooks/useMovieReviews';

interface MovieReviewsProps {
    movieId: number;
    movieTitle: string;
}

export default function MovieReviews({ movieId, movieTitle }: MovieReviewsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { reviews, isLoading, fetchReviews } = useMovieReviews(movieId);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 border-l-4 border-[#f26b38] pl-2 md:pl-3">
                    Bình Luận Phim
                </h2>

                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f26b38] hover:bg-[#d95c2b] border-none shadow-sm px-3 md:px-4 text-sm md:text-base"
                >
                    <span className="hidden sm:inline">Viết Đánh Giá</span>
                    <span className="inline sm:hidden">Bình Luận</span>
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 min-h-[150px] md:min-h-[200px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32 md:h-40">
                        <Spin tip="Đang tải bình luận..." />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-4 md:space-y-6">
                        {reviews.map((review: any, idx: number) => (
                            <div key={idx} className="flex gap-3 md:gap-4 border-b border-gray-50 pb-4 md:pb-6 last:border-0 last:pb-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                    <UserOutlined className="text-gray-500 text-base md:text-lg" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[120px] sm:max-w-none">
                                            {review.userFullName || 'Khách hàng'}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-400 shrink-0">
                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                    </div>

                                    <Rate disabled defaultValue={review.rating} className="text-xs md:text-sm text-yellow-400 mb-1 md:mb-2" />
                                    <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed break-words">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-sm md:text-base text-gray-400 py-8 md:py-10">
                        Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên giật tem nhé!
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movieId={movieId}
                movieTitle={movieTitle}
                onSuccess={fetchReviews}
            />
        </div>
    );
}