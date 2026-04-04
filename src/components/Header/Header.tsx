import Logo from './Logo';
import TicketButton from './TicketButton';
import Navigation from './Navigation';
import UserAction from './UserAction';

export default function Header() {
  return (
    // Thẻ header bọc ngoài cùng, thêm shadow nhẹ và nền trắng
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Container giới hạn độ rộng và căn giữa, dàn đều 3 phần */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Cụm 1: Logo (Bên trái) */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Cụm 2: Nút Mua Vé + Menu Navigation (Ở giữa) */}
        <div className="flex items-center gap-8">
          <TicketButton />
          <Navigation />
        </div>

        {/* Cụm 3: Tìm kiếm + Profile User (Bên phải) */}
        <div className="flex-shrink-0">
          <UserAction />
        </div>

      </div>
    </header>
  );
}