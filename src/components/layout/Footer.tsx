export default function Footer() {
    return (
        <footer className="bg-[#333333] text-gray-300 py-12 text-sm mt-20">
            <div className="max-w-6xl mx-auto px-4">

                {/* ====== PHẦN 1: LƯỚI THÔNG TIN (4 CỘT) ====== */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Cột 1: Giới thiệu */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold uppercase tracking-wider mb-2">Giới Thiệu</h3>
                        <a href="#" className="hover:text-white transition-colors">Về Chúng Tôi</a>
                        <a href="#" className="hover:text-white transition-colors">Thoả Thuận Sử Dụng</a>
                        <a href="#" className="hover:text-white transition-colors">Quy Chế Hoạt Động</a>
                        <a href="#" className="hover:text-white transition-colors">Chính Sách Bảo Mật</a>
                    </div>

                    {/* Cột 2: Góc Điện Ảnh */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold uppercase tracking-wider mb-2">Góc Điện Ảnh</h3>
                        <a href="#" className="hover:text-white transition-colors">Thể Loại Phim</a>
                        <a href="#" className="hover:text-white transition-colors">Bình Luận Phim</a>
                        <a href="#" className="hover:text-white transition-colors">Blog Điện Ảnh</a>
                        <a href="#" className="hover:text-white transition-colors">Phim Hay Tháng</a>
                        <a href="#" className="hover:text-white transition-colors">Phim IMAX</a>
                    </div>

                    {/* Cột 3: Hỗ Trợ */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white font-bold uppercase tracking-wider mb-2">Hỗ Trợ</h3>
                        <a href="#" className="hover:text-white transition-colors">Góp Ý</a>
                        <a href="#" className="hover:text-white transition-colors">Sale & Services</a>
                        <a href="#" className="hover:text-white transition-colors">Rạp / Giá Vé</a>
                        <a href="#" className="hover:text-white transition-colors">Tuyển Dụng</a>
                        <a href="#" className="hover:text-white transition-colors">FAQ</a>
                    </div>

                    {/* Cột 4: Kết Nối & Chứng Nhận */}
                    <div className="flex flex-col gap-4 items-start">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2">
                            <img src="/logo/logogalaxy.png" alt="VieCinema Logo" />
                        </h2>

                        <div className="flex ]items-center gap-4">
                            <a href="#" className="w-8 h-8 bg-gray-500 hover:bg-blue-600 flex items-center justify-center rounded-full text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-500 hover:bg-red-600 flex items-center justify-center rounded-full text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-500 hover:bg-pink-600 flex items-center justify-center rounded-full text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                        <img
                            src="/logo/logoBCT.png"
                            alt="Đã thông báo Bộ Công Thương"
                            className="h-10 mt-2"
                        />
                    </div>

                </div>

                {/* ====== PHẦN 2: BẢN QUYỀN (LINE CÁCH ĐIỆU) ====== */}
                <div className="pt-8 border-t border-gray-600 flex flex-col md:flex-row items-center gap-6">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter opacity-50">
                        <img src="logo/logogalaxy.png" alt="VieCinema Logo" />
                    </h2>
                    <div className="flex-1">
                        <h4 className="text-white font-bold mb-1 uppercase">Công Ty Cổ Phần Giải Trí VieCinema</h4>
                        <p className="mb-1 text-gray-400">MST: 0123456789 - Cấp ngày 01/01/2025 bởi Sở Kế hoạch và Đầu tư TP.HCM</p>
                        <p className="mb-1 text-gray-400">Địa chỉ: 180 Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam</p>
                        <p className="text-gray-400">
                            Điện thoại: 028.123.4567 - Hotline: 1900 9999 (9:00 - 22:00) - Email: hotro@viecinema.vn
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    );
}