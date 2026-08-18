import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMovies } from '../Hooks/useMovies';
import MovieReviews from '../components/Movie/MovieReviews';

export default function MovieFeedPage() {
    const { moviesList, isLoading} = useMovies('dang_chieu');
    const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>({});
    const [trailerMovie, setTrailerMovie] = useState<any>(null);

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
               <div className="flex items-center gap-3 md:gap-8 mb-8 border-b border-gray-200 pb-2 w-full">
                
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
                        <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Khám phá những bình luận</h2>
                    </div>
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
                            <div className="relative block mt-3 w-full bg-[#0f0f0f] overflow-hidden flex justify-center items-center group">
                                <img
                                    src={movie.bannerUrl || movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.currentTarget.src = movie.posterUrl; }}
                                />
                                <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-300"></div>
                                <Link to={`/phim/${movie.movieId}`} className="absolute inset-0 z-0 cursor-pointer"></Link>
                                <button
                                    className="absolute z-10 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white transition-all cursor-pointer opacity-90 hover:scale-110"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTrailerMovie(movie);
                                    }}
                                >
                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </button>
                            </div>

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

            {trailerMovie && trailerMovie.trailerUrl && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-[15vh] bg-black/90 p-4 lg:p-10 backdrop-blur-sm">
                    {/* Video section */}
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 animate-fade-in">
                        <button
                            onClick={() => setTrailerMovie(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-[#f26b38] text-white rounded-full flex items-center justify-center transition-colors text-xl font-bold"
                        >
                            ✕
                        </button>
                        {/* Màn hình chiếu */}
                        <iframe
                            src={trailerMovie.trailerUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title={`Trailer phim ${trailerMovie.title}`}
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