import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/UI/Button';

const ERROR_MESSAGES: Record<string, string> = {
    expired: 'Liên kết xác thực đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
    invalid: 'Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại.',
};

export default function VerifyEmailSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const status = searchParams.get('status') || 'success';
    const reason = searchParams.get('reason') || 'invalid';

    const isPositive = status === 'success' || reason === 'already_used';

    let title = 'Xác thực email thành công!';
    let description = 'Tài khoản của bạn đã được kích hoạt. Giờ đây bạn có thể đăng nhập và bắt đầu trải nghiệm VieCinema.';

    if (status === 'error') {
        if (reason === 'already_used') {
            title = 'Email đã được xác thực trước đó';
            description = 'Tài khoản của bạn đã kích hoạt rồi, bạn có thể đăng nhập ngay.';
        } else {
            title = 'Xác thực email thất bại';
            description = ERROR_MESSAGES[reason] || ERROR_MESSAGES.invalid;
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${isPositive ? 'bg-green-50' : 'bg-red-50'
                    }`}>
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
                    onClick={() => navigate('/', { state: { openLogin: true } })}                >
                    {isPositive ? 'Đăng nhập ngay' : 'Về trang chủ'}
                </Button>
            </div>
        </div>
    );
}