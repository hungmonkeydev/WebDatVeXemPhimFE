import React from 'react';

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO PROPS
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
    
  // Style dùng chung cho mọi nút
  const baseStyle = "inline-flex items-center justify-center gap-2 font-semibold rounded transition-colors duration-300";
  
  // Style cho từng Kiểu dáng (Variant)
  const variants = {
    primary: "bg-[#f26b38] text-white hover:bg-[#d95c2b] border border-[#f26b38]",
    outline: "bg-transparent text-[#f26b38] border border-[#f26b38] hover:bg-[#f26b38] hover:text-white",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-transparent",
    ghost: "bg-transparent text-white border border-white hover:border-[#f26b38] hover:text-[#f26b38]",
  };

  // Style cho từng Kích thước (Size)
  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-6 text-[15px]",
    lg: "py-3 px-8 text-lg",
  };
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";

  // Độ rộng của nút
  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${disabledStyle} ${widthStyle} ${className}`;

  return (
    <button 
      className={combinedClassName} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
  );
}