import { useState } from 'react';
import axios from 'axios';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import Spinner from '../ui/Spinner';
import img from '../../../public/iconlogin/icon-login.fbbf1b2d.svg';
import { useAuth } from '../../hooks/useAuth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void; 
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  // 1. STATE LƯU TRỮ DỮ LIỆU FORM
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
  const { register, isLoading } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ isOpen: true, message: 'Mật khẩu nhập lại không khớp!', type: 'error' });
      return;
    }
    if (!agreeTerms) {
      setToast({ isOpen: true, message: 'Vui lòng đồng ý với Điều khoản dịch vụ!', type: 'error' });
      return;
    }

    setToast({ ...toast, isOpen: false });

    const result = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      date_of_birth: dob,
      gender: gender
    });

    // Hứng kết quả và báo ra màn hình
    if (result.success) {
      setToast({ isOpen: true, message: result.message, type: 'success' });
      setTimeout(() => {
        onClose(); 
        onSwitchToLogin(); 
      }, 1500);
    } else {
      setToast({ isOpen: true, message: result.message, type: 'error' });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[450px]">
        <div className="p-8 flex flex-col items-center my-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          <img 
            src={img} 
            alt="Register Illustration" 
            className="w-40 h-auto mb-4 object-contain rounded"
          />
          
          <h2 className="text-[19px] font-bold text-gray-800 mb-6">Đăng Ký Tài Khoản</h2>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Họ và tên</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập Họ và tên"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập Email"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Số điện thoại</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập Số điện thoại"
                className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
              />
            </div>

            {/* Giới tính (Radio) */}
            <div className="flex items-center gap-6 mt-1 mb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-[#f26b38] focus:ring-[#f26b38]" 
                />
                <span className="text-[14px] text-gray-700">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-4 h-4 text-[#f26b38] focus:ring-[#f26b38]" 
                />
                <span className="text-[14px] text-gray-700">Nữ</span>
              </label>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Ngày sinh</label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] text-gray-500 outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
              />
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Mật khẩu</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập Mật khẩu"
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium">Nhập lại mật khẩu</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>

            {/* Điều khoản */}
            <div className="flex items-start gap-2 mt-2 mb-2">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer accent-[#f26b38]" 
              />
              <p className="text-[12px] text-gray-600 leading-snug">
                Bằng việc đăng ký tài khoản, tôi đồng ý với <a href="#" className="text-blue-600 font-medium hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 font-medium hover:underline">Chính sách bảo mật</a> của hệ thống.
              </p>
            </div>

            {/* Nút Hoàn Thành đã được nâng cấp */}
            <Button 
              fullWidth 
              type="submit" 
              size="lg" 
              disabled={isLoading}
              className={isLoading ? "bg-[#e4a185] border-[#e4a185]" : ""} // Giữ lại màu cam nhạt nếu bạn thích lúc loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="white" /> 
                  <span>ĐANG XỬ LÝ...</span>
                </div>
              ) : (
                'HOÀN THÀNH'
              )}
            </Button>
          </form>

          {/* Chuyển sang Đăng Nhập */}
          <div className="w-full text-center border-t border-gray-200 pt-5 mt-6">
            <p className="text-[13px] text-gray-500 mb-3">Bạn đã có tài khoản?</p>
            <Button 
              variant="outline" 
              fullWidth 
              type="button"
              onClick={() => { onClose(); onSwitchToLogin(); }} 
            >
              Đăng nhập
            </Button>
          </div>

        </div>
      </Modal>

      {/* Component thông báo */}
      <Toast 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </>
  );
}