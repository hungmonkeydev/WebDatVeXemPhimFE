import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import Spinner from '../../components/ui/Spinner';
import MyTicketsPage from './MyTicketsPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoyaltyProgress } from '../../hooks/useLoyaltyProgress';
import LoyaltyHistory from './LoyaltyHistory';
export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { progressData } = useLoyaltyProgress();
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
        { id: 'lich-su-tich-diem', label: 'Lịch sử tích điểm' },

        { id: 'thong-tin', label: 'Thông Tin Cá Nhân' },
        { id: 'thong-bao', label: 'Thông Báo' },
        { id: 'qua-tang', label: 'Quà Tặng' }
    ];
    const currentPts = progressData?.currentPoints || 0;
    const totalSpent = currentPts * 10000;

    // 2. Tính % thanh Tiến độ (Dùng thuật toán nội suy từng chặng)
    let progressPercent = 0;

    if (totalSpent <= 10000000) {
        // Chặng 1: Member -> Silver (0 - 10 Tr) | Chiếm 33.33% chiều dài thanh
        progressPercent = (totalSpent / 10000000) * 33.33;
    } else if (totalSpent <= 50000000) {
        // Chặng 2: Silver -> Gold (10 Tr - 50 Tr) | Từ 33.33% đến 66.66%
        const excess = totalSpent - 10000000; // Số tiền dư ra sau khi đạt Silver
        const interval = 40000000; // Khoảng cách chặng này là 40 Triệu
        progressPercent = 33.33 + ((excess / interval) * 33.33);
    } else if (totalSpent <= 100000000) {
        // Chặng 3: Gold -> Diamond (50 Tr - 100 Tr) | Từ 66.66% đến 100%
        const excess = totalSpent - 50000000; // Số tiền dư ra sau khi đạt Gold
        const interval = 50000000; // Khoảng cách chặng này là 50 Triệu
        progressPercent = 66.66 + ((excess / interval) * 33.33);
    } else {
        // Chặng MAX: Trên 100 Triệu (Diamond)
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
                                    <span className="text-orange-500">🎁</span> {progressData?.currentPoints || 0} Stars                                </p>
                                <span
                                    className="text-[10px] font-bold text-white px-2 py-0.5 rounded mt-1 inline-block uppercase shadow-sm"
                                    style={{ backgroundColor: progressData?.tierColorCode || '#A0A0A0' }}
                                >
                                    {progressData?.membershipTierName || 'MEMBER'}
                                </span>
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
                                <div className="absolute top-0 left-0 h-full bg-[#f26b38] rounded-full" style={{ width: `${progressPercent}%` }}></div>

                                {/* 4 Chấm tròn đánh dấu mốc (Member, Silver, Gold, Diamond) */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-white border-2 border-[#f26b38] rounded-full"></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 left-[33%] w-4 h-4 bg-white border-2 rounded-full transition-colors duration-300 ${totalSpent >= 10000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 left-[66%] w-4 h-4 bg-white border-2 rounded-full transition-colors duration-300 ${totalSpent >= 50000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-white border-2 rounded-full transition-colors duration-300 ${totalSpent >= 100000000 ? 'border-[#f26b38]' : 'border-gray-300'}`}></div>
                                {/* Chữ hiển thị số tiền dưới các mốc */}
                                <div className="absolute top-4 left-0 -translate-x-1/4 text-center">
                                    <div className="text-[10px] font-bold text-gray-400">MEMBER</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">0 ₫</div>
                                </div>

                                <div className="absolute top-4 left-[33%] -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-[#C0C0C0]">SILVER</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">10 Tr ₫</div>
                                </div>

                                <div className="absolute top-4 left-[66%] -translate-x-1/2 text-center">
                                    <div className="text-[10px] font-bold text-[#FFD700]">GOLD</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">50 Tr ₫</div>
                                </div>

                                <div className="absolute top-4 right-0 translate-x-1/4 text-center">
                                    <div className="text-[10px] font-bold text-[#B9F2FF]">DIAMOND</div>
                                    <div className="text-[12px] text-gray-500 whitespace-nowrap">100 Tr ₫</div>
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