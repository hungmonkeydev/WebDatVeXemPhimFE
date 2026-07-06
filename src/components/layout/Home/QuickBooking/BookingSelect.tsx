interface BookingSelectProps {
  stepNumber: number;
  placeholder: string;
}

export default function BookingSelect({ stepNumber, placeholder }: BookingSelectProps) {
  return (
    // ĐỔI CHỖ NÀY: Thêm md:flex-1 để trên PC nó giãn đều 4 ô ra, lấp kín cái thanh trắng
    <div className="w-auto md:flex-1 shrink-0 h-full flex items-center justify-between px-3 md:px-5 cursor-pointer hover:bg-gray-50 transition-colors border-r border-gray-200 group">

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-100 text-[#f26b38] flex items-center justify-center text-[11px] md:text-xs font-bold group-hover:bg-[#f26b38] group-hover:text-white transition-colors">
          {stepNumber}
        </div>

        <span className="text-gray-600 text-[13px] md:text-[15px] whitespace-nowrap font-medium">
          {placeholder}
        </span>
      </div>

      <svg
        className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0 ml-2 md:ml-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}