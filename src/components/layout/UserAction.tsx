import { useState, useEffect } from 'react';
import img from '../../../public/logo/join-member-Gstar.svg';
import img1 from '../../../public/iconlogin/icon-login.fbbf1b2d.svg';
import Button from '../ui/Button';

interface UserActionProps {
  onOpenLogin: () => void;
}

export default function UserAction({ onOpenLogin }: UserActionProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadUserFromStorage = () => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    window.addEventListener('authChange', loadUserFromStorage);
    return () => {
      window.removeEventListener('authChange', loadUserFromStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <div className="flex items-center gap-4">
      <input type="text" placeholder='Tìm kiếm' className='border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-[#f26b38]' />

      {currentUser ? (
        
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Avatar tròn */}
            <div className="w-[38px] h-[38px] bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#f26b38] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Tên và Icon xổ xuống */}
            <div className="hidden md:flex items-center gap-1">
               <span className="font-semibold text-gray-700 text-[14px] group-hover:text-[#f26b38] transition-colors">
                  {currentUser.full_name}
               </span>
               <svg className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Menu thả xuống */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-[240px] bg-white rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50 border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
              
              {/* Header của Menu (Chứa thông tin điểm) */}
              <div className="px-5 py-3 border-b border-gray-100 mb-2 bg-gray-50/50">
                <p className="font-bold text-gray-800 text-[15px]">{currentUser.full_name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-yellow-500">🏅</span>
                  <span className="text-gray-600 text-sm">{currentUser.loyalty_points || 0} Stars</span>
                </div>
              </div>

              <a href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-[14.5px] text-gray-700 hover:bg-orange-50 hover:text-[#f26b38] border-l-4 border-transparent hover:border-[#f26b38] transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                Tài Khoản
              </a>

              <a href="/history" className="flex items-center gap-3 px-5 py-2.5 text-[14.5px] text-gray-700 hover:bg-orange-50 hover:text-[#f26b38] border-l-4 border-transparent hover:border-[#f26b38] transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Lịch Sử Mua Vé
              </a>

              <div className="h-[1px] bg-gray-100 my-1"></div>

              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-5 py-2.5 text-[14.5px] text-gray-700 hover:bg-red-50 hover:text-red-500 border-l-4 border-transparent hover:border-red-500 transition-all text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Đăng Xuất
              </button>

            </div>
          )}
        </div>

      ) : (

        /* GIAO DIỆN KHI CHƯA ĐĂNG NHẬP (Giữ nguyên nút của bạn) */
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-2 text-[14.5px] font-medium text-gray-700 hover:text-[#f26b38] transition-colors cursor-pointer"
        >
          <span>Đăng nhập</span>
        </button>

      )}

      {/* CHỈ HIỆN KHỐI G-STAR NÀY KHI CHƯA ĐĂNG NHẬP */}
      {!currentUser && (
        <>
          <div className="w-[1px] h-6 bg-gray-200"></div>
          {/* Khối Join Member GStar */}
          <div className="relative group cursor-pointer">
            <button className="flex items-center gap-2 font-bold text-[14px] text-gray-700 hover:text-[#f26b38] transition-colors uppercase">
              <img src={img} alt="Join Member GStar" className="h-10 cursor-pointer object-contain" />
            </button>

            {/* Bảng Dropdown Gstar Mega Menu */}
            <div className="absolute top-full right-0 pt-5 w-[650px] bg-white rounded-lg shadow-2xl border border-gray-100 p-6 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center">
                  <img src={img1} alt="Thể Lệ" className="w-16 h-16 object-cover rounded-full mb-3" />
                  <h4 className="font-medium text-gray-800 text-[14px] mb-4 h-10">Thể Lệ</h4>
                  <Button variant="outline" size="sm" className="w-24">Chi Tiết</Button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <img src={img1} alt="Quyền Lợi" className="w-16 h-16 object-cover rounded-full mb-3" />
                  <h4 className="font-medium text-gray-800 text-[14px] mb-4 h-10">Quyền Lợi</h4>
                  <Button variant="outline" size="sm" className="w-24">Chi Tiết</Button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <img src={img1} alt="Hướng Dẫn" className="w-16 h-16 object-cover rounded-full mb-3" />
                  <h4 className="font-medium text-gray-800 text-[14px] mb-4 h-10">Hướng Dẫn</h4>
                  <Button variant="outline" size="sm" className="w-24">Chi Tiết</Button>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-200 pl-4">
                  <img src={img1} alt="Đăng Ký" className="w-16 h-16 object-cover rounded-full mb-3" />
                  <h4 className="font-bold text-gray-800 text-[13px] mb-4 h-10 leading-snug">Đăng Ký Thành Viên Nhận Ngay Ưu Đãi!</h4>
                  <Button size="sm" className="w-full">Đăng Ký</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}