// src/components/Home/QuickBooking/BookingBar.tsx

import BookingSelect from './BookingSelect';

export default function BookingBar() {
  // Tạo mảng dữ liệu để dùng hàm map() render ra 4 ô cho lẹ
  const bookingSteps = [
    { stepNumber: 1, placeholder: 'Chọn Phim' },
    { stepNumber: 2, placeholder: 'Chọn Rạp' },
    { stepNumber: 3, placeholder: 'Chọn Ngày' },
    { stepNumber: 4, placeholder: 'Chọn Suất' },
  ];

  return (
    // bg-white: Nền trắng
    // rounded-lg: Bo góc tròn
    // shadow-lg: Đổ bóng cho nổi lên trên banner
    // overflow-hidden: Để cái nền cam của nút Mua vé không bị tràn ra khỏi góc bo tròn
    <div className="bg-white rounded-lg shadow-lg flex items-center w-full h-[68px] overflow-hidden">
      
      {/* Container chứa 4 ô chọn (Chiếm phần lớn diện tích) */}
      <div className="flex items-center h-full flex-grow">
        {bookingSteps.map((step) => (
          <BookingSelect 
            key={step.stepNumber} 
            stepNumber={step.stepNumber} 
            placeholder={step.placeholder} 
          />
        ))}
      </div>

      {/* Nút Mua Vé Nhanh (Nằm sát mép phải, chiều cao bằng luôn thanh bar) */}
      <button className="h-full bg-[#f26b38] hover:bg-[#d95c2b] transition-colors px-8 text-white font-semibold text-[15px] flex-shrink-0">
        Mua vé nhanh
      </button>

    </div>
  );
}