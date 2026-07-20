import { useState,useEffect  } from 'react';
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

   const location = useLocation();
    useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginOpen(true);
    }
  }, [location]);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        <div className="flex-shrink-0">
          <Logo />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <TicketButton />
          <Navigation />
        </div>
        <div className="hidden lg:flex flex-shrink-0">
          <UserAction onOpenLogin={() => setIsLoginOpen(true)} />
        </div>

        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-[#f26b38] focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* ================= KHU VỰC MENU XỔ XUỐNG CỦA ĐIỆN THOẠI ================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t border-gray-100 shadow-xl pb-4">
          <div className="flex flex-col px-4 pt-4 pb-2 space-y-5">
            <div className="flex justify-center">
              <TicketButton />
            </div>
            
            <div className="border-t border-b border-gray-100 py-3">
              <Navigation />
            </div>
            
            <div className="flex justify-center pt-2">
              <UserAction onOpenLogin={() => {
                setIsLoginOpen(true);
                setIsMobileMenuOpen(false);
              }} />
            </div>
          </div>
        </div>
      )}

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