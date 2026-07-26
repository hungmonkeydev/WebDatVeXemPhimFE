import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Toast from '../UI/Toast';
import Spinner from '../UI/Spinner';
import img from '../../../public/iconlogin/icon-login.fbbf1b2d.svg';
import { useAuth } from '../../Hooks/useAuth';
import { authService } from '../../services/authService';
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
  const { register, isLoading } = useAuth();

  const [step, setStep] = useState<'form' | 'check-email'>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setToast({ isOpen: true, message: 'Vui lòng đồng ý với Điều khoản dịch vụ!', type: 'error' });
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email.trim())) {
      setToast(
        {
          isOpen: true,
          message: 'Email không hợp lệ!',
          type: 'error'
        });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setToast({
        isOpen: true,
        message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!',
        type: 'error'
      });
      return;
    }
    if (password !== confirmPassword) {
      setToast({
        isOpen: true,
        message: 'Mật khẩu nhập lại không khớp!',
        type: 'error'
      });
      return;
    }

    setToast({ ...toast, isOpen: false });

    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
      birthDate: dob ? dob : null,
      gender: gender ? gender.toUpperCase() : null
    });

    if (result.success) {
      setRegisteredEmail(email.trim());
      setStep('check-email');
    } else {
      setToast({ isOpen: true, message: result.message, type: 'error' });
    }
  };
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    try {
      await authService.resendVerification(registeredEmail);
      setToast({ isOpen: true, message: 'Đã gửi lại email xác thực!', type: 'success' });

      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.response?.data?.message || 'Gửi lại email thất bại. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setIsResending(false);
    }
  };
  const handleClose = () => {
    setStep('form');
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[450px]">
        {step === 'form' ? (
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
                <label className="text-[13px] text-gray-500 font-medium">Họ và tên<span className="text-red-500 ml-0.5">*</span></label>
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
                <label className="text-[13px] text-gray-500 font-medium">Email<span className="text-red-500 ml-0.5">*</span></label>
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
                <label className="text-[13px] text-gray-500 font-medium">Số điện thoại<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập Số điện thoại"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                />
              </div>

              {/* Giới tính  */}
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
                <label className="text-[13px] text-gray-500 font-medium">Mật khẩu<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập Mật khẩu"
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Nhập lại mật khẩu<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 text-[15px] outline-none focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
                  Bằng việc đăng ký tài khoản, tôi đồng ý với
                  <a href="#" className="text-blue-600 font-medium hover:underline">Điều khoản dịch vụ</a>
                  và <a href="#" className="text-blue-600 font-medium hover:underline">Chính sách bảo mật</a> của hệ thống.
                </p>
              </div>

              <Button
                fullWidth
                type="submit"
                size="lg"
                disabled={isLoading}
                className={isLoading ? "bg-[#e4a185] border-[#e4a185]" : ""}
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

            <div className="w-full text-center border-t border-gray-200 pt-5 mt-6">
              <p className="text-[13px] text-gray-500 mb-3">Bạn đã có tài khoản?</p>
              <Button
                variant="outline"
                fullWidth
                type="button"
                onClick={() => { handleClose(); onSwitchToLogin(); }}
              >
                Đăng nhập
              </Button>
            </div>

          </div>
        ) : (
          // MÀN HÌNH: "KIỂM TRA EMAIL"
          <div className="p-8 flex flex-col items-center text-center my-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-[#f26b38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-[19px] font-bold text-gray-800 mb-2">Kiểm tra email của bạn</h2>
            <p className="text-[14px] text-gray-500 mb-1">
              Chúng tôi đã gửi một email xác thực đến
            </p>
            <p className="text-[14px] font-semibold text-gray-800 mb-6">{registeredEmail}</p>
            <p className="text-[13px] text-gray-400 mb-8">
              Vui lòng bấm vào liên kết trong email để kích hoạt tài khoản. Nếu không thấy email, hãy kiểm tra thư mục Spam.
            </p>

            <Button
              variant="outline"
              fullWidth
              type="button"
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="primary" />
                  <span>ĐANG GỬI...</span>
                </div>
              ) : resendCooldown > 0 ? (
                `Gửi lại sau ${resendCooldown}s`
              ) : (
                'Gửi lại email xác thực'
              )}
            </Button>

            <Button
              fullWidth
              type="button"
              size="lg"
              className="mt-3"
              onClick={() => { handleClose(); onSwitchToLogin(); }}
            >
              Đến trang đăng nhập
            </Button>
          </div>
        )}
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