import React, { useState } from 'react';
import { Modal, Rate, Input, Button } from 'antd';
import { useSubmitReview } from '../../Hooks/useSubmitReview';
import { useAuth } from '../../Hooks/useAuth';
import { GoogleGenerativeAI } from "@google/generative-ai";
const { TextArea } = Input;
// Hàm kiểm tra danh sách các model AI khả dụng
const checkAvailableModels = () => fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${(import.meta.env.VITE_GEMINI_API_KEY || "").trim()}`).then(r => r.json()).then(d => console.log("🔥 MODELS:", d)).catch(console.error);
const checkCommentWithAI = async (text: string) => {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) {
        console.error("Thiếu API Key!");
        return "LỖI";
    }

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!res.ok) {
            console.error("Lỗi lấy danh sách model:", await res.text());
            return "LỖI";
        }

        const data = await res.json();

        const availableModels = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent") && m.name.includes("gemini"))
            .map((m: any) => m.name.replace('models/', ''))
            .reverse();

        console.log("DANH SÁCH MODEL SẼ THỬ:", availableModels);

        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const prompt = `Bạn là hệ thống kiểm duyệt nội dung gắt gao. Phân tích bình luận sau. Nếu chứa từ ngữ chửi thề, tục tĩu, xúc phạm, hoặc teencode mang ý nghĩa xấu, trả về ĐÚNG 1 TỪ "TIÊU_CỰC". Nếu an toàn, trả về "TÍCH_CỰC". Không giải thích. Bình luận: "${text}"`;

        for (const modelName of availableModels) {
            try {
                console.log(`Đang thử nghiệm con AI: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent(prompt);
                const textResponse = result.response.text();

                if (!textResponse) {
                    return "TIÊU_CỰC";
                }

                // console.log(` CHỐT ĐƠN! Model ${modelName} hoạt động thành công!`);
                return textResponse.trim().toUpperCase();

            } catch (e: any) {
                console.warn(`Model ${modelName} bị Google cấm hoặc lỗi. Chuyển sang con tiếp theo...`);
            }
        }

        console.error("Đã thử sạch danh sách nhưng Google khóa hết toàn bộ!");
        return "LỖI";
    } catch (error) {
        console.error("Lỗi sập luồng AI:", error);
        return "LỖI";
    }
};
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    movieId: number;
    movieTitle: string;
    onSuccess?: () => void;
};

export default function ReviewModal({ isOpen, onClose, movieId, movieTitle, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const { submitReview, isSubmitting } = useSubmitReview();
    // Trạng thái chờ khi AI đang kiểm duyệt nội dung bình luận
    const [isCheckingAI, setIsCheckingAI] = useState<boolean>(false);
    const handleSubmit = async () => {
        if (!rating) {
            return Modal.error({ title: 'Lỗi', content: 'Vui lòng chọn số sao để đánh giá phim!' });
        }
        const isGuest = !localStorage.getItem('access_token');
        if (isGuest) {
            return Modal.warning({
                title: 'Yêu cầu đăng nhập',
                content: 'Bạn cần đăng nhập tài khoản để có thể đánh giá phim và nhận điểm thưởng!',
                onOk: () => {
                    onClose();
                }
            });
        }

        // Kiểm duyệt nội dung bình luận bằng AI trước khi gửi
        if (comment.trim()) {
            setIsCheckingAI(true);
            const danhGiaAI = await checkCommentWithAI(comment);
            setIsCheckingAI(false);

            // Xử lý khi hệ thống kiểm duyệt AI gặp sự cố
            if (danhGiaAI === "LỖI") {
                return Modal.error({
                    title: 'Lỗi hệ thống',
                    content: 'Hệ thống kiểm duyệt đang bảo trì hoặc lỗi API Key. Vui lòng thử lại sau!'
                });
            }

            if (danhGiaAI.includes("TIÊU_CỰC")) {
                return Modal.error({
                    title: 'Cảnh báo nội dung',
                    content: 'Bình luận của bạn chứa từ ngữ không phù hợp. Vui lòng sửa lại!'
                });
            }
        }

        // Gọi API lưu đánh giá sau khi đã vượt qua vòng kiểm duyệt
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
                <Button key="back" onClick={onClose} disabled={isSubmitting || isCheckingAI} onClickCapture={() => checkAvailableModels()}>
                    Hủy bỏ
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    className="bg-[#f26b38] hover:bg-[#d95c2b] border-none font-medium"
                    loading={isSubmitting || isCheckingAI}
                    onClick={handleSubmit}
                >
                    {isCheckingAI ? 'Đang kiểm tra ...' : 'Gửi đánh giá'}
                </Button>,
            ]}
        >
            <div className="flex flex-col items-center py-4 gap-4">
                <p className="text-gray-500 text-sm text-center px-4">
                    Chia sẻ cảm nghĩ của bạn về bộ phim để nhận ngay <span className="font-bold text-orange-500">5 Stars</span> điểm thưởng vào tài khoản nhé!
                </p>

                {/* Thành phần đánh giá bằng sao */}
                <div className="flex flex-col items-center gap-1 bg-orange-50/50 w-full py-3 rounded-lg border border-orange-100/50">
                    <span className="text-[13px] font-semibold text-gray-600">Bạn thấy phim này thế nào?</span>
                    <Rate
                        allowClear={false}
                        value={rating}
                        onChange={setRating}
                        disabled={isCheckingAI || isSubmitting}
                        className="text-3xl text-yellow-400"
                    />
                </div>

                {/* Thành phần nhập nội dung bình luận */}
                <div className="w-full flex flex-col gap-1.5 mt-2">
                    <span className="text-sm font-medium text-gray-600">Nội dung bình luận</span>
                    <TextArea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Phim có hay không pro? Diễn viên diễn tốt không? Chia sẻ cho mọi người cùng biết với nhé..."
                        maxLength={500}
                        showCount
                        disabled={isCheckingAI || isSubmitting}
                        className="rounded hover:border-[#f26b38] focus:border-[#f26b38]"
                    />
                </div>
            </div>
        </Modal>
    );
}