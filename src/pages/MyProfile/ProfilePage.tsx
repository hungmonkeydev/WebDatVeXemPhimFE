import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Button from '../../components/UI/Button';
import Toast from '../../components/UI/Toast';
import Spinner from '../../components/UI/Spinner';
import MyTicketsPage from '../MyProfile/MyTicketsPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoyaltyProgress } from '../../Hooks/useLoyaltyProgress';
import LoyaltyHistory from '../MyProfile/LoyaltyHistory';
import MyVouchers from '../../pages/MyProfile/MyVouchers';
import { useAuth } from '../../Hooks/useAuth';
import { message } from 'antd';
export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { progressData } = useLoyaltyProgress() || {}; const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'thong-tin');
    const [profileData, setProfileData] = useState<any>(null);

    const { changePassword, isLoading: isPwdLoading } = useAuth();
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'male',
        loyalty_points: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);
    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                setIsLoading(true);

                const response = await userService.getProfile();

                const data = response.data?.data || response.data;

                if (data) {
                    setProfileData(data);
                    setFormData({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
                        gender: data.gender ? data.gender.toLowerCase() : 'male',
                        loyalty_points: data.membership?.currentPoints || 0
                    })
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        fetchMyProfile();
    }, []);

    // HÀM GỌI API CẬP NHẬT
    const handleUpdateProfile = async () => {
        try {
            const payload = {
                fullName: formData.fullName,
                phone: formData.phone,
                gender: formData.gender ? formData.gender.toUpperCase() : 'MALE',
                birthDate: formData.birthDate,
            };
            await userService.updateProfile(payload);

            message.success("Cập nhật thông tin thành công!");
        } catch (error) {
            message.error("Cập nhật thất bại!");
            console.error(error);
        }
    };
    const handleChangePassword = async () => {
        if (!pwdData.oldPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
            setToast({ isOpen: true, message: 'Vui lòng nhập đầy đủ thông tin!', type: 'error' });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(pwdData.newPassword)) {
            setToast({
                isOpen: true,
                message: 'Mật khẩu phải từ 6 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt!',
                type: 'error'
            });
            return;
        }

        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setToast({ isOpen: true, message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
            return;
        }

        setToast({ ...toast, isOpen: false });

        const result = await changePassword({
            oldPassword: pwdData.oldPassword,
            newPassword: pwdData.newPassword,
            confirmPassword: pwdData.confirmPassword
        });
        if (result.success) {
            setToast({ isOpen: true, message: result.message, type: 'success' });
            setIsEditingPassword(false);
            setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setToast({ isOpen: true, message: result.message, type: 'error' });
        }
    };

    const tabs = [
        { id: 'lich-su', label: 'Lịch Sử Giao Dịch' },
        { id: 'lich-su-tich-diem', label: 'Lịch sử tích điểm' },
        { id: 'myvoucher', label: 'Voucher Của Tôi' },

        { id: 'thong-tin', label: 'Thông Tin Cá Nhân' },
        { id: 'thong-bao', label: 'Thông Báo' },
        { id: 'qua-tang', label: 'Quà Tặng' }
    ];
    const totalSpent = progressData?.totalSpent || 0;


    let progressPercent = 0;

    if (totalSpent <= 1000000) {
        progressPercent = (totalSpent / 1000000) * 33.33;
    } else if (totalSpent <= 5000000) {
        const excess = totalSpent - 1000000;
        const interval = 4000000;
        progressPercent = 33.33 + ((excess / interval) * 33.33);
    } else if (totalSpent <= 10000000) {
        const excess = totalSpent - 5000000;
        const interval = 5000000;
        progressPercent = 66.66 + ((excess / interval) * 33.33);
    } else {
        progressPercent = 100;
    }
    return (
        <div className="min-h-screen bg-[#f4f4f4] py-10 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

                {/* === SIDEBAR TRÁI  === */}
                <div className="w-full md:w-[320px] shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                        <div className="flex items-center gap-4 w-full mb-6">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow">
                                <span className="text-xl font-bold text-gray-500">{formData.fullName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-[17px]">{formData.fullName || 'Khách hàng'}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                    <span className="text-orange-500">🎁</span> {progressData?.currentPoints || 0} Stars
                                    <span
                                        className="text-[10px] font-bold text-white px-2 py-0.5 rounded mt-1 inline-block uppercase shadow-sm"
                                        style={{ backgroundColor: progressData?.tierColorCode || '#A0A0A0' }}
                                    >
                                        {progressData?.membershipTierName || 'MEMBER'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Thanh tiến trình chi tiêu*/}
                        <div className="w-full border-t border-gray-100 pt-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 font-medium text-[15px]">Tổng chi tiêu 2026</span>
                                <span className="font-bold text-[#f26b38]">{Number(totalSpent).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-gray-200 rounded-full mb-10 mt-6">
                                {/* Thanh chạy màu cam */}
                                <div className="absolute top-0 left-0 h-full bg-[#f26b38] rounded-full z-0" style={{ width: `${progressPercent}%` }}></div>

                                {/* 4 Chấm tròn đánh dấu mốc (Member, Silver, Gold, Diamond) */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#f26b38] rounded-full z-10"></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 left-[33.33%] -translate-x-1/2 w-4 h-4 bg-white border-2 rounded-full z-10 transition-colors duration-300 ${totalSpent >= 1000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 left-[66.66%] -translate-x-1/2 w-4 h-4 bg-white border-2 rounded-full z-10 transition-colors duration-300 ${totalSpent >= 5000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 left-[100%] -translate-x-1/2 w-4 h-4 bg-white border-2 rounded-full z-10 transition-colors duration-300 ${totalSpent >= 10000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                
                                <div className="absolute top-4 left-0 -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-gray-400">MEMBER</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">0 ₫</div>
                                </div>

                                <div className="absolute top-4 left-[33.33%] -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-[#C0C0C0]">SILVER</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">1 Tr ₫</div>
                                </div>

                                <div className="absolute top-4 left-[66.66%] -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-[#FFD700]">GOLD</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">5 Tr ₫</div>
                                </div>

                                <div className="absolute top-4 left-[100%] -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-[#B9F2FF]">DIAMOND</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">10 Tr ₫</div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <hr className='w-full border-gray-300 mt-2' />
                            <h1 className='w-full text-sm text-gray-800 text-left'>Hotline hỗ trợ <span className='text-sm font-bold not-italic text-[#034EA2]'>19001234 (9h-22h)</span></h1>
                            <hr className='w-full border-gray-300 mb-2' />
                            <h1 className='w-full text-sm text-gray-800 text-left'>Email: <span className='text-sm font-bold not-italic text-[#034EA2]'>hotrogalaxy@gmail.com</span></h1>
                            <hr className='w-full border-gray-300 mb-2' />
                            <h1 className='w-full text-sm text-gray-800 text-left'>Các câu hỏi thường gặp</h1>
                            <hr className='w-full border-gray-300 mb-2' />
                        </div>
                    </div>
                </div>

                {/* === NỘI DUNG PHẢI === */}
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex items-center overflow-x-auto border-b border-gray-200 custom-scrollbar px-2 bg-gray-50/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-6 py-4 text-[15px] font-semibold transition-all relative ${activeTab === tab.id ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>

                    {/* NỘI DUNG TAB THÔNG TIN CÁ NHÂN */}
                    {activeTab === 'thong-tin' && (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* HỌ VÀ TÊN */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>

                                {/* NGÀY SINH */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>

                                {/* EMAIL */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[14px] text-gray-600 font-medium">Email</label>
                                        {profileData?.emailVerified ? (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold tracking-wide">ĐÃ XÁC THỰC</span>
                                        ) : (
                                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold tracking-wide">CHƯA XÁC THỰC</span>
                                        )}
                                    </div>
                                    <input
                                        type="email"
                                        readOnly
                                        value={formData.email}
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-2.5 text-[15px] text-gray-400 cursor-not-allowed outline-none"
                                    />
                                </div>

                                {/* SỐ ĐIỆN THOẠI */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[14px] text-gray-600 font-medium">Số điện thoại</label>
                                        {profileData?.phoneVerified ? (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold tracking-wide">ĐÃ XÁC THỰC</span>
                                        ) : (
                                            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold tracking-wide">CHƯA XÁC THỰC</span>
                                        )}
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                                {/* GIỚI TÍNH */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] text-gray-600 font-medium">Giới tính</label>
                                    <div className="flex items-center gap-6 h-full mt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male' || formData.gender === 'Nam'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-4 h-4 text-[#f26b38] accent-[#f26b38]"
                                            />
                                            <span className="text-[15px] text-gray-700">Nam</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female' || formData.gender === 'Nữ'}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-4 h-4 text-[#f26b38] accent-[#f26b38]"
                                            />
                                            <span className="text-[15px] text-gray-700">Nữ</span>
                                        </label>
                                    </div>
                                </div>

                                {/* MẬT KHẨU */}
                                <div className={`flex flex-col gap-1.5 ${isEditingPassword ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[14px] text-gray-600 font-medium">Mật khẩu</label>

                                    {!isEditingPassword ? (
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder='**********'
                                                readOnly
                                                className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none bg-gray-50 text-gray-400 cursor-not-allowed"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingPassword(true)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#f26b38] hover:text-[#d95a2b] font-medium"
                                            >
                                                Thay đổi
                                            </button>
                                        </div>
                                    ) : (
                                        /* FORM ĐỔI MẬT KHẨU MỞ RỘNG */
                                        <div className="bg-gray-50 p-5 rounded border border-gray-200 flex flex-col gap-4 mt-1">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                {/* Ô 1: Mật khẩu hiện tại */}
                                                <div className="relative">
                                                    <input
                                                        type={showOldPassword ? "text" : "password"}
                                                        placeholder="Mật khẩu hiện tại"
                                                        value={pwdData.oldPassword}
                                                        onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                                                        autoComplete="new-password"
                                                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:border-[#f26b38] outline-none pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showOldPassword ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Ô 2: Mật khẩu mới */}
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Mật khẩu mới"
                                                        value={pwdData.newPassword}
                                                        onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                                                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:border-[#f26b38] outline-none pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showNewPassword ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Ô 3: Nhập lại mật khẩu mới */}
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Nhập lại mật khẩu mới"
                                                        value={pwdData.confirmPassword}
                                                        onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                                                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] focus:border-[#f26b38] outline-none pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                                        )}
                                                    </button>
                                                </div>

                                            </div>
                                            <div className="flex justify-end gap-3 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditingPassword(false);
                                                        setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                                    }}
                                                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                                >
                                                    Hủy
                                                </button>
                                                <Button
                                                    onClick={handleChangePassword}
                                                    disabled={isPwdLoading}
                                                    className="px-6 bg-[#f26b38] hover:bg-[#d95a2b] transition-colors"
                                                >
                                                    {isPwdLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <Spinner size="sm" color="white" /> Đang lưu...
                                                        </div>
                                                    ) : 'Lưu mật khẩu'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NÚT BẤM CẬP NHẬT */}
                                <div className="flex justify-end mt-8 border-t border-gray-100 pt-6">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={isLoading}
                                        className="px-8 bg-[#f26b38] hover:bg-[#d95a2b] shadow-md transition-colors"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner size="sm" color="white" /> Đang cập nhật...
                                            </div>
                                        ) : 'Cập nhật'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lich-su' && (
                        <div className="p-4 md:p-8">
                            <MyTicketsPage />
                        </div>
                    )}
                    {activeTab === 'lich-su-tich-diem' && (
                        <div className="p-4 md:p-8 bg-gray-50/30">
                            <LoyaltyHistory />
                        </div>
                    )}
                    {activeTab === 'myvoucher' && (
                        <div className="p-4 md:p-8 bg-gray-50/30">
                            <MyVouchers />
                        </div>
                    )}
                    {/* CÁC TAB KHÁC (DỰ PHÒNG CHỜ PHÁT TRIỂN) */}
                    {activeTab !== 'thong-tin' && activeTab !== 'lich-su' && activeTab !== 'lich-su-tich-diem' && (
                        <div className="p-8 text-center text-gray-400">
                            Tính năng {tabs.find(t => t.id === activeTab)?.label} đang được nâng cấp!
                        </div>
                    )}
                </div>

                {/* THÔNG BÁO TOAST POPUP */}
                <Toast
                    isOpen={toast.isOpen}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, isOpen: false })}
                />
            </div>
        </div>
    );
}