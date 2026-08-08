import { Link, useParams } from 'react-router-dom';
import { useMovies } from '../../Hooks/useMovies';

export default function MovieMegaMenu() {
  const { moviesList: nowShowing } = useMovies('dang_chieu');
  const { moviesList: comingSoon } = useMovies('sap_chieu');


  return (
    <div className="absolute top-full left-0 w-[800px] bg-white shadow-2xl rounded-b-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] border-t-2 border-[#f26b38] flex flex-col gap-8">

      {/* PHẦN ĐANG CHIẾU */}
      <div>
        <div className="flex items-center gap-2 shrink-0 mb-3">
          <Link to="/movies/now-showing" className="flex items-center gap-2 shrink-0 mb-3 group/heading w-max cursor-pointer">
            <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
            <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide group-hover/heading:text-[#f26b38] transition-colors">
              Phim Đang Chiếu
            </h2>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(nowShowing || []).slice(0, 4).map((movie: any) => (
            <Link key={movie.movieId} to={`/phim/${movie.movieId}`} className="block group">
              <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow group-hover:scale-105 transition-transform" alt={movie.title} />
              <p className="text-black text-sm font-semibold mt-2 line-clamp-1">
                {movie.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* PHẦN SẮP CHIẾU */}
      <div>
        <div className="flex items-center gap-2 shrink-0 mb-3">
          <Link to="/movies/coming-soon" className="flex items-center gap-2 shrink-0 mb-3 group/heading w-max cursor-pointer">
            <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
            <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide group-hover/heading:text-[#f26b38] transition-colors">
              Phim Sắp Chiếu
            </h2>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(comingSoon || []).slice(0, 4).map((movie: any) => (
            <Link key={movie.movieId} to={`/phim/${movie.movieId}`} className="block group">
              <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow group-hover:scale-105 transition-transform" alt={movie.title} />
              <p className="text-black text-sm font-semibold mt-2 line-clamp-1">
                {movie.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}