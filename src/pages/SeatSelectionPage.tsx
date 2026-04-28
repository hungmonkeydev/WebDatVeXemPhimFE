// src/pages/SeatSelection.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeats } from '../hooks/useSeats';
import Spinner from '../components/ui/Spinner';
import { useHoldSeats } from '../hooks/useHoldSeats';
import { useShowtimeDetail } from '../hooks/useShowtimeDetail';

import { useMovieDetail } from '../hooks/useMovieDetail';
export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { seatMatrix, isLoadingSeats } = useSeats(id);

  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const { holdSeats, isHolding } = useHoldSeats();
  const handleNext = async () => {
    const seatIds = selectedSeats.map(seat => seat.id);

    const result = await holdSeats(id, seatIds);

    if (result.success) {
      navigate(`/dat-ve/${id}/thuc-an`, { state: { selectedSeats } });
    } else {
      alert(`❌ Không thể tiếp tục: ${result.message}`);
    }
  };
  // 3. STATE ĐẾM NGƯỢC THỜI GIAN GIỮ GHẾ (5 phút = 300 giây)
  const [timeLeft, setTimeLeft] = useState(300);
  const { showtime } = useShowtimeDetail(id);

  let startTimeDisplay = 'Đang tải...';
  let dateDisplay = 'Đang tải...';
  if (showtime && showtime.start_time) {
    const dateObj = new Date(showtime.start_time);

    // 1. Cắt lấy Giờ:Phút
    startTimeDisplay = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // 2. Lấy Thứ và ghép với Ngày/Tháng/Năm
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = dayNames[dateObj.getDay()]; // Lấy đúng tên thứ
    const dateStr = dateObj.toLocaleDateString('vi-VN'); // Lấy ngày chuẩn 28/04/2026

    // Ghép lại thành: Thứ Hai, 28/04/2026
    dateDisplay = `${dayOfWeek}, ${dateStr}`;
  }
  useEffect(() => {
    if (timeLeft <= 0) {
      alert('Đã hết thời gian giữ ghế! Vui lòng chọn lại từ đầu.');
      navigate(-1); // Trở về trang trước
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 4. HÀM XỬ LÝ KHI CLICK GHẾ
  const toggleSeat = (seat: any) => {
    if (!seat.is_active) return;

    setSelectedSeats((prev) => {
      const isExist = prev.find((s) => s.id === seat.id);
      if (isExist) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  // 5. TÍNH TỔNG TIỀN ĐỘNG
  const totalPrice = selectedSeats.reduce((total, seat) => {
    const basePrice = 75000;
    return total + basePrice * Number(seat.seatType?.price_multiplier || 1);
  }, 0);

  if (isLoadingSeats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">

      {/* THANH THỜI GIAN GIỮ GHẾ CẢNH BÁO */}
      <div className="bg-[#f26b38] text-white text-center py-2 text-[15px] font-medium sticky top-0 z-50 shadow-md">
        Thời gian giữ ghế còn lại: <span className="font-bold text-lg tracking-wider">{formatTime(timeLeft)}</span>
      </div>

      {/* ====== 1. THANH TIẾN ĐỘ (STEPPER) ====== */}
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 py-4 text-sm font-semibold">
          <span className="text-gray-400">Chọn phim / Rạp / Suất</span>
          <span className="text-blue-700 border-b-2 border-blue-700 pb-4 -mb-4">Chọn ghế</span>
          <span className="text-gray-400">Chọn thức ăn</span>
          <span className="text-gray-400">Thanh toán</span>
          <span className="text-gray-400">Xác nhận</span>
        </div>
      </div>

      {/* ====== 2. NỘI DUNG CHÍNH (CHIA 2 CỘT) ====== */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">

        {/* === CỘT TRÁI: SƠ ĐỒ GHẾ THỰC TẾ TỪ API === */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-items-center mb-10">
            <span className="text-gray-600 font-medium">Đổi suất chiếu</span>
            <button className=" ml-auto bg-blue-700 text-white px-6 py-1.5 rounded text-sm font-semibold">{startTimeDisplay}</button>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-max flex flex-col items-center gap-3">

              {/* Vòng lặp vẽ Hàng Ghế */}
              {Object.keys(seatMatrix).map((rowLabel) => (
                <div key={rowLabel} className="flex items-center gap-4">
                  {/* Tên hàng ghế (Trái) */}
                  <span className="font-bold text-gray-500 w-4 text-center">{rowLabel}</span>

                  {/* Vẽ các Ghế trong hàng */}
                  <div className="flex gap-2">
                    {seatMatrix[rowLabel].map((seat: any) => {
                      const isSold = !seat.is_active;
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const seatColor = seat.seatType?.color_code || '#e5e7eb';

                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={isSold}
                          style={{
                            backgroundColor: isSelected ? '#f26b38' : isSold ? '#d1d5db' : seatColor,
                            color: isSelected ? '#fff' : isSold ? '#9ca3af' : '#000',
                            borderColor: isSelected ? '#f26b38' : isSold ? '#d1d5db' : seatColor,
                          }}
                          className={`w-8 h-8 rounded-t-lg rounded-b-sm text-[11px] font-medium border-b-4 flex items-center justify-center transition-all hover:scale-110 
                            ${isSold ? 'cursor-not-allowed opacity-50' : 'cursor-pointer shadow-sm'}
                          `}
                        >
                          {seat.seat_name.replace(rowLabel, '')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tên hàng ghế (Phải) */}
                  <span className="font-bold text-gray-500 w-4 text-center">{rowLabel}</span>
                </div>
              ))}

              {/* Màn hình (Screen) */}
              <div className="w-[80%] h-1 bg-orange-400 mt-10 mb-2 shadow-[0_10px_20px_rgba(242,107,56,0.3)]"></div>
              <span className="text-gray-400 text-sm mb-8 tracking-[0.2em]">MÀN HÌNH</span>

              {/* Chú thích màu ghế */}
              <div className="flex flex-wrap gap-6 text-xs text-gray-600 justify-center mt-4">
                {/* Ghế đã bán */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded border-b-2 border-gray-400 text-gray-500 flex items-center justify-center font-bold">X</div>
                  Đã bán
                </div>

                {/* Ghế đang chọn */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#f26b38] rounded border-b-2 border-[#d95a2b]"></div>
                  Đang chọn
                </div>

                {/* Ghế Thường */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#4CAF50] rounded border-b-2 border-[#388E3C]"></div>
                  Thường
                </div>

                {/* Ghế VIP (Vàng) */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFD700] rounded border-b-2 border-[#FFA000]"></div>
                  VIP
                </div>

                {/* Ghế Couple (Hồng) */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#E91E63] rounded border-b-2 border-[#C2185B]"></div>
                  Couple
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: BILL THANH TOÁN (STICKY) === */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-20">

            <div className="flex gap-4 mb-4">
              {/* Tạm thời Hardcode ảnh và thông tin phim, sau này móc API showtime vào thay thế */}
              <img src={showtime?.movie?.poster_url || "https://picsum.photos/id/1043/400/600"} alt="Poster" className="w-24 rounded object-cover shadow-sm" />
              <div>
                <h3 className="font-bold text-gray-800 text-[15px] mb-1 line-clamp-2">{showtime?.movie?.title || "Đang tải phim..."}</h3>
                <p className="text-gray-500 text-[13px] mb-1">
                  {showtime?.format} {showtime?.subtitle_type === 'subtitled' ? 'Phụ Đề' : 'Lồng Tiếng'}
                  <span className="bg-[#f26b38] text-white px-1 py-0.5 rounded text-[10px] font-bold ml-2">
                    {showtime?.movie?.age_rating || "C16"}
                  </span>
                </p>              </div>
            </div>

            <div className="text-[14px] text-gray-700 font-medium mb-1">
              <span className="font-bold">VIECINEMA GALAXY</span>
              <br />
              <span className="font-bold">{showtime?.room?.name || "Đang tải rạp..."}</span>
            </div>
            <div className="text-[14px] text-gray-700 mb-4">
              Suất: <span className="font-bold">{startTimeDisplay}</span> - <span className="font-bold">
                {dateDisplay}</span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4"></div>

            {/* Hiển thị danh sách ghế đang chọn */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 shrink-0">Ghế chọn:</span>
              <span className="font-semibold text-gray-800 text-right">
                {selectedSeats.length > 0 ? selectedSeats.map((s) => s.seat_name).join(', ') : 'Chưa chọn ghế'}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4"></div>

            {/* Tổng tiền */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-[#f26b38]">
                {totalPrice.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-1/3 py-2 text-[#f26b38] font-semibold border border-[#f26b38] rounded hover:bg-[#fff5f2] transition-colors"
              >
                Trở lại
              </button>

              <button
                // Truyền selectedSeats sang trang Thức Ăn để tính tiếp tiền
                onClick={handleNext}
                disabled={selectedSeats.length === 0 || isHolding}
                className={`w-2/3 py-2 rounded text-white font-semibold transition-colors shadow-sm ${selectedSeats.length > 0 ? 'bg-[#f26b38] hover:bg-[#d95c2b]' : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                {isHolding ? 'Đang giữ ghế...' : 'Tiếp tục'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}