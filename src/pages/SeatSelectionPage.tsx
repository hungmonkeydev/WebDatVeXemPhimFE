
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSeats } from '../Hooks/useSeats';
import Spinner from '../components/UI/Spinner';
import { useHoldSeats } from '../Hooks/useHoldSeats';
import BookingSummary from '../components/Booking/BookingSummary';
import { bookingService } from '../services/bookingService';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();


  const { seatRows, seatTypes, showtimeInfo, roomInfo, isLoadingSeats } = useSeats(id);
  console.log("Kiểm tra dữ liệu ghế trên UI:", seatRows);

  // state form quản lý url hiện tại
  const location = useLocation();
  // state thời gian ghế được giữ
  const expireAt = location.state?.expireAt;
  // state thời gian còn lại
  const remainingSeconds = location.state?.remainingSeconds || 0;
  // state quản lý ghế đã chọn
  const [selectedSeats, setSelectedSeats] = useState<any[]>(
    location.state?.selectedSeats || []
  );
  // state quản lý ghế đã nhả
  const [releasedSeatIds, setReleasedSeatIds] = useState<Set<number>>(new Set());

  // xử lý ghế đã được chọn trước đó
  const effectiveSelectedSeats = useMemo(() => {
    const list = [...selectedSeats];
    const selectedIds = new Set(list.map(s => s.seatId));

    if (seatRows) {
      seatRows.forEach((row: any) => {
        row.seats.forEach((seat: any) => {
          if (seat.status === 'held_by_you' && !selectedIds.has(seat.seatId) && !releasedSeatIds.has(seat.seatId)) {
            list.push(seat);
            selectedIds.add(seat.seatId);
          }
        });
      });
    }
    return list;
  }, [selectedSeats, seatRows, releasedSeatIds]);

  const { holdSeats, isHolding } = useHoldSeats();

  // xử lý hiển thị thời gian chiếu
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
  // xử lý chọn ghế
  const toggleSeatGroup = async (seatsToToggle: any[]) => {
    const isAlreadySelectedByMe = effectiveSelectedSeats.some(s => s.seatId === seatsToToggle[0].seatId);
    const isAnySeatNotSelectable = seatsToToggle.some(seat => !seat.isSelectable);
    if (isAnySeatNotSelectable && !isAlreadySelectedByMe) return;

    const seatIdsToToggle = seatsToToggle.map(s => s.seatId);
    const token = localStorage.getItem('access_token');

    if (isAlreadySelectedByMe) {
      if (token) {
        seatsToToggle.forEach(seat => {
          bookingService.releaseSeat({ showtimeId: Number(id), seatId: seat.seatId })
            .catch(err => console.error("Lỗi nhả ghế:", err));
        });
      }
      setSelectedSeats(prev => prev.filter(s => !seatIdsToToggle.includes(s.seatId)));
      setReleasedSeatIds(prev => {
        const next = new Set(prev);
        seatIdsToToggle.forEach(id => next.add(id));
        return next;
      });
    } else {
      setSelectedSeats(prev => [...prev, ...seatsToToggle]);
      setReleasedSeatIds(prev => {
        const next = new Set(prev);
        seatIdsToToggle.forEach(id => next.delete(id));
        return next;
      });
    }
  };
  // hiển thị màu ghế
  const SEAT_COLORS: Record<number, string> = {
    1: '#4CAF50',
    2: '#FFD700',
    3: '#E91E63',
    4: '#9C27B0',
  };

  const totalPrice = effectiveSelectedSeats.reduce((total, seat) => {
    return total + Number(seat.price || 0);
  }, 0);

  const comboCart = location.state?.comboCart || {};
  const combos = location.state?.combos || [];

  const totalComboPrice = combos.reduce((total: number, combo: any) => {
    const qty = comboCart[combo.comboId || combo.id] || 0;
    return total + (Number(combo.price) * qty);
  }, 0);

  const finalTotalPrice = totalPrice + totalComboPrice;

  // xử lý chuyển sang trang thức ăn
  const handleNext = async () => {
    const seatIds = effectiveSelectedSeats.map(seat => seat.seatId);
    const rawToken = localStorage.getItem('access_token');
    const isValidToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined';
    if (!isValidToken) {
      console.log("Khách vãng lai đi thẳng qua trang thức ăn!");
      navigate(`/dat-ve/${id}/thuc-an`, {
        state: {
          ...location.state,
          selectedSeats: effectiveSelectedSeats,
          showtimeInfo: showtimeInfo,
          roomInfo: roomInfo,
          totalTicketPrice: totalPrice,
          comboCart: comboCart,
          combos: combos,
          remainingSeconds: 0,
          expireAt: 0
        }
      });
      return;
    }

    const result = await holdSeats(id, seatIds);

    if (result.success) {
      // Nếu đã có thời gian đếm ngược từ trước thì giữ nguyên không reset, 
      // nếu chưa có thì lấy thời gian mới từ backend
      const seconds = result.remainingSeconds || 300;
      const finalExpireAt = expireAt ? expireAt : Date.now() + (seconds * 1000);
      const finalRemainingSeconds = expireAt ? Math.floor((finalExpireAt - Date.now()) / 1000) : seconds;

      navigate(`/dat-ve/${id}/thuc-an`, {
        state: {
          ...location.state,
          selectedSeats: effectiveSelectedSeats,
          showtimeInfo: showtimeInfo,
          roomInfo: roomInfo,
          totalTicketPrice: totalPrice,
          comboCart: comboCart,
          combos: combos,
          remainingSeconds: finalRemainingSeconds,
          expireAt: finalExpireAt
        }
      });
    } else {
      alert(` Không thể tiếp tục: ${result.message}`);
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

        {/* Sơ đồ ghế */}
        <div className="flex-1 bg-white p-2 md:p-6 rounded-lg shadow-sm w-full">
          <div className="flex items-center mb-6 md:mb-10 px-2">
            <span className="text-gray-600 font-medium text-sm md:text-base">Đổi suất chiếu</span>
            <button className=" ml-auto bg-blue-700 text-white px-4 md:px-6 py-1.5 rounded text-sm font-semibold">{startTimeDisplay}</button>
          </div>

          <div className="w-full pb-6">

            {/* Căn giữa toàn bộ cụm sơ đồ */}
            <div className="w-full flex flex-col items-center gap-1.5 md:gap-3">

              {/* Vòng lặp vẽ Hàng Ghế */}
              {seatRows && seatRows.map((rowItem: any) => (
                <div key={rowItem.rowLabel} className="flex items-center justify-between w-full max-w-[500px]">

                  {/* Tên hàng ghế (Trái) */}
                  <span className="font-bold text-gray-500 text-xs md:text-sm w-4 md:w-5 text-center shrink-0">{rowItem.rowLabel}</span>

                  {/* Vẽ các Ghế trong hàng */}
                  <div className="flex items-center justify-center gap-[2px] sm:gap-1 md:gap-2 flex-1 mx-1 md:mx-2">
                    {(() => {
                      const renderSeatBtn = (seat: any, groupSeats: any[]) => {
                        const isSelected = effectiveSelectedSeats.some((s) => s.seatId === seat.seatId);
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
                            className={`w-7 h-7 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-t md:rounded-t-lg rounded-b-sm text-[8px] sm:text-[9px] md:text-[11px] font-medium border-b-[2px] md:border-b-4 flex items-center justify-center transition-all hover:scale-110 shrink-0
                            ${isSold ? 'cursor-not-allowed opacity-50' : 'cursor-pointer shadow-sm'}
                          `}
                          >
                            {seat.seatLabel.replace(rowItem.rowLabel, '')}
                          </button>
                        );
                      };

                      // Gom nhóm ghế Couple
                      const groupedSeats = [];
                      let i = 0;
                      while (i < rowItem.seats.length) {
                        const seat = rowItem.seats[i];
                        if (seat.seatTypeId === 3 && i + 1 < rowItem.seats.length && rowItem.seats[i + 1].seatTypeId === 3) {
                          groupedSeats.push({ isCouple: true, seats: [seat, rowItem.seats[i + 1]] });
                          i += 2;
                        } else {
                          groupedSeats.push({ isCouple: false, seats: [seat] });
                          i += 1;
                        }
                      }

                      return groupedSeats.map((group, index) => {
                        if (group.isCouple) {
                          return (
                            <div key={`couple-${index}`} className="flex gap-[2px] md:gap-1 border-[1.5px] md:border-2 border-[#E91E63] p-[2px] md:p-[3px] rounded bg-pink-50 shadow-sm items-center justify-center shrink-0">
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
                  <span className="font-bold text-gray-500 text-xs md:text-sm w-4 md:w-5 text-center shrink-0">{rowItem.rowLabel}</span>
                </div>
              ))}

              {/* Màn hình (Screen) */}
              <div className="w-full max-w-[400px] h-1 bg-orange-400 mt-6 md:mt-10 mb-2 shadow-[0_10px_20px_rgba(242,107,56,0.3)]"></div>
              <span className="text-gray-400 text-[10px] md:text-sm mb-6 md:mb-8 tracking-[0.2em] text-center w-full block">MÀN HÌNH</span>

              {/* Chú thích màu ghế */}
              <div className="flex flex-wrap gap-2 md:gap-6 text-[9px] sm:text-[10px] md:text-xs text-gray-600 justify-center mt-2 w-full">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-gray-300 rounded border-b-[1px] md:border-b-2 border-gray-400 text-gray-500 flex items-center justify-center font-bold text-[8px] md:text-xs">X</div>
                  Đã bán
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#f26b38] rounded border-b-[1px] md:border-b-2 border-[#d95a2b]"></div>
                  Đang chọn
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#4CAF50] rounded border-b-[1px] md:border-b-2 border-[#388E3C]"></div>
                  Thường
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#FFD700] rounded border-b-[1px] md:border-b-2 border-[#FFA000]"></div>
                  VIP
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#E91E63] rounded border-b-[1px] md:border-b-2 border-[#C2185B]"></div>
                  Couple
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#9C27B0] rounded border-b-[1px] md:border-b-2 border-[#7B1FA2]"></div>
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
          selectedSeats={effectiveSelectedSeats}
          totalPrice={finalTotalPrice}
          combos={combos}
          comboCart={comboCart}
          remainingSeconds={remainingSeconds}
          expireAt={expireAt}
          onTimeout={async () => {
            try {
              await bookingService.releaseAllSeats();
            } catch (err) { }
            alert("Đã hết thời gian giữ ghế! Vui lòng chọn lại từ đầu.");
            setSelectedSeats([]);
            setReleasedSeatIds(new Set());
            navigate(`/dat-ve/${id}/chon-ghe`, { replace: true, state: {} });
          }}
          onBack={async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
              try {
                await bookingService.releaseAllSeats();
              } catch (err) {
                console.error("Lỗi khi nhả ghế:", err);
              }
            }
            navigate(`/phim/${showtimeInfo?.movieId}`);
          }}
          onNext={handleNext}
          nextLabel={isHolding ? 'Đang giữ ghế...' : 'Tiếp tục'}
          isNextDisabled={effectiveSelectedSeats.length === 0 || isHolding}
        />

      </div>
    </div>
  );
}