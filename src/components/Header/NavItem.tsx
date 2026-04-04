// src/components/Header/NavItem.tsx

interface NavItemProps {
  title: string;
  subMenu?: string[]; // Dấu ? nghĩa là không bắt buộc (vì có mục không có dropdown)
}

export default function NavItem({ title, subMenu }: NavItemProps) {
  return (
    <li className="relative flex items-center gap-1 hover:text-orange-500 cursor-pointer group transition-colors text-[15px] py-4">
      {title}
      
      {/* Chỉ render icon mũi tên nếu mục đó có subMenu */}
      {subMenu && (
        <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}

      {/* PHẦN DROPDOWN XỔ XUỐNG */}
      {subMenu && (
        <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <ul className="py-2">
            {subMenu.map((subItem, index) => (
              <li key={index}>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors">
                  {subItem}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}