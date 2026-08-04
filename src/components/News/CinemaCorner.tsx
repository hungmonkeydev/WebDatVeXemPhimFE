import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useMovies } from '../../Hooks/useMovies';

export default function CinemaCorner() {
  const { moviesList, isLoading } = useMovies('outstanding');
  const topMovies = useMemo(() => {
    if (!moviesList || moviesList.length === 0) return [];
    const sortedMovies = [...moviesList].sort((a, b) => {
      const scoreA = a.avg_rating || a.averageRating || 0;
      const scoreB = b.avg_rating || b.averageRating || 0;
      return scoreB - scoreA;
    });
    return sortedMovies.slice(0, 4);
  }, [moviesList]);

  if (isLoading) {
    return <div>Đang tải Bảng Vàng Khán Giả...</div>;
  }

  if (topMovies.length === 0) return null;

  const mainMovie = topMovies[0];
  const subMovies = topMovies.slice(1, 4);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3 mb-8 border-b border-gray-200">

        {/* KHU VỰC TIÊU ĐỀ */}
        <div className="flex items-center gap-2 pb-1 md:pb-3 shrink-0">
          <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">
            Bảng Vàng Khán Giả
          </h2>
        </div>

        {/* KHU VỰC TABS (Thêm whitespace-nowrap để không bao giờ bị rớt chữ) */}
        <div className="md:ml-4 flex gap-5 md:gap-6 text-sm font-medium text-gray-500 whitespace-nowrap overflow-x-auto pb-1 md:pb-0">
          <span className="text-blue-600 border-b-2 border-blue-600 pb-2 md:pb-3 cursor-pointer">
            Phim xuất sắc
          </span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors pb-2 md:pb-3 border-b-2 border-transparent">
            Đánh giá mới nhất
          </span>
        </div>

      </div>

      {/* ====== BANNER FULL-WIDTH NẰM NGANG (SLIDER) ====== */}
      <Link to={`/phim/${mainMovie.movieId}`} className="block group cursor-pointer mb-8">
        <div className="relative overflow-hidden rounded-xl shadow-md aspect-[21/9] md:aspect-[3/1]">
          <img
            src={mainMovie.bannerUrl || mainMovie.posterUrl}
            alt={mainMovie.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = mainMovie.posterUrl; }}
          />
          <div className="absolute top-4 left-4 bg-[#f26b38] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            #1 THỊNH HÀNH
          </div>
          {/* Overlay gradient + nội dung đè lên banner */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 md:p-8">
            <h3 className="text-xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
              {mainMovie.title}
            </h3>
            <p className="text-gray-200 text-sm mb-3 line-clamp-2 max-w-2xl">
              {mainMovie.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-bold text-white text-sm">
                {mainMovie.averageRating?.toFixed(1)} Điểm
              </span>
              <span className="text-gray-300 text-sm">
                • {mainMovie.totalReviews?.toLocaleString() || "0"} lượt đánh giá
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ====== 3 PHIM PHỤ XẾP HÀNG NGANG BÊN DƯỚI ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {subMovies.map((movie) => (
          <Link
            to={`/phim/${movie.movieId}`}
            key={movie.movieId}
            className="group flex gap-3 items-start cursor-pointer"
          >
            <div className="w-20 md:w-24 shrink-0 overflow-hidden rounded-lg shadow-sm aspect-[2/3]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-1 pt-1 min-w-0">
              <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                {movie.title}
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="font-bold text-gray-800 text-xs">{movie.averageRating?.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">• {(movie.totalReviews || 0).toLocaleString()} đánh giá</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 px-8 py-2.5 rounded font-medium text-sm flex items-center justify-center gap-2">
          Xem tất cả đánh giá
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}