import { Link, useNavigate } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies';

export default function MovieSidebar() {
    const navigate = useNavigate();

    const { moviesList } = useMovies('dang_chieu');

    const sidebarMovies = (moviesList || []).slice(0, 4);

    return (
        <div className="hidden lg:block col-span-12 lg:col-span-3 pt-6 lg:border-l lg:border-gray-200 lg:pl-8">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-blue-700"></div>
                <h2 className="text-lg font-bold text-gray-800 uppercase">Phim Đang Chiếu</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                {sidebarMovies.map((movie: any) => (
                    <Link
                        to={`/phim/${movie.movieId || movie.id}`}
                        key={movie.id || movie.movieId}
                        className="flex flex-col cursor-pointer group"
                    >
                        <div className="relative overflow-hidden rounded-lg mb-2">
                            <img
                                src={movie.poster_url || movie.posterUrl}
                                alt={movie.title}
                                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
                                <div className="bg-black/70 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                    <span className="text-yellow-400 text-[10px]">★</span>
                                    {movie.avg_rating || movie.averageRating}
                                </div>
                                <div className="bg-[#f26b38] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                                    {movie.age_rating || movie.ageRating}
                                </div>
                            </div>
                        </div>
                        <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {movie.title}
                        </h4>
                    </Link>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => navigate('/phim')}
                    className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 w-full py-2 rounded text-[14px] flex items-center justify-center gap-2"
                >
                    Xem thêm
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}