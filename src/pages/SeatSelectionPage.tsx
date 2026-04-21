// src/pages/SeatSelection.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SeatSelection() {
  const navigate = useNavigate();

  // 1. STATE QUẢN LÝ GHẾ ĐANG CHỌN
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const TICKET_PRICE = 85000; // Cố định giá 85k/vé cho dễ tính

  // Sơ đồ ghế giả lập (Giống trong hình của bạn)
  // Các số 0 là khoảng trống (lối đi)
  const seatLayout = [
    { row: 'E', seats: [10, 9, 0, 8, 7, 0, 6, 5, 0, 4, 3, 0, 2, 1] },
    { row: 'D', seats: [ 0, 0, 0, 6, 5, 0, 4, 3, 0, 0, 0, 0, 2, 1] },
    { row: 'C', seats: [ 0, 0, 0, 6, 5, 0, 0, 0, 0, 0, 0, 0, 2, 1] },
    { row: 'B', seats: [ 0, 0, 0, 6, 5, 0, 4, 3, 0, 0, 0, 0, 2, 1] },
    { row: 'A', seats: [ 8, 7, 0, 6, 5, 0, 4, 3, 0, 2, 1, 0, 0, 0] },
  ];

  const soldSeats = ['E5', 'E6', 'D4']; // Giả lập vài ghế đã có người mua

  // Hàm xử lý khi bấm vào 1 ghế
  const toggleSeat = (seatId: string) => {
    if (soldSeats.includes(seatId)) return; // Ghế đã bán thì không cho bấm

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId); // Bỏ chọn
      } else {
        return [...prev, seatId]; // Chọn thêm
      }
    });
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
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
        
        {/* === CỘT TRÁI: SƠ ĐỒ GHẾ === */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <span className="text-gray-600 font-medium">Đổi suất chiếu</span>
            <button className="bg-blue-700 text-white px-6 py-1.5 rounded text-sm font-semibold">22:20</button>
          </div>

          {/* Sơ đồ Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] flex flex-col items-center gap-2">
              
              {seatLayout.map((row) => (
                <div key={row.row} className="flex items-center gap-4">
                  {/* Tên hàng ghế (Trái) */}
                  <span className="font-bold text-gray-500 w-4">{row.row}</span>
                  
                  {/* Các ghế */}
                  <div className="flex gap-1.5">
                    {row.seats.map((seatNum, idx) => {
                      if (seatNum === 0) return <div key={idx} className="w-7 h-7"></div>; // Lối đi
                      
                      const seatId = `${row.row}${seatNum}`;
                      const isSold = soldSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={idx}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isSold}
                          className={`w-7 h-7 rounded text-[11px] font-medium border flex items-center justify-center transition-colors
                            ${isSold ? 'bg-gray-300 border-gray-300 text-gray-100 cursor-not-allowed' : 
                              isSelected ? 'bg-[#f26b38] border-[#f26b38] text-white' : 
                              'bg-white border-blue-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'}
                          `}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tên hàng ghế (Phải) */}
                  <span className="font-bold text-gray-500 w-4">{row.row}</span>
                </div>
              ))}

              {/* Màn hình (Screen) */}
              <div className="w-[80%] h-1 bg-orange-400 mt-10 mb-2"></div>
              <span className="text-gray-400 text-sm mb-8">Màn hình</span>

              {/* Chú thích */}
              <div className="flex flex-wrap gap-6 text-xs text-gray-600 justify-center">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Ghế đã bán</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f26b38] rounded"></div> Ghế đang chọn</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 border border-blue-300 rounded"></div> Ghế thường</div>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: BILL THANH TOÁN (STICKY) === */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            
            <div className="flex gap-4 mb-4">
              <img src="https://picsum.photos/id/1043/400/600" alt="Poster" className="w-24 rounded object-cover" />
              <div>
                <h3 className="font-bold text-gray-800 text-[15px] mb-1">Quỷ Dữ Từ Luyện Ngục</h3>
                <p className="text-gray-500 text-[13px] mb-1">VIP - AQUALIS 2D Phụ Đề <span className="bg-[#f26b38] text-white px-1 py-0.5 rounded text-[10px] font-bold">T18</span></p>
              </div>
            </div>

            <div className="text-[14px] text-gray-700 font-medium mb-1">
              <span className="font-bold">VieCinema CineX - Hanoi Centre</span> - VIP - AQUALIS
            </div>
            <div className="text-[14px] text-gray-700 mb-4">
              Suất: <span className="font-bold">22:20</span> - Hôm nay, <span className="font-bold">13/04/2026</span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4"></div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-[#f26b38]">
                {(selectedSeats.length * TICKET_PRICE).toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="w-1/2 py-2 text-[#f26b38] font-semibold hover:underline"
              >
                Quay lại
              </button>
              <button 
                onClick={() => navigate(`/dat-ve/1/thuc-an`, { state: { selectedSeats: selectedSeats } })}
                disabled={selectedSeats.length === 0}
                className={`w-1/2 py-2 rounded text-white font-semibold transition-colors ${
                  selectedSeats.length > 0 ? 'bg-[#f26b38] hover:bg-[#d95c2b]' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Tiếp tục
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}