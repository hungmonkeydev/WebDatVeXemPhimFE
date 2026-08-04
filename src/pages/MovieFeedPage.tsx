import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMovies } from '../Hooks/useMovies';
import MovieReviews from '../components/Movie/MovieReviews';

export default function MovieFeedPage() {
    const { moviesList, isLoading } = useMovies('dang_chieu');

    const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

    const toggleComments = (movieId: number) => {
        setOpenComments(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5]">
                <p className="text-gray-500 text-lg font-medium animate-pulse">Đang tải bảng tin...</p>
            </div>
        );
    }

    if (!moviesList || moviesList.length === 0) {
        return <div className="text-center py-20 text-gray-500">Chưa có thông tin phim.</div>;
    }

    return (
        <div className="bg-[#f0f2f5] min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">

                {/* TIÊU ĐỀ TRANG */}
                <div className="mb-6 border-b border-gray-300 pb-3">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
                        Khám Phá Phim
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật những bộ phim hot nhất tại rạp</p>
                </div>

                {/* DANH SÁCH BÀI ĐĂNG */}
                <div className="flex flex-col gap-6">
                    {moviesList.map((movie) => (
                        <div key={movie.movieId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                            {/* HEADER POST: THÔNG TIN PHIM */}
                            <div className="p-4 pb-2 flex justify-between items-start">
                                <div>
                                    <Link to={`/phim/${movie.movieId}`} className="font-bold text-[18px] text-blue-700 hover:underline leading-tight block">
                                        {movie.title}
                                    </Link>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="flex text-yellow-400 text-[15px]">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i}>{i < Math.round(movie.averageRating || 0) ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700 ml-1">
                                            {movie.averageRating?.toFixed(1)}/5
                                        </span>
                                        <span className="text-[12px] text-gray-400">
                                            • {(movie.totalReviews || 0).toLocaleString()} đánh giá
                                        </span>
                                    </div>
                                </div>

                                {movie.ageRating && (
                                    <span className="bg-orange-100 text-[#f26b38] px-2.5 py-1 rounded font-bold text-xs">
                                        {movie.ageRating}
                                    </span>
                                )}
                            </div>

                            {/* NỘI DUNG POST: MÔ TẢ PHIM */}
                            <div className="px-4 py-2 text-[15px] text-gray-800 whitespace-pre-line leading-relaxed">
                                {movie.description ? movie.description : 'Đang cập nhật nội dung phim...'}
                            </div>

                            {/* MEDIA: BANNER HOẶC POSTER PHIM */}
                            <Link to={`/phim/${movie.movieId}`} className="block mt-3 w-full bg-[#0f0f0f] overflow-hidden">

                                {/* 🚨 Thêm h-auto vào đây, trả object-cover lại để hình hiển thị tự nhiên nhất */}
                                <img
                                    src={movie.bannerUrl || movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.currentTarget.src = movie.posterUrl; }}
                                />

                            </Link>

                            {/* NÚT TƯƠNG TÁC */}
                            <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between bg-white">

                                {/* 🚨 ĐỔI NÚT CHIA SẺ THÀNH BÌNH LUẬN Ở ĐÂY */}
                                <button
                                    onClick={() => toggleComments(movie.movieId)}
                                    className={`flex items-center gap-2 transition-colors text-sm font-bold ${openComments[movie.movieId] ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    Bình luận
                                </button>

                                <Link to={`/phim/${movie.movieId}`} className="bg-[#f26b38] text-white px-5 py-2 rounded shadow-sm font-semibold text-[13px] uppercase tracking-wide hover:bg-orange-600 transition-colors">
                                    Xem chi tiết & Đặt vé
                                </Link>
                            </div>

                            {/* 🚨 KHU VỰC HIỂN THỊ COMPONENT MOVIE REVIEWS CỦA PRO */}
                            {openComments[movie.movieId] && (
                                <div className="p-4 border-t border-gray-200 bg-gray-50 animate-[fadeIn_0.2s_ease-out]">
                                    {/* Nhúng "con cưng" của pro vào đây */}
                                    <MovieReviews
                                        movieId={movie.movieId}
                                        movieTitle={movie.title}
                                    />
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}