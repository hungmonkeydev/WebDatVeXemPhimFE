import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';

export default function VNPayReturnPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;

        const verifyPayment = async () => {
            try {
                const searchParams = location.search;
                if (searchParams.includes('vnp_ResponseCode=24')) {
                    alert('Bạn đã hủy thanh toán!');
                    navigate('/');
                    return;
                }

                const res = await bookingService.verifyVNPayCallback(searchParams);
                if (res.data?.code === '00' || res.data?.status === 'success' || res.status === 200) {
                    const urlParams = new URLSearchParams(searchParams);
                    const vnpTxnRef = urlParams.get('vnp_TxnRef'); 
                    const finalBookingId = res.data?.data?.bookingId || res.data?.bookingId || vnpTxnRef;
                    navigate(`/dat-ve/${finalBookingId}/thanh-cong`, { 
                        state: { 
                            paymentStatus: 'SUCCESS',
                            vnpayData: res.data 
                        },
                        replace: true 
                    });
                    
                } else {
                    alert('Thanh toán thất bại hoặc có dấu hiệu gian lận!');
                    navigate('/');
                }

            } catch (error) {
                console.error("Lỗi khi xác thực kết quả VNPAY:", error);
                alert('Hệ thống bận, không thể xác minh thanh toán ngay lúc này!');
                navigate('/');
            }
        };

        setTimeout(verifyPayment, 1000); 
        
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f26b38] rounded-full animate-spin"></div>
            <h2 className="mt-8 text-xl font-bold text-[#f26b38] animate-pulse">Đang xử lý kết quả thanh toán...</h2>
            <p className="text-gray-500 mt-2 font-medium">Vui lòng không đóng trình duyệt lúc này!</p>
        </div>
    );
}