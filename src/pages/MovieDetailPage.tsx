import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useMovies } from '../hooks/useMovies';
import { useShowtimes } from '../hooks/useShowtimes';
import { useMemo } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import img from '../../public/movieDetail/quyduluyennguc.png';
import img1 from '../../public/movieDetail/poster.png';
import { useNavigate } from 'react-router-dom';

export default function MovieDetail() {

    const { id } = useParams();
    const { movie, isLoading } = useMovieDetail(id);
    const { moviesList } = useMovies();
    const sidebarMovies = moviesList
        .filter((movie: any) => movie.status === 'now_showing')
        .slice(0, 3);
    const navigate = useNavigate();
    const dates = useMemo(() => {
        const result = [];
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

        for (let i = 0; i < 4; i++) { 
            const d = new Date();
            d.setDate(d.getDate() + i); 
            const dayLabel = i === 0 ? 'Hôm Nay' : dayNames[d.getDay()];

            const displayDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
            const apiDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            result.push({ dayLabel, displayDate, apiDate });
        }
        return result;
    }, []);

    const [activeDate, setActiveDate] = useState(dates[0].apiDate);
    const { cinemas, isLoadingShowtimes } = useShowtimes(id, activeDate);
    

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>;
    }

    if (!movie) {
        return <div className="text-center py-20 text-xl font-bold">Không tìm thấy phim!</div>;
    }




    return (

        <div className="w-full bg-white pb-20">

            <div className="w-full bg-[#0f0f0f] h-[450px] relative flex justify-center items-center overflow-hidden">

                {/* ĐÃ SỬA LẠI CLASS CHỖ NÀY */}
                <img
                    src={movie.backdrop_url}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
                />

                {/* Các lớp phủ gradient ma thuật giữ nguyên */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-[#0f0f0f]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>

                <button className="relative z-10 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white transition-all">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-12 gap-8 relative">
                <div className="col-span-12 lg:col-span-9">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3 -mt-40 z-20 shrink-0">
                            <img src={movie.poster_url} alt={movie.title} className="w-full rounded-lg border-2 border-gray-800 shadow-2xl object-cover aspect-[2/3] bg-white" />
                        </div>
                        <div className="w-full md:w-2/3 pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
                                <span className="bg-[#f26b38] text-white text-sm font-bold px-2 py-0.5 rounded">{movie.age_rating}</span>
                            </div>

                            <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                                <span>⏱ {movie.duration}</span>
                                <span>📅 {movie.release_date}</span>
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
                                    {movie.genres?.map((genre: any, idx: any) => (
                                        <span key={idx} className="border border-gray-300 rounded px-3 py-1 text-sm">{genre.name}</span>
                                    ))}
                                </div>
                                <p><span className="text-gray-500 w-28 inline-block">Đạo diễn:</span> {movie.director?.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 w-28 inline-block shrink-0">Diễn viên:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.actors?.map((actor: any, idx: any) => (
                                            <span key={idx} className="border border-gray-300 rounded px-3 py-1 text-sm">{actor.name}</span>
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

                            <div className="flex gap-4 pb-2 md:pb-0">
                                <select className="border border-gray-300 rounded px-4 py-2 text-sm outline-none w-36 cursor-pointer focus:border-blue-500">
                                    <option>Hồ Chí Minh</option>
                                </select>
                                <select className="border border-gray-300 rounded px-4 py-2 text-sm outline-none w-36 cursor-pointer focus:border-blue-500">
                                    <option>VieCinema Galaxy</option>
                                </select>
                            </div>
                        </div>

                        {/* Render Rạp & Suất Chiếu từ API */}
                        <div className="flex flex-col gap-6">
                            {isLoadingShowtimes ? (
                                <div className="py-10 flex justify-center"><Spinner size="md" color="primary" /> Đang tải lịch chiếu...</div>
                            ) : cinemas.length > 0 ? (
                                cinemas.map((cinema: any, idx: number) => (
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
                                    <img src={movie.poster_url} alt={movie.title} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
                                        <div className="bg-black/70 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                            <span className="text-yellow-400 text-[10px]">★</span>{movie.avg_rating}
                                        </div>
                                        <div className="bg-[#f26b38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                                            {movie.age_rating}
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