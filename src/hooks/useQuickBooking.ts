import { useState, useEffect, useMemo } from 'react';
import { useMovies } from './useMovies'; 
import { showtimeService } from '../services/showtimeService';

export function useQuickBooking() {
  // Lấy danh sách phim đang chiếu để đổ vào Ô 1
  const { moviesList: movies } = useMovies('dang_chieu');

  // Các State lưu trữ lựa chọn của người dùng (Lưu ID/Value để lọc)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);

  // State lưu cục data trả về từ API của bộ phim đang chọn
  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Effect: Khi người dùng chọn phim (Ô 1) -> Lập tức gọi API lấy toàn bộ lịch chiếu
  useEffect(() => {
    if (!selectedMovieId) {
      setApiData([]);
      setSelectedCinemaId(null);
      setSelectedDate('');
      setSelectedShowtimeId(null);
      return;
    }

    const fetchShowtimes = async () => {
      setIsLoading(true);
      try {
        const res = await showtimeService.getShowtimesByMovie(selectedMovieId);
        if (res?.status === 'success') {
          setApiData(res.data || []);
        }
      } catch (err) {
        console.error('Lỗi lấy lịch chiếu nhanh:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowtimes();
    // Reset các lựa chọn rạp/ngày/suất cũ khi chọn phim mới
    setSelectedCinemaId(null);
    setSelectedDate('');
    setSelectedShowtimeId(null);
  }, [selectedMovieId]);

  // Reset suất chiếu nếu người dùng đổi rạp hoặc đổi ngày
  useEffect(() => {
    setSelectedDate('');
    setSelectedShowtimeId(null);
  }, [selectedCinemaId]);

  useEffect(() => {
    setSelectedShowtimeId(null);
  }, [selectedDate]);


  // Danh sách Rạp (Ô 2)
  const cinemas = useMemo(() => {
    return apiData.map((c: any) => ({
      id: c.cinemaId,
      name: c.cinemaName,
    }));
  }, [apiData]);

  // Danh sách Ngày chiếu (Ô 3): Tìm rạp đang chọn -> Duyệt showtimes để lấy ngày
  const dates = useMemo(() => {
    const currentCinema = apiData.find((c: any) => c.cinemaId === selectedCinemaId);
    if (!currentCinema) return [];

    // Cắt chuỗi lấy phần ngày 'YYYY-MM-DD' và lọc trùng bằng Set
    const rawDates = currentCinema.showtimes.map((s: any) => s.startTime.split(' ')[0]);
    return [...new Set(rawDates)] as string[];
  }, [apiData, selectedCinemaId]);

  // Danh sách Giờ chiếu (Ô 4): Lọc các suất chiếu khớp với Rạp + Ngày đã chọn
  const times = useMemo(() => {
    const currentCinema = apiData.find((c: any) => c.cinemaId === selectedCinemaId);
    if (!currentCinema || !selectedDate) return [];

    return currentCinema.showtimes
      .filter((s: any) => s.startTime.startsWith(selectedDate))
      .map((s: any) => ({
        showtimeId: s.showtimeId,
        timeLabel: s.startTime.split(' ')[1].slice(0, 5),
      }));
  }, [apiData, selectedCinemaId, selectedDate]);

  return {
    movies,
    cinemas,
    dates,
    times,
    isLoading,
    setSelectedMovieId,
    setSelectedCinemaId,
    setSelectedDate,
    setSelectedShowtimeId,
    selectedMovieId,
    selectedCinemaId,
    selectedDate,
    selectedShowtimeId,
  };
}