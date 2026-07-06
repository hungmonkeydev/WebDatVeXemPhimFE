import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Spinner from '../components/ui/Spinner';
import MyTicketsPage from './MyTicketsPage';
import { useLocation, useNavigate } from 'react-router-dom';
export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'thong-tin');
    const [profileData, setProfileData] = useState<any>(null);
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
                        gender: data.gender || 'male',
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
        setIsLoading(true);
        setToast({ ...toast, isOpen: false });

        try {
            await userService.updateProfile({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender
            });

            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user_info') || '{}'),
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                loyalty_points: formData.loyalty_points
            };
            localStorage.setItem('user_info', JSON.stringify(updatedUser));

            window.dispatchEvent(new Event('authChange'));

            setToast({ isOpen: true, message: 'Cập nhật thông tin thành công!', type: 'success' });

        } catch (error: any) {
            console.error("Lỗi cập nhật profile:", error.response);
            setToast({ isOpen: true, message: 'Cập nhật thất bại. Vui lòng thử lại!', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'lich-su', label: 'Lịch Sử Giao Dịch' },
        { id: 'thong-tin', label: 'Thông Tin Cá Nhân' },
        { id: 'thong-bao', label: 'Thông Báo' },
        { id: 'qua-tang', label: 'Quà Tặng' }
    ];
    const totalSpent = profileData?.statistics?.totalSpent || 0;
    const progressPercent = Math.min((totalSpent / 4000000) * 100, 100);
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
                                    <span className="text-orange-500">🎁</span> {formData.loyalty_points} Stars
                                </p>
                                <span className="text-[10px] font-bold bg-gradient-to-r from-gray-700 to-gray-900 text-white px-2 py-0.5 rounded mt-1 inline-block uppercase">
                                    {profileData?.membership?.tierName || 'MEMBER'}
                                </span>
                            </div>
                        </div>

                        {/* Thanh tiến trình chi tiêu*/}
                        <div className="w-full border-t border-gray-100 pt-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 font-medium text-[15px]">Tổng chi tiêu 2026</span>
                                <span className="font-bold text-[#f26b38]">{Number(totalSpent).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-gray-200 rounded-full mb-8 mt-6">
                                <div className="absolute top-0 left-0 h-full bg-[#f26b38] rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-white border-2 border-[#f26b38] rounded-full"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-4 h-4 bg-white border-2 border-blue-400 rounded-full"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-white border-2 border-blue-400 rounded-full"></div>
                                <div className="absolute top-4 left-0 -translate-x-1/2 text-[12px] text-gray-500 whitespace-nowrap">0 ₫</div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[12px] text-gray-500 whitespace-nowrap">2.000.000 ₫</div>
                                <div className="absolute top-4 right-0 translate-x-1/4 text-[12px] text-gray-500 whitespace-nowrap">4.000.000 ₫</div>
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
                    {/* Menu chọn Tab */}
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
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder='**********'
                                            readOnly
                                            className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none bg-gray-50 text-gray-400 cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => alert("Tính năng đổi mật khẩu đang được cập nhật!")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#f26b38] hover:text-[#d95a2b] font-medium"
                                        >
                                            Thay đổi
                                        </button>
                                    </div>
                                </div>
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
                    )}

                    {/* CÁC TAB KHÁC (DỰ PHÒNG CHỜ PHÁT TRIỂN) */}
                    {activeTab !== 'thong-tin' && (
                        <div className="p-8 text-center text-gray-400">
                            Tính năng {tabs.find(t => t.id === activeTab)?.label} đang được nâng cấp!
                        </div>
                    )}
                    {activeTab === 'lich-su' && (
                        <div className="p-4 md:p-8">
                            <MyTicketsPage />
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