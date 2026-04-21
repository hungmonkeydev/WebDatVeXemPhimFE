    // src/pages/MovieDetail.tsx
    import { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import img from '../../public/movieDetail/quyduluyennguc.png';
    import img1 from '../../public/movieDetail/poster.png';
    import { useNavigate } from 'react-router-dom';
    export default function MovieDetail() {

        const { id } = useParams();
        const [activeDate, setActiveDate] = useState('13/04');
        const navigate = useNavigate();
        useEffect(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Thêm 'smooth' nếu muốn cuộn lên từ từ, hoặc xóa dòng này đi nếu muốn cuộn lên ngay lập tức
            });
        }, [id]);
        const movie = {
            title: 'Quỷ Dữ Từ Luyện Ngục',
            backdrop: img1,
            poster: img,
            ageTag: 'T18',
            duration: '101 Phút',
            date: '10/04/2026',
            rating: '8.6',
            country: 'Thái Lan',
            genres: ['Kinh Dị', 'Giật Gân'],
            director: 'Ekkachai Srivichai',
            actors: ['Sai Charoenpura', 'Apinya Sakuljaroensuk', 'Gun Napat Injaieua'],
            description: `Kingkaew lấy cảm hứng từ vụ án có thật năm 1978, tại nhà tù Bang Kwang khét tiếng. Một người phụ nữ mắc bệnh tâm thần bị buộc tội bắt cóc và sát hại trẻ em gây chấn động. Dù chứng cứ dồn dập, cô vẫn khẳng định "Tôi vô tội". Cuối cùng, tòa tuyên án tử hình, Kingkaew chết trong oán hận tột cùng.\n\nSau cái chết, hàng loạt hiện tượng kinh hoàng bắt đầu xảy ra. Oan hồn Kingkaew quay lại, gieo rắc nỗi ám ảnh lên tất cả những người liên quan. Khi nỗi sợ dâng cao, họ buộc phải đối mặt với sự thật đen tối phía sau vụ án... và thứ tà ác vẫn chưa chịu ngủ yên.`,
        };

        const dates = [
            { day: 'Hôm Nay', date: '13/04' },
            { day: 'Thứ Ba', date: '14/04' },
            { day: 'Thứ Tư', date: '15/04' },
            { day: 'Thứ Năm', date: '16/04' },
        ];

        const cinemas = [
            {
                name: 'VieCinema - Hanoi Centre',
                formats: [{ type: 'VIP - AQUALIS 2D Phụ Đề', times: ['22:20'] }]
            },
            {
                name: 'VieCinema Nguyễn Du',
                formats: [{ type: '2D Phụ Đề', times: ['23:00'] }]
            },
            {
                name: 'VieCinema Sala',
                formats: [{ type: 'VIP - LAGOM 2D Phụ Đề', times: ['14:30', '22:30'] }]
            },
            {
                name: 'VieCinema Tân Bình',
                formats: [{ type: '2D Phụ Đề', times: ['22:15'] }]
            }
        ];

        const sidebarMovies = [
            { id: 2, title: "BTS World Tour 'Arirang' In Tokyo", image: img, rating: '9.2', ageTag: 'T13' },
            { id: 3, title: 'Quỷ Dữ Từ Luyện Ngục', image: img, rating: '8.6', ageTag: 'T18' },
            { id: 4, title: 'Sirat: Chuyến Đi Bão Cát', image: img, rating: '8.4', ageTag: 'T18' },
        ];

        return (

            <div className="w-full bg-white pb-20">

                {/* ====== 1. PHẦN BACKDROP ĐÃ ĐƯỢC NÂNG CẤP ====== */}
                <div className="w-full bg-[#0f0f0f] h-[450px] relative flex justify-center items-center overflow-hidden">

                    {/* Tấm ảnh gốc (Giữ nguyên) */}
                    <img src={movie.backdrop} alt="Backdrop" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[1px]" />

                    {/* --- MA THUẬT NẰM Ở ĐÂY --- */}
                    {/* Dải gradient làm đen 2 bên mép (Trái sang Phải) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-[#0f0f0f]"></div>

                    {/* Dải gradient làm đen từ dưới lên (Giúp phần giao với nền trắng mượt hơn) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>

                    {/* Nút Play (Giữ nguyên) */}
                    <button className="relative z-10 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white transition-all">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                </div>

                {/* ====== 2. KHUNG LƯỚI CHÍNH (Giữ nguyên không thay đổi) ====== */}
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-12 gap-8 relative">
                    <div className="col-span-12 lg:col-span-9">
                        {/* A. THÔNG TIN PHIM CƠ BẢN */}
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 -mt-40 z-20 shrink-0">
                                <img src={movie.poster} alt={movie.title} className="w-full rounded-lg border-2 border-gray-800 shadow-2xl object-cover aspect-[2/3] bg-white" />
                            </div>

                            <div className="w-full md:w-2/3 pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
                                    <span className="bg-[#f26b38] text-white text-sm font-bold px-2 py-0.5 rounded">{movie.ageTag}</span>
                                </div>

                                <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                                    <span>⏱ {movie.duration}</span>
                                    <span>📅 {movie.date}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-yellow-500 text-xl">★</span>
                                    <span className="font-bold text-lg">{movie.rating}</span>
                                    <span className="text-gray-400 text-sm">(19 votes)</span>
                                </div>

                                <div className="flex flex-col gap-4 text-[15px] text-gray-700">
                                    <p><span className="text-gray-500 w-28 inline-block">Quốc gia:</span> {movie.country}</p>
                                    <p><span className="text-gray-500 w-28 inline-block">Nhà sản xuất:</span> Đang cập nhật</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 w-28 inline-block">Thể loại:</span>
                                        {movie.genres.map((genre, idx) => (
                                            <span key={idx} className="border border-gray-300 rounded px-3 py-1 text-sm">{genre}</span>
                                        ))}
                                    </div>
                                    <p><span className="text-gray-500 w-28 inline-block">Đạo diễn:</span> {movie.director}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 w-28 inline-block shrink-0">Diễn viên:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.actors.map((actor, idx) => (
                                                <span key={idx} className="border border-gray-300 rounded px-3 py-1 text-sm">{actor}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* B. NỘI DUNG PHIM */}
                        <div className="mt-12">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 bg-blue-700"></div>
                                <h2 className="text-lg font-bold text-gray-800 uppercase">Nội Dung Phim</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-[15px] whitespace-pre-line text-justify">
                                {movie.description}
                            </p>
                        </div>

                        {/* C. LỊCH CHIẾU */}
                        <div className="mt-12">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-5 bg-blue-700"></div>
                                <h2 className="text-lg font-bold text-gray-800 uppercase">Lịch Chiếu</h2>
                            </div>
                            {/* Nút chọn ngày */}
                            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 mb-8 gap-4">
                                <div className="flex">
                                    {dates.map((item) => (
                                        <div
                                            key={item.date}
                                            onClick={() => setActiveDate(item.date)}
                                            className={`flex flex-col items-center justify-center w-24 py-3 cursor-pointer transition-colors rounded-lg ${activeDate === item.date ? 'bg-blue-700 text-white font-semibold' : 'text-gray-600 hover:text-blue-700'
                                                }`}
                                        >
                                            <span className="text-sm">{item.day}</span>
                                            <span className="text-sm">{item.date}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pb-2 md:pb-0">
                                    <select className="border border-gray-300 rounded px-4 py-2 text-sm outline-none w-36 cursor-pointer focus:border-blue-500">
                                        <option>Toàn quốc</option>
                                        <option>Hồ Chí Minh</option>
                                        <option>Hà Nội</option>
                                    </select>
                                    <select className="border border-gray-300 rounded px-4 py-2 text-sm outline-none w-36 cursor-pointer focus:border-blue-500">
                                        <option>Tất cả rạp</option>
                                        <option>VieCinema Sala</option>
                                        <option>VieCinema Nguyễn Du</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {cinemas.map((cinema, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">{cinema.name}</h3>

                                        {cinema.formats.map((format, fIdx) => (
                                            <div key={fIdx} className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                                <span className="text-sm font-semibold text-gray-700 w-48 shrink-0">{format.type}</span>
                                                <div className="flex flex-wrap gap-3">
                                                    {format.times.map((time, tIdx) => (
                                                        <button
                                                            key={tIdx}
                                                            onClick={() => navigate(`/dat-ve/${id}/chon-ghe`)}
                                                            className="border border-gray-300 bg-white text-gray-700 font-medium py-1.5 px-4 rounded hover:border-[#f26b38] hover:text-[#f26b38] transition-colors"
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI (3 PHẦN): SIDEBAR ================= */}
                    <div className="col-span-12 lg:col-span-3 pt-6 lg:border-l lg:border-gray-200 lg:pl-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-5 bg-blue-700"></div>
                            <h2 className="text-lg font-bold text-gray-800 uppercase">Phim Đang Chiếu</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            {sidebarMovies.map((movie) => (
                                <div key={movie.id} className="flex flex-col cursor-pointer group">
                                    <div className="relative overflow-hidden rounded-lg mb-2">
                                        <img src={movie.image} alt={movie.title} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
                                            <div className="bg-black/70 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                                <span className="text-yellow-400 text-[10px]">★</span>{movie.rating}
                                            </div>
                                            <div className="bg-[#f26b38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                                                {movie.ageTag}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {movie.title}
                                    </h4>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 w-full py-2 rounded text-[14px] flex items-center justify-center gap-2">
                                Xem thêm
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }