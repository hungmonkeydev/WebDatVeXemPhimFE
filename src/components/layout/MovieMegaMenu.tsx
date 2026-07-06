import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies'; 

export default function MovieMegaMenu() {
  const { moviesList: nowShowing } = useMovies('dang_chieu');
  const { moviesList: comingSoon } = useMovies('sap_chieu');

  return (
    <div className="absolute top-full left-0 w-[800px] bg-white shadow-2xl rounded-b-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] border-t-2 border-[#f26b38] flex flex-col gap-8">

      {/* PHẦN ĐANG CHIẾU */}
      <div>
        <h3 className="font-bold text-gray-800 uppercase mb-4 border-b pb-2">Phim Đang Chiếu</h3>
        <div className="grid grid-cols-4 gap-4">
          {(nowShowing || []).slice(0, 4).map((movie: any) => (
            <Link key={movie.movieId} to={`/movie/${movie.movieId}`} className="block group">
              <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow group-hover:scale-105 transition-transform" alt={movie.title} />
              <p className="text-sm font-semibold mt-2 line-clamp-1 group-hover:text-[#f26b38] transition-colors">{movie.title}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* PHẦN SẮP CHIẾU */}
      <div>
        <h3 className="font-bold text-gray-800 uppercase mb-4 border-b pb-2">Phim Sắp Chiếu</h3>
        <div className="grid grid-cols-4 gap-4">
          {(comingSoon || []).slice(0, 4).map((movie: any) => (
            <Link key={movie.movieId} to={`/movie/${movie.movieId}`} className="block group">
              <img src={movie.posterUrl} className="w-full aspect-[2/3] object-cover rounded shadow group-hover:scale-105 transition-transform" alt={movie.title} />
              <p className="text-sm font-semibold mt-2 line-clamp-1 group-hover:text-[#f26b38] transition-colors">{movie.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}