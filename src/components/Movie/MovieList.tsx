import { useState } from 'react'; 
import MovieCard from '../Movie/MovieCard';

// import imgPhiVu from '../../assets/movie/phivucuoicung.png';
// import imgMario from '../../assets/movie/mario.png';
// import imgSongHy from '../../assets/movie/songhylamnguy.png';
// import imgHenEm from '../../assets/movie/henemngaynhatthuc.png';
// import imgAnhDuong from '../../assets/movie/anhduongcuame.png';
// import imgMatna from '../../assets/movie/matnadanguoi.png';
// import imgTuhodainao from '../../assets/movie/tuhodainao.png';
// import imgThoOi from '../../assets/movie/thooi.png';
// import imgQuyNhapTrang from '../../assets/movie/quynhaptrang.png';
// import imgTai from '../../assets/movie/tai.png';
// import imgVungDatLuanhoi from '../../assets/movie/vungdatluanhoi.png';
// import imgDemNgayXaMe from '../../assets/movie/demngayxame.png';
// import imgcuNhay from '../../assets/movie/cunhaykidieu.png';
// import imgThoatKhoiTanThe from '../../assets/movie/thoatkhoitanthe.png';
import { useMovies } from '../../hooks/useMovies';

export default function MovieList() {
    const [activeTab, setActiveTab] = useState('dang_chieu');
    const [isExpanded, setIsExpanded] = useState(false);
    
    const tabs = [
        { id: 'dang_chieu', label: 'Đang chiếu' },
        { id: 'sap_chieu', label: 'Sắp chiếu' },
        { id: 'imax', label: 'Phim IMAX' },
    ];
    const { moviesList, isLoading } = useMovies();
    // const movies = [
    //     { id: 1, title: 'Phi Vụ Cuối Cùng', rating: '9.0', ageTag: 'T18', category: 'dang_chieu', image: imgPhiVu },
    //     { id: 2, title: 'Phim Mario', rating: '7.9', ageTag: 'K', category: 'dang_chieu', image: imgMario },
    //     { id: 3, title: 'Song Hỷ Lâm Nguy', rating: '8.7', ageTag: 'T13', category: 'sap_chieu', image: imgSongHy },
    //     { id: 4, title: 'Hẹn Em Ngày Nhật Thực', rating: '8.7', ageTag: 'T16', category: 'sap_chieu', image: imgHenEm },
    //     { id: 5, title: 'Ánh Dương Của Mẹ', rating: '9.5', ageTag: 'T18', category: 'imax', image: imgAnhDuong },
    //     { id: 6, title: 'Mặt Nạ Quỷ', rating: '9.5', ageTag: 'T18', category: 'imax', image: imgMatna },
    //     { id: 7, title: 'Tủ Hồ Sơ Đại Não', rating: '9.5', ageTag: 'T18', category: 'imax', image: imgTuhodainao },
    //     { id: 8, title: 'Thỏ ơi', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgThoOi },
    //     { id: 9, title: 'Quỷ Nhập Tràng', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgQuyNhapTrang },
    //     { id: 10, title: 'Tài', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgTai },
    //     { id: 11, title: 'Vùng đất luân hồi', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgVungDatLuanhoi },
    //     { id: 12, title: 'cú Nhảy kì diệu', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgcuNhay },
    //     { id: 13, title: 'Đếm Ngày Xe Mẹ', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgDemNgayXaMe },
    //     { id: 14, title: 'Thoát Khỏi Tân Thế Giới', rating: '9.5', ageTag: 'T18', category: 'dang_chieu', image: imgThoatKhoiTanThe },
    // ];

    const filteredMovies = moviesList.filter(movie => {
        if (activeTab === 'dang_chieu') return movie.status === 'now_showing';
        if (activeTab === 'sap_chieu') return movie.status === 'coming_soon';
        if (activeTab === 'imax') return movie.status === 'imax';
        return true;
    });
    // Quyết định số lượng hiển thị: Nếu đang mở rộng thì lấy hết, nếu không thì cắt 8 cái đầu tiên
    const displayedMovies = isExpanded ? filteredMovies : filteredMovies.slice(0, 8);

    return (
        <section className="max-w-6xl mx-auto px-4 py-12">

            {/* ====== PHẦN HEADER ====== */}
            <div className="flex items-center gap-8 mb-8 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-700"></div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Phim</h2>
                </div>

                {/* CÁC TABS (Được tạo tự động từ mảng) */}
                <div className="flex items-center gap-6 font-medium text-[15px]">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative cursor-pointer transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                }`}
                        >
                            {tab.label}

                            {activeTab === tab.id && (
                                <div className="absolute -bottom-[11px] left-0 w-full h-[2px] bg-blue-600"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-blue-600 font-medium text-[15px] cursor-pointer ml-auto">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Toàn quốc
                </div>
            </div>

            {/* ====== PHẦN LƯỚI DANH SÁCH PHIM ====== */}
            <div className="grid grid-cols-4 gap-10">
                {/* Render những phim đã được lọc thay vì toàn bộ phim */}
                {displayedMovies.length > 0 ? (
                    displayedMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            imageUrl={movie.poster_url}
                            rating={movie.avg_rating}
                            ageTag={movie.age_rating}
                        />
                    ))
                ) : (
                    // Hiển thị dòng chữ này nếu lỡ tab đó không có phim nào
                    <p className="col-span-4 text-center text-gray-500 py-10">Chưa có phim nào trong mục này.</p>
                )}
            </div>
            {/* ====== KHU VỰC NÚT BẤM (XEM THÊM / THU GỌN) ====== */}
            {filteredMovies.length > 8 && (
                <div className="mt-10 flex justify-center">

                    {!isExpanded ? (
                        // NÚT XEM THÊM (Hiện khi chưa bung ra)
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 px-8 py-2.5 rounded text-[15px] flex items-center gap-2"
                        >
                            Xem thêm
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    ) : (
                        // NÚT THU GỌN (Hiện khi đã bung ra hết)
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="border border-gray-400 text-gray-500 hover:bg-gray-100 transition-colors duration-300 px-8 py-2.5 rounded text-[15px] flex items-center gap-2"
                        >
                            Thu gọn
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    )}

                </div>
            )}
        </section>
    );
}