// src/pages/SeatSelection.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeats } from '../Hooks/useSeats';
import Spinner from '../components/UI/Spinner';
import { useHoldSeats } from '../Hooks/useHoldSeats';
import BookingSummary from '../components/Booking/BookingSummary';
import { bookingService } from '../services/bookingService';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { seatRows, seatTypes, showtimeInfo, roomInfo, isLoadingSeats } = useSeats(id);
  console.log("🚨 KIỂM TRA DỮ LIỆU GHẾ TRÊN UI:", seatRows);

  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const { holdSeats, isHolding } = useHoldSeats();

  let startTimeDisplay = showtimeInfo?.startTime ? showtimeInfo.startTime.substring(11, 16) : 'Đang tải...';
  let dateDisplay = 'Đang tải...';

  if (showtimeInfo && showtimeInfo.startTime) {
    const safeDateStr = showtimeInfo.startTime.replace('Z', '');
    const dateObj = new Date(safeDateStr);

    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = dayNames[dateObj.getDay()];
    const dateStr = dateObj.toLocaleDateString('vi-VN');

    dateDisplay = `${dayOfWeek}, ${dateStr}`;
  }

  // --- HÀM MỚI: XỬ LÝ CHỌN CẢ NHÓM GHẾ (COUPLE HOẶC SINGLE) ---
  const toggleSeatGroup = async (seatsToToggle: any[]) => {
    const isAlreadySelectedByMe = selectedSeats.some(s => s.seatId === seatsToToggle[0].seatId);
    const isAnySeatNotSelectable = seatsToToggle.some(seat => !seat.isSelectable);
    if (isAnySeatNotSelectable && !isAlreadySelectedByMe) return;

    const seatIdsToToggle = seatsToToggle.map(s => s.seatId);
    const token = localStorage.getItem('access_token');

    if (isAlreadySelectedByMe) {
      // Bỏ chọn → nhả ghế
      if (token) {
        seatsToToggle.forEach(seat => {
          bookingService.releaseSeat({ showtimeId: Number(id), seatId: seat.seatId })
            .catch(err => console.error("Lỗi nhả ghế:", err));
        });
      }
      setSelectedSeats(prev => prev.filter(s => !seatIdsToToggle.includes(s.seatId)));
    } else {
      // Chọn thêm → chỉ update UI, KHÔNG gọi holdSeats
      setSelectedSeats(prev => [...prev, ...seatsToToggle]);
    }
  };
  const SEAT_COLORS: Record<number, string> = {
    1: '#4CAF50', // Thường (Xanh lá)
    2: '#FFD700', // VIP (Vàng)
    3: '#E91E63', // Couple (Hồng)
    4: '#9C27B0', // Deluxe (Tím)
  };

  const totalPrice = selectedSeats.reduce((total, seat) => {
    return total + Number(seat.price || 0);
  }, 0);

  const handleNext = async () => {
    const seatIds = selectedSeats.map(seat => seat.seatId);

    // Kiểm tra token
    const rawToken = localStorage.getItem('access_token');
    const isValidToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined';

    // NẾU LÀ KHÁCH VÃNG LAI -> ĐI THẲNG LUÔN, BỎ QUA API
    if (!isValidToken) {
      console.log("Khách vãng lai đi thẳng qua trang thức ăn!");
      const expireAt = Date.now() + (300 * 1000); 
      navigate(`/dat-ve/${id}/thuc-an`, {
        state: {
          selectedSeats: selectedSeats,
          showtimeInfo: showtimeInfo,
          roomInfo: roomInfo,
          totalTicketPrice: totalPrice,
          remainingSeconds: 300,
          expireAt
        }
      });
      return;
    }

    const result = await holdSeats(id, seatIds);

    if (result.success) {
      const expireAt = Date.now() + (result.remainingSeconds * 1000);
      navigate(`/dat-ve/${id}/thuc-an`, {
        state: {
          selectedSeats: selectedSeats,
          showtimeInfo: showtimeInfo,
          roomInfo: roomInfo,
          totalTicketPrice: totalPrice,
          remainingSeconds: result.remainingSeconds,
          expireAt
        }
      });
    } else {
      alert(`❌ Không thể tiếp tục: ${result.message}`);
    }
  };

  if (isLoadingSeats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!seatRows || seatRows.length === 0 || !showtimeInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <img src="https://galaxycine.vn/assets/images/404.png" alt="Not Found" className="w-48 opacity-50 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Suất chiếu không tồn tại!</h2>
        <p className="text-gray-500">Suất chiếu này có thể đã bị hủy hoặc hệ thống đang bảo trì.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-[#f26b38] text-white px-8 py-2.5 rounded font-semibold hover:bg-[#d95c2b] shadow-sm"
        >
          Quay Về Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">

      {/* ====== THANH TIẾN ĐỘ (STEPPER) ====== */}
      <div className="hidden md:block bg-white shadow-sm mb-8">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 py-4 text-sm font-semibold">
          <span className="text-gray-400">Chọn phim / Rạp / Suất</span>
          <span className="text-blue-700 border-b-2 border-blue-700 pb-4 -mb-4">Chọn ghế</span>
          <span className="text-gray-400">Chọn thức ăn</span>
          <span className="text-gray-400">Thanh toán</span>
          <span className="text-gray-400">Xác nhận</span>
        </div>
      </div>

      {/* ====== NỘI DUNG CHÍNH ====== */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">

        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-items-center mb-10">
            <span className="text-gray-600 font-medium">Đổi suất chiếu</span>
            <button className=" ml-auto bg-blue-700 text-white px-6 py-1.5 rounded text-sm font-semibold">{startTimeDisplay}</button>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-max flex flex-col items-center gap-3">

              {/* Vòng lặp vẽ Hàng Ghế */}
              {seatRows && seatRows.map((rowItem: any) => (
                <div key={rowItem.rowLabel} className="flex items-center gap-4">
                  {/* Tên hàng ghế (Trái) */}
                  <span className="font-bold text-gray-500 w-4 text-center">{rowItem.rowLabel}</span>

                  {/* Vẽ các Ghế trong hàng */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const renderSeatBtn = (seat: any, groupSeats: any[]) => {
                        const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
                        const isSold = !seat.isSelectable && !isSelected;
                        const seatColor = SEAT_COLORS[seat.seatTypeId] || '#e5e7eb';

                        return (
                          <button
                            key={seat.seatId}
                            onClick={() => toggleSeatGroup(groupSeats)}
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
                            {seat.seatLabel.replace(rowItem.rowLabel, '')}
                          </button>
                        );
                      };

                      // 2. Gom nhóm ghế: Cứ thấy type 3 thì bắt cặp 2 cái liền kề
                      const groupedSeats = [];
                      let i = 0;
                      while (i < rowItem.seats.length) {
                        const seat = rowItem.seats[i];
                        // Nếu là ghế Couple và cái tiếp theo cũng là Couple
                        if (seat.seatTypeId === 3 && i + 1 < rowItem.seats.length && rowItem.seats[i + 1].seatTypeId === 3) {
                          groupedSeats.push({ isCouple: true, seats: [seat, rowItem.seats[i + 1]] });
                          i += 2; // Nhảy cóc qua 2 ghế
                        } else {
                          groupedSeats.push({ isCouple: false, seats: [seat] });
                          i += 1; // Đi tiếp từng ghế
                        }
                      }

                      return groupedSeats.map((group, index) => {
                        if (group.isCouple) {
                          return (
                            // Khung bọc viền cho 2 ghế Couple
                            <div key={`couple-${index}`} className="flex gap-1 border-2 border-[#E91E63] p-[3px] rounded-lg bg-pink-50 shadow-sm items-center justify-center">
                              {group.seats.map((seat: any) => renderSeatBtn(seat, group.seats))}
                            </div>
                          );
                        } else {
                          return (
                            <React.Fragment key={`single-${index}`}>
                              {group.seats.map((seat: any) => renderSeatBtn(seat, group.seats))}
                            </React.Fragment>
                          );
                        }
                      });
                    })()}
                  </div>

                  {/* Tên hàng ghế (Phải) */}
                  <span className="font-bold text-gray-500 w-4 text-center">{rowItem.rowLabel}</span>
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

                {/* Ghế Deluxe (Tím) */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#9C27B0] rounded border-b-2 border-[#7B1FA2]"></div>
                  Deluxe
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: BILL THANH TOÁN === */}
        <BookingSummary
          showtimeInfo={showtimeInfo}
          roomInfo={roomInfo}
          startTimeDisplay={startTimeDisplay}
          dateDisplay={dateDisplay}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onBack={() => navigate(-1)}
          onNext={handleNext}
          nextLabel={isHolding ? 'Đang giữ ghế...' : 'Tiếp tục'}
          isNextDisabled={selectedSeats.length === 0 || isHolding}
        />

      </div>
    </div>
  );
}