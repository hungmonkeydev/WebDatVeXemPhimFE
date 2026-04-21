import { useState } from 'react';
import Logo from './Logo';
import TicketButton from './TicketButton';
import Navigation from './Navigation';
import UserAction from './UserAction';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  return (
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
          <UserAction onOpenLogin={() => setIsLoginOpen(true)} />
        </div>
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}