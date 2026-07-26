import Modal from '../UI/Modal';
import Button from '../UI/Button';
import img from '../../../public/iconlogin/icon-login.fbbf1b2d.svg';
import { useState } from 'react';
import Toast from '../UI/Toast';
import Spinner from '../UI/Spinner';
import { useAuth } from '../../Hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSuccess }: LoginModalProps) {
  // State đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State cho Quên mật khẩu
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  // Lấy thêm forgotPassword ra từ Hook
  const { login, forgotPassword, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ ...toast, isOpen: false });
    const result = await login(email, password);
    if (result.success) {
      setToast({ isOpen: true, message: 'Đăng nhập thành công', type: 'success' });
      onClose();
      onSuccess?.();
    } else {
      setToast({ isOpen: true, message: 'Email hoặc mật khẩu không đúng!', type: 'error' });
    }
  };

  // HÀM XỬ LÝ QUÊN MẬT KHẨU
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setToast({ isOpen: true, message: 'Vui lòng nhập email của bạn!', type: 'error' });
      return;
    }

    setToast({ ...toast, isOpen: false });
    const result = await forgotPassword(forgotEmail);

    if (result.success) {
      setToast({ isOpen: true, message: result.message, type: 'success' });
      setIsForgotView(false); // Thành công thì quay lại màn hình đăng nhập
      setForgotEmail('');
    } else {
      setToast({ isOpen: true, message: result.message, type: 'error' });
    }
  };

  // RESET FORM KHI ĐÓNG MODAL
  const handleClose = () => {
    setIsForgotView(false);
    setForgotEmail('');
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[450px]">
        <div className="p-8 flex flex-col items-center">

          <img src={img} alt="Login Illustration" className="w-40 h-auto mb-4 object-contain rounded" />

          <h2 className="text-[19px] font-bold text-gray-800 mb-6">
            {!isForgotView ? 'Đăng Nhập Tài Khoản' : 'Khôi Phục Mật Khẩu'}
          </h2>

          {!isForgotView ? (

            //FORM 1: ĐĂNG NHẬP 
            <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Nhập email"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[13px] text-gray-500 font-medium">Mật khẩu</label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    className="w-full border border-gray-300 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <Button fullWidth type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" color="white" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : 'ĐĂNG NHẬP'}
              </Button>
            </form>
          ) : (
            //FORM 2: QUÊN MẬT KHẨU
            <form className="w-full flex flex-col gap-5" onSubmit={handleForgotPassword}>
              <p className="text-[13px] text-gray-500 text-center mb-2">
                Vui lòng nhập email đã đăng ký. Hệ thống sẽ gửi mật khẩu mới cho bạn.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Email của bạn</label>
                <input
                  onChange={(e) => setForgotEmail(e.target.value)}
                  value={forgotEmail}
                  type="email"
                  placeholder="Nhập email..."
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                  required
                />
              </div>

              <Button fullWidth type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" color="white" />
                    <span>Đang gửi...</span>
                  </div>
                ) : 'NHẬN MẬT KHẨU MỚI'}
              </Button>
            </form>
          )}

          <div className="w-full text-left mt-4 mb-6">
            {!isForgotView ? (
              <button
                type="button"
                onClick={() => setIsForgotView(true)}
                className="text-gray-500 hover:text-[#f26b38] text-[13px] transition-colors"
              >
                Quên mật khẩu?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsForgotView(false)}
                className="text-gray-500 hover:text-[#f26b38] text-[13px] transition-colors"
              >
                ← Quay lại đăng nhập
              </button>
            )}
          </div>

          {!isForgotView && onSwitchToRegister && (
            <div className="w-full text-center border-t border-gray-200 pt-5 mt-2">
              <p className="text-[13px] text-gray-500 mb-3">Bạn chưa có tài khoản?</p>
              <Button variant="outline" fullWidth type="button" onClick={onSwitchToRegister}>
                Đăng ký
              </Button>
            </div>
          )}

        </div>
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
    </>
  );
}