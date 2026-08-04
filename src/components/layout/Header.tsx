import { useState, useEffect } from 'react';
import Logo from './Logo';
import TicketButton from '../Layout/TicketButton';
import Navigation from '../Layout/Navigation';
import UserAction from '../Layout/UserAction';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('phim');

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginOpen(true);
      window.history.replaceState({}, document.title);

    }
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-40">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          <TicketButton />
          <Navigation />
        </div>
        <div className="hidden lg:flex flex-shrink-0">
          <UserAction onOpenLogin={() => setIsLoginOpen(true)} />
        </div>

        {/* NÚT HAMBURGER MOBILE */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-[#f26b38] focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ================= KHU VỰC MENU SIDEBAR MOBILE ================= */}

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Nút Đóng (X) */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-8 flex flex-col gap-6">

          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-[#f26b38]"
            />
          </div>

          <div className="flex justify-between items-center gap-4">
            <TicketButton />
            <UserAction onOpenLogin={() => {
              setIsLoginOpen(true);
              setIsMobileMenuOpen(false);
            }} />
          </div>

          <hr className="border-gray-100" />

          <div className="flex flex-col">
            <Navigation />
          </div>

        </div>
      </div>

      {/* ================= MODAL ĐĂNG NHẬP / ĐĂNG KÝ ================= */}
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