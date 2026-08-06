import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/UI/Button';
import { authService } from '../services/authService';

const ERROR_MESSAGES: Record<string, string> = {
    expired: 'Liên kết xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
    invalid: 'Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại.',
    already_used: 'Tài khoản của bạn đã kích hoạt rồi, bạn có thể đăng nhập ngay.'
};

export default function VerifyEmailSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Thay vì lấy status từ URL, mình dùng state để tự quản lý sau khi gọi API
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [reason, setReason] = useState<string>('');

    const hasCalledAPI = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setReason('invalid');
            return;
        }

        if (hasCalledAPI.current) return;
        hasCalledAPI.current = true;

        const verifyToken = async () => {
            try {
                await authService.verifyEmail(token);
                setStatus('success');
            } catch (error: any) {
                console.error("Lỗi xác thực email:", error);
                setStatus('error');
                const errorCode = error.response?.data?.reason || 'invalid';
                setReason(errorCode);
            }
        };

        verifyToken();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Đang xác thực email của bạn...</p>
            </div>
        );
    }

    const isPositive = status === 'success' || reason === 'already_used';

    let title = 'Xác thực email thành công!';
    let description = 'Tài khoản của bạn đã được kích hoạt. Giờ đây bạn có thể đăng nhập và bắt đầu trải nghiệm VieCinema.';

    if (status === 'error') {
        if (reason === 'already_used') {
            title = 'Email đã được xác thực trước đó';
            description = ERROR_MESSAGES.already_used;
        } else {
            title = 'Xác thực email thất bại';
            description = ERROR_MESSAGES[reason] || ERROR_MESSAGES.invalid;
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
                    {isPositive ? (
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                <h1 className="text-xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-[14px] text-gray-500 mb-8">{description}</p>

                <Button
                    fullWidth
                    size="lg"
                    type="button"
                    onClick={() => navigate('/', { state: { openLogin: true } })}
                >
                    {isPositive ? 'Đăng nhập ngay' : 'Về trang chủ'}
                </Button>
            </div>
        </div>
    );
}
