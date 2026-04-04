// src/components/Home/QuickBooking/BookingSelect.tsx

interface BookingSelectProps {
  stepNumber: number;
  placeholder: string;
}

export default function BookingSelect({ stepNumber, placeholder }: BookingSelectProps) {
  return (
    // flex-1 giúp các ô chia đều không gian với nhau
    // border-r tạo cái vạch kẻ dọc màu xám ngăn cách giữa các ô
    <div className="flex-1 h-full flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 transition-colors border-r border-gray-200 group">
      
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Vòng tròn cam chứa số thứ tự */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-[#f26b38] flex items-center justify-center text-xs font-bold group-hover:bg-[#f26b38] group-hover:text-white transition-colors">
          {stepNumber}
        </div>
        
        {/* Chữ hiển thị (truncate giúp cắt chữ nếu dài quá thành dấu ...) */}
        <span className="text-gray-600 text-[15px] truncate font-medium">
          {placeholder}
        </span>
      </div>

      {/* Icon mũi tên chĩa xuống nhỏ xíu bên phải */}
      <svg 
        className="w-4 h-4 text-gray-400 flex-shrink-0" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}