import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailedPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookingCode = searchParams.get('bookingCode');
    const message = searchParams.get('message') || 'Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.';

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 mb-4 flex justify-center">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại!</h2>
                <p className="text-gray-600 mb-2">
                    {decodeURIComponent(message)}
                </p>
                {bookingCode && (
                    <p className="text-sm text-gray-500 mb-6 border-t mt-4 pt-4">
                        Mã đơn hàng: <span className="font-bold text-gray-700">{bookingCode}</span>
                    </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#f26b38] text-white px-6 py-2.5 rounded font-semibold hover:bg-[#d95c2b] w-full transition-colors"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}
