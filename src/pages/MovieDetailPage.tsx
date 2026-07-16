import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useMovieDetail } from '../Hooks/useMovieDetail';
import { useMovies } from '../Hooks/useMovies';
import { useShowtimes } from '../Hooks/useShowtimes';
import Spinner from '../components/UI/Spinner';
import MovieReviews from '../components/Movie/MovieReviews';
import MovieSidebar from '../components/Movie/MovieSidebar'; // Trigger HMR
export default function MovieDetail() {

    const { id } = useParams();
    const { movie, isLoading, error } = useMovieDetail(id);
    const { moviesList } = useMovies('dang_chieu');
    const sidebarMovies = (moviesList || []).slice(0, 3);
    console.log(sidebarMovies)

    const navigate = useNavigate();
    const dates = useMemo(() => {
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

        return Array.from({ length: 4 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dayLabel = i === 0 ? 'Hôm Nay' : dayNames[d.getDay()];
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return {
                dayLabel,
                displayDate: `${day}/${month}`,
                apiDate: `${year}-${month}-${day}` // Chuẩn format YYYY-MM-DD
            };
        });
    }, []);

    const [activeDate, setActiveDate] = useState(dates[0].apiDate);
    const { cinemas, isLoadingShowtimes } = useShowtimes(id, activeDate);
    const safeCinemas = cinemas || [];
    const [showTrailler, setShowTrailler] = useState<boolean>(false);
    const [selectedCity, setSelectedCity] = useState('Tất cả');
    const [selectedCinema, setSelectedCinema] = useState('Tất cả');
    const uniqueCities = Array.from(new Set(safeCinemas.filter(c => c.city).map(c => c.city)));
    const filteredCinemas = safeCinemas.filter(cinema => {
        const matchCity = selectedCity === 'Tất cả' || cinema.city === selectedCity;
        const matchCinema = selectedCinema === 'Tất cả' || cinema.name === selectedCinema;
        return matchCity && matchCinema;
    });
    const availableCinemasForDropdown = safeCinemas.filter(cinema =>
        selectedCity === 'Tất cả' || cinema.city === selectedCity
    );

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>;
    }

    if (!movie) {
        return <div className="text-center py-20 text-xl font-bold">Không tìm thấy phim!</div>;
    }

    return (

        <div className="w-full bg-white pb-20">

            <div className="w-full bg-[#0f0f0f] h-[300px] md:h-[600px] relative flex justify-center items-center overflow-hidden">                <img
                src={movie.bannerUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-100"
            />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0f0f0f_80%)] opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>
                <button
                    className="relative z-10 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white transition-allcursor-pointer"
                    onClick={() => setShowTrailler(true)}
                >
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-12 gap-8 relative">
                <div className="col-span-12 lg:col-span-9">

                    <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] md:grid-cols-12 gap-x-4 gap-y-4 md:gap-8">

                        {/* 1. POSTER */}
                        <div className="col-span-1 md:col-span-4 md:row-span-2 -mt-10 md:-mt-40 z-20 shrink-0">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full rounded-lg border border-gray-200 md:border-gray-800 shadow-xl object-cover aspect-[2/3] bg-white"
                            />
                        </div>

                        {/* 2. THÔNG TIN CƠ BẢN */}
                        <div className="col-span-1 md:col-start-5 md:col-span-8 pt-2 md:pt-6">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                                <h1 className="text-xl md:text-3xl font-bold text-gray-800 leading-tight">{movie.title}</h1>
                                <span className="bg-[#f26b38] text-white text-[10px] md:text-sm font-bold px-2 py-0.5 rounded">{movie.ageRating}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-500 text-[12px] md:text-sm mb-2 md:mb-4">
                                <span>⏱ {movie.duration} Phút</span>
                                <span>📅 {movie.releaseDate}</span>
                            </div>

                            <div className="flex items-center gap-1 md:gap-2">
                                <span className="text-yellow-500 text-base md:text-xl">★</span>
                                <span className="font-bold text-sm md:text-lg">{movie.averageRating}</span>
                                <span className="text-gray-400 text-[12px] md:text-sm">({movie.totalReviews} đánh giá)</span>
                            </div>
                        </div>

                        {/* 3. THÔNG TIN CHI TIẾT*/}
                        <div className="col-span-2 md:col-start-5 md:col-span-8 flex flex-col gap-3 md:gap-4 text-[13px] md:text-[15px] text-gray-700 mt-2 md:mt-0">
                            <div className="flex gap-2 md:gap-4">
                                <span className="text-gray-500 w-20 md:w-28 shrink-0">Nhà sản xuất:</span>
                                <span className="font-medium">{movie.producer || 'Đang cập nhật'}</span>
                            </div>

                            <div className="flex gap-2 md:gap-4">
                                <span className="text-gray-500 w-20 md:w-28 shrink-0 pt-0.5">Thể loại:</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map((genre: any, idx: any) => (
                                        <span key={idx} className="border border-gray-200 rounded px-2 md:px-3 py-0.5 md:py-1 text-[11px] md:text-sm">{genre.name}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 md:gap-4">
                                <span className="text-gray-500 w-20 md:w-28 shrink-0 pt-0.5">Đạo diễn:</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.directors?.map((d: any, idx: any) => (
                                        <span key={idx} className="border border-gray-200 rounded px-2 md:px-3 py-0.5 md:py-1 text-[11px] md:text-sm font-medium hover:text-[#f26b38] cursor-pointer transition-colors">{d.name}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 md:gap-4">
                                <span className="text-gray-500 w-20 md:w-28 shrink-0 pt-0.5">Diễn viên:</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.actors?.map((actor: any, idx: any) => (
                                        <span key={idx} className="border border-gray-200 rounded px-2 md:px-3 py-0.5 md:py-1 text-[11px] md:text-sm font-medium hover:text-[#f26b38] cursor-pointer transition-colors">{actor.name}</span>
                                    ))}
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
                                        key={item.apiDate}
                                        onClick={() => setActiveDate(item.apiDate)}
                                        className={`flex flex-col items-center justify-center w-24 py-3 cursor-pointer transition-colors rounded-lg ${activeDate === item.apiDate ? 'bg-blue-700 text-white font-semibold' : 'text-gray-600 hover:text-blue-700'
                                            }`}
                                    >
                                        <span className="text-sm">{item.dayLabel}</span>
                                        <span className="text-sm">{item.displayDate}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pb-2 md:pb-0 w-full md:w-auto">
                                {/* Select Hồ Chí Minh */}
                                <div className="relative flex-1 md:w-40">
                                    <select
                                        value={selectedCity}
                                        onChange={
                                            (e) => {
                                                setSelectedCity(e.target.value);
                                                setSelectedCinema('Tất cả');
                                            }

                                        }
                                        className="appearance-none border border-gray-300 rounded w-full px-4 py-2 text-sm outline-none cursor-pointer focus:border-[#f26b38] bg-white">
                                        <option value="Tất cả">Toàn quốc</option>
                                        {uniqueCities.map((city: any, idx: number) => (
                                            <option key={idx} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {/* Select Rạp */}
                                <div className="relative flex-1 md:w-48">
                                    <select
                                        value={selectedCinema}
                                        onChange={(e) => setSelectedCinema(e.target.value)}
                                        className="appearance-none border border-gray-300 rounded w-full px-4 py-2 text-sm outline-none cursor-pointer focus:border-[#f26b38] bg-white">
                                        <option value="Tất cả">Tất cả</option>
                                        {availableCinemasForDropdown.map((c: any, idx: number) => (
                                            <option key={idx} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Render Rạp & Suất Chiếu từ API */}
                        <div className="flex flex-col gap-6">
                            {isLoadingShowtimes ? (
                                <div className="py-10 flex justify-center"><Spinner size="md" color="primary" /> Đang tải lịch chiếu...</div>
                            ) : filteredCinemas.length > 0 ? (
                                filteredCinemas.map((cinema: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">{cinema.name}</h3>

                                        {cinema.formats?.map((format: any, fIdx: number) => (
                                            <div key={fIdx} className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                                <span className="text-sm font-semibold text-gray-700 w-48 shrink-0">{format.type}</span>
                                                <div className="flex flex-wrap gap-3">
                                                    {format.times?.map((timeobj: any, tIdx: number) => (
                                                        <button
                                                            key={tIdx}
                                                            onClick={() => navigate(`/dat-ve/${timeobj.showtimeId}/chon-ghe`)}
                                                            className="border border-gray-300 bg-white text-gray-700 font-medium py-1.5 px-4 rounded hover:border-[#f26b38] hover:text-[#f26b38] transition-colors"
                                                        >
                                                            {timeobj.time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-6 border border-dashed border-gray-300 rounded-lg">Không có suất chiếu nào cho ngày này.</div>
                            )}
                        </div>
                    </div>
                    <div className="mt-10">
                        <MovieReviews
                            movieId={movie?.movieId}
                            movieTitle={movie?.movieName}
                        />
                    </div>
                </div>

                {/* ================= CỘT PHẢI (3 PHẦN): SIDEBAR ================= */}
                <MovieSidebar />
            </div>
            {showTrailler && movie.trailerUrl && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-[15vh] bg-black/90 p-4 lg:p-10 backdrop-blur-sm">                    {/* Video section */}
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 animate-fade-in">

                        <button
                            onClick={() => setShowTrailler(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-[#f26b38] text-white rounded-full flex items-center justify-center transition-colors text-xl font-bold"
                        >
                            ✕
                        </button>

                        {/* Màn hình chiếu */}
                        <iframe
                            src={movie.trailerUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title={`Trailer phim ${movie.title}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}