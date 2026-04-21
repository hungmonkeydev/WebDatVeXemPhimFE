interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'gray';
  className?: string;
}

export default function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: SpinnerProps) {
  
  // 1. Cấu hình Kích thước
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };

  // 2. Cấu hình Màu sắc (border-t-transparent giúp tạo hiệu ứng khuyết 1 góc để xoay)
  const colorClasses = {
    white: 'border-white border-t-transparent',
    primary: 'border-[#f26b38] border-t-transparent', // Màu cam chủ đạo của bạn
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    ></div>
  );
}