import { useNavigate } from 'react-router-dom';
import BookingSelect from './BookingSelect';
import { useQuickBooking } from '../../../../hooks/useQuickBooking'; // Chỉnh lại đường dẫn cho đúng nha

export default function BookingBar() {
  const navigate = useNavigate();
  
  // Lôi toàn bộ data và hàm xử lý từ Hook ra
  const {
    movies, cinemas, dates, times, isLoading,
    setSelectedMovieId, setSelectedCinemaId, setSelectedDate, setSelectedShowtimeId,
    selectedMovieId, selectedCinemaId, selectedDate, selectedShowtimeId
  } = useQuickBooking();

  // Hàm xử lý khi bấm nút "Mua vé"
  const handleBuyTicket = () => {
    if (selectedShowtimeId) {
      navigate(`/dat-ve/${selectedShowtimeId}/chon-ghe`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full h-[55px] md:h-[68px] flex overflow-hidden border border-gray-100">
      
      <div className="flex-1 flex overflow-x-auto scrollbar-hide">
        <div className="flex items-center h-full w-max md:w-full">
          
          {/* Ô 1: Chọn Phim */}
          <div className="relative md:flex-1 h-full">
            <select
              value={selectedMovieId || ''}
              onChange={(e) => setSelectedMovieId(Number(e.target.value) || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value="" disabled hidden>Chọn Phim</option>
              {movies?.map((m: any) => (
                <option key={m.movieId} value={m.movieId}>
                  {m.title}
                </option>
              ))}
            </select>
            <BookingSelect 
              stepNumber={1} 
              placeholder={movies?.find((m: any) => m.movieId === selectedMovieId)?.title || "Chọn Phim"} 
            />
          </div>

          {/* Ô 2: Chọn Rạp */}
          <div className={`relative md:flex-1 h-full ${(!selectedMovieId || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <select
              value={selectedCinemaId || ''}
              onChange={(e) => setSelectedCinemaId(Number(e.target.value) || null)}
              disabled={!selectedMovieId || isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            >
              <option value="" disabled hidden>Chọn Rạp</option>
              {cinemas?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <BookingSelect 
              stepNumber={2} 
              placeholder={isLoading ? "Đang tải..." : (cinemas?.find((c: any) => c.id === selectedCinemaId)?.name || "Chọn Rạp")} 
            />
          </div>

          {/* Ô 3: Chọn Ngày */}
          <div className={`relative md:flex-1 h-full ${!selectedCinemaId ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <select
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={!selectedCinemaId}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            >
              <option value="" disabled hidden>Chọn Ngày</option>
              {dates?.map((d: string) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <BookingSelect 
              stepNumber={3} 
              placeholder={selectedDate || "Chọn Ngày"} 
            />
          </div>

          {/* Ô 4: Chọn Suất */}
          <div className={`relative md:flex-1 h-full ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <select
              value={selectedShowtimeId || ''}
              onChange={(e) => setSelectedShowtimeId(Number(e.target.value) || null)}
              disabled={!selectedDate}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            >
              <option value="" disabled hidden>Chọn Suất</option>
              {times?.map((t: any) => (
                <option key={t.showtimeId} value={t.showtimeId}>
                  {t.timeLabel}
                </option>
              ))}
            </select>
            <BookingSelect 
              stepNumber={4} 
              placeholder={times?.find((t: any) => t.showtimeId === selectedShowtimeId)?.timeLabel || "Chọn Suất"} 
            />
          </div>

        </div>
      </div>

      <button 
        onClick={handleBuyTicket}
        disabled={!selectedShowtimeId}
        className="h-full bg-[#f26b38] hover:bg-[#d95c2b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors px-4 md:px-10 text-white font-semibold text-[13px] md:text-[15px] shrink-0 shadow-[-8px_0_12px_rgba(0,0,0,0.05)] relative z-10"
      >
        Mua vé
      </button>

    </div>
  );
}