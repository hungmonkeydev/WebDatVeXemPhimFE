import Modal from '../ui/Modal';
import Button from '../ui/Button';
import img from '../../../public/iconlogin/icon-login.fbbf1b2d.svg';
import { useState } from 'react';
import Toast from '../ui/Toast';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../hooks/useAuth'; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ ...toast, isOpen: false });
    const result = await login(email, password);
    if (result.success) {
      setToast({ isOpen: true, message: result.message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      // Nếu thất bại
      setToast({ isOpen: true, message: result.message, type: 'error' });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[450px]">
        <div className="p-8 flex flex-col items-center">
          
          <img src={img} alt="Login Illustration" className="w-40 h-auto mb-4 object-contain rounded" />
          <h2 className="text-[19px] font-bold text-gray-800 mb-6">Đăng Nhập Tài Khoản</h2>

          <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
            
            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Nhập email"
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
              />
            </div>

            {/* Input Mật khẩu */}
            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[13px] text-gray-500 font-medium">Mật khẩu</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nút Đăng Nhập */}
            <Button fullWidth type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="white" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </Button>
          </form>

          {/* Link Quên mật khẩu */}
          <div className="w-full text-left mt-4 mb-6">
            <button className="text-gray-500 hover:text-[#f26b38] text-[13px] transition-colors">Quên mật khẩu?</button>
          </div>

          {/* Dòng chữ và Nút Đăng ký */}
          <div className="w-full text-center border-t border-gray-200 pt-5 mt-2">
            <p className="text-[13px] text-gray-500 mb-3">Bạn chưa có tài khoản?</p>
            <Button variant="outline" fullWidth type="button" onClick={onSwitchToRegister}>
              Đăng ký
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </>
  );
}