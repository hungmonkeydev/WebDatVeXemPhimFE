import { useState, useEffect } from 'react'
interface BookingSummaryProps {
    showtimeInfo: any;
    roomInfo: any;
    startTimeDisplay: string;
    dateDisplay: string;
    selectedSeats: any[];
    totalPrice: number;
    combos?: any[];
    comboCart?: Record<number, number>;
    remainingSeconds?: number;
    expireAt?: number;
    onTimeout?: () => void;
    onBack: () => void;
    onNext: () => void;
    nextLabel?: string;
    isNextDisabled?: boolean;
}

export default function BookingSummary({
    showtimeInfo,
    roomInfo,
    startTimeDisplay,
    dateDisplay,
    selectedSeats,
    totalPrice,
    combos = [],
    comboCart = {},
    remainingSeconds = 0,
    expireAt,
    onTimeout,
    onBack,
    onNext,
    nextLabel = "Tiếp tục",
    isNextDisabled = false,
}: BookingSummaryProps) {
    const calculateTimeLeft = () => {
        if (!expireAt) return 0;
        const diff = Math.floor((expireAt - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
    useEffect(() => {
        if (remainingSeconds <= 0 || !expireAt) return;
        if (timeLeft <= 0) {
            if (onTimeout) onTimeout();
            return;
        }

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(prev => {
                if (prev !== newTimeLeft) {
                    if (newTimeLeft <= 0) {
                        clearInterval(timer);
                        if (onTimeout) setTimeout(onTimeout, 0); // Tránh gọi onTimeout trong lúc update state
                    }
                    return newTimeLeft;
                }
                return prev;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [expireAt, remainingSeconds, onTimeout]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return (
        <div className="w-full lg:w-[350px]">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-20">
                {/* HIỂN THỊ ĐỒNG HỒ NGAY TRÊN CÙNG BILL */}
                {remainingSeconds > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 flex justify-between items-center shadow-sm">
                        <span className="font-semibold text-sm">Thời gian giữ ghế</span>
                        <span className="text-xl font-bold font-mono bg-red-100 px-2 py-1 rounded">
                            {timeFormatted}
                        </span>
                    </div>
                )}
                {/* 1. THÔNG TIN PHIM */}
                <div className="flex gap-4 mb-4">
                    <img src={showtimeInfo?.posterUrl || "https://picsum.photos/id/1043/400/600"} alt="Poster" className="w-24 rounded object-cover shadow-sm" />
                    <div>
                        <h3 className="font-bold text-gray-800 text-[15px] mb-1 line-clamp-2">{showtimeInfo?.movieTitle || "Đang tải phim..."}</h3>
                        <p className="text-gray-500 text-[13px] mb-1">
                            <span className="bg-[#f26b38] text-white px-1 py-0.5 rounded text-[10px] font-bold ml-1">
                                {showtimeInfo?.ageRating || "C16"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* 2. THÔNG TIN RẠP & SUẤT CHIẾU */}
                <div className="text-[14px] text-gray-700 font-medium mb-1">
                    <span className="font-bold">{roomInfo?.cinemaName || 'VieCinema'}</span>
                    <br />
                    <span className="font-bold">{roomInfo?.roomName || "Đang tải rạp..."}</span>
                </div>
                <div className="text-[14px] text-gray-700 mb-4">
                    Suất: <span className="font-bold">{startTimeDisplay}</span> - <span className="font-bold">{dateDisplay}</span>
                </div>

                <div className="border-t border-dashed border-gray-300 my-4"></div>

                {/* 3. CHI TIẾT VÉ & BẮP NƯỚC */}
                <div className="text-[14px] text-gray-700 mb-4">
                    {/* Ghế */}
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 shrink-0">{selectedSeats.length}x Ghế:</span>
                        <span className="font-semibold text-gray-800 text-right">
                            {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seatLabel).join(', ') : 'Chưa chọn'}
                        </span>
                    </div>

                    {combos.length > 0 && Object.keys(comboCart).length > 0 && (
                        <div className="mt-3">
                            {combos.map(combo => {
                                const cId = combo.comboId || combo.id;
                                const qty = comboCart[cId];
                                if (!qty) return null;
                                return (
                                    <div key={cId} className="flex justify-between mb-1 text-gray-600">
                                        <span>{qty}x {combo.name}</span>
                                        <span className="font-semibold">{(Number(combo.price) * qty).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-300 my-4"></div>

                {/* 4. TỔNG TIỀN */}
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-800">Tổng cộng</span>
                    <span className="text-2xl font-bold text-[#f26b38]">
                        {totalPrice.toLocaleString('vi-VN')} đ
                    </span>
                </div>

                {/* 5. NÚT ĐIỀU HƯỚNG */}
                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="w-1/3 py-2 text-[#f26b38] font-semibold border border-[#f26b38] rounded hover:bg-[#fff5f2] transition-colors"
                    >
                        Trở lại
                    </button>

                    <button
                        onClick={onNext}
                        disabled={isNextDisabled}
                        className={`w-2/3 py-2 rounded text-white font-semibold transition-colors shadow-sm 
                        ${!isNextDisabled ? 'bg-[#f26b38] hover:bg-[#d95c2b]' : 'bg-gray-300 cursor-not-allowed'}`
                        }
                    >
                        {nextLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}