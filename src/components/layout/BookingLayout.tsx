import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function BookingLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  /** Clears the booking timer when the user fully exits the booking flow */
  useEffect(() => {
    return () => {
      localStorage.removeItem('bookingExpireTime');
    };
  }, []);

  /** Initializes and manages the countdown timer */
  useEffect(() => {
    let expireTime = localStorage.getItem('bookingExpireTime');

    if (!expireTime) {
      if (location.pathname.includes('/chon-ghe')) {
         const newExpireTime = new Date().getTime() + 5 * 60 * 1000;
         localStorage.setItem('bookingExpireTime', newExpireTime.toString());
         expireTime = newExpireTime.toString();
      } else {
         alert('Phiên đặt vé không hợp lệ hoặc đã hết hạn. Vui lòng đặt lại từ đầu.');
         navigate('/');
         return;
      }
    }

    let timer: ReturnType<typeof setInterval>;

    const tick = () => {
      const now = new Date().getTime();
      const remaining = Math.floor((parseInt(expireTime as string) - now) / 1000);

      if (remaining <= 0) {
        if (timer) clearInterval(timer);
        setTimeLeft(0);
        localStorage.removeItem('bookingExpireTime');
        alert('⏳ Đã hết thời gian giữ ghế! Vui lòng đặt lại từ đầu.');
        navigate('/');
      } else {
        setTimeLeft(remaining);
      }
    };

    tick();
    timer = setInterval(tick, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [location.pathname, navigate]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex-grow flex flex-col relative">
      {timeLeft !== null && (
        <div className="bg-[#f26b38] text-white text-center py-2 text-[15px] font-medium sticky top-0 z-50 shadow-md w-full">
          Thời gian giữ ghế còn lại: <span className="font-bold text-lg tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      )}
      <Outlet />
    </div>
  );
}
