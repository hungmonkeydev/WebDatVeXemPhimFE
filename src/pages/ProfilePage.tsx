import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Spinner from '../components/ui/Spinner';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('thong-tin');

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        loyalty_points: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setFormData({
                full_name: parsedUser.full_name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                date_of_birth: parsedUser.date_of_birth ? parsedUser.date_of_birth.split('T')[0] : '',
                gender: parsedUser.gender || 'male',
                loyalty_points: parsedUser.loyalty_points || 0
            });
        }
    }, []);

    // 3. HÀM GỌI API CẬP NHẬT
    const handleUpdateProfile = async () => {
        setIsLoading(true);
        setToast({ ...toast, isOpen: false });

        try {
            const token = localStorage.getItem('access_token');

            // const response = await axios.put('https://webxemphim-sbim.onrender.com/api/v1/users/me', {
            //     full_name: formData.full_name,
            //     phone: formData.phone,
            //     date_of_birth: formData.date_of_birth,
            //     gender: formData.gender
            // }, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });

            // Nếu thành công -> Cập nhật lại kho LocalStorage
            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user_info') || '{}'),
                ...formData
            };
            localStorage.setItem('user_info', JSON.stringify(updatedUser));

            window.dispatchEvent(new Event('authChange'));

            setToast({ isOpen: true, message: 'Cập nhật thông tin thành công!', type: 'success' });

        } catch (error: any) {
            console.log(error.response);
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

    return (
        <div className="min-h-screen bg-[#f4f4f4] py-10 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

                {/* === SIDEBAR TRÁI (Giữ nguyên) === */}
                <div className="w-full md:w-[320px] shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                        <div className="flex items-center gap-4 w-full mb-6">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow">
                                <span className="text-xl font-bold text-gray-500">{formData.full_name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-[17px]">{formData.full_name || 'Khách hàng'}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                    <span className="text-orange-500">🎁</span> {formData.loyalty_points} Stars
                                </p>
                            </div>
                        </div>

                        {/* Thanh tiến trình chi tiêu... (Code thanh bar này của bạn nãy tui viết giữ nguyên nha) */}
                        <div className="w-full border-t border-gray-100 pt-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-700 font-medium text-[15px]">Tổng chi tiêu 2026</span>
                                <span className="font-bold text-[#f26b38]">0 ₫</span>
                            </div>
                            <div className="relative w-full h-1.5 bg-gray-200 rounded-full mb-8 mt-6">
                                <div className="absolute top-0 left-0 h-full bg-[#f26b38] rounded-full w-[10%]"></div>
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
                <div className="flex-1 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center overflow-x-auto border-b border-gray-200 custom-scrollbar px-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-6 py-4 text-[15px] font-semibold transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'thong-tin' && (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                {/* HỌ VÀ TÊN (Mở khóa cho phép sửa) */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>

                                {/* NGÀY SINH */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>

                                {/* EMAIL (Read-only, thường không cho đổi tùy tiện) */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Email</label>
                                    <input
                                        type="email"
                                        readOnly
                                        value={formData.email}
                                        className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2.5 text-[15px] text-gray-500 cursor-not-allowed outline-none"
                                    />
                                </div>

                                {/* SỐ ĐIỆN THOẠI */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                    />
                                </div>


                                {/* GIỚI TÍNH */}
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-4 h-4 text-[#f26b38] focus:ring-[#f26b38] accent-[#f26b38]"
                                        />
                                        <span className="text-[15px] text-gray-700">Nam</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-4 h-4 text-[#f26b38] focus:ring-[#f26b38] accent-[#f26b38]"
                                        />
                                        <span className="text-[15px] text-gray-700">Nữ</span>
                                    </label>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] text-gray-600 font-medium">Mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            // value={formData.password}
                                            placeholder='**********'
                                            // readOnly
                                            // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full border border-gray-200 rounded px-4 py-2.5 text-[15px] outline-none focus:border-[#f26b38]"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#f26b38] hover:text-[#d95a2b] font-medium"
                                        >
                                            Thay đổi
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* NÚT CẬP NHẬT */}
                            <div className="flex justify-end mt-8 border-t border-gray-100 pt-6">
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="px-8 bg-[#f26b38] hover:bg-[#d95a2b] shadow-md"
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

                </div>
            </div>
            <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isOpen: false })} />
        </div>
    );
}