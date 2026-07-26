import { useState, useEffect, useMemo } from 'react';
import { useMovies } from './useMovies'; 
import { showtimeService } from '../services/showtimeService';

export function useQuickBooking() {
  const { moviesList: movies } = useMovies('dang_chieu');

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);

  const [apiData, setApiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setSelectedCinemaId(null);
    setSelectedDate('');
    setSelectedShowtimeId(null);
  }, [selectedMovieId]);
  useEffect(() => {
    setSelectedDate('');
    setSelectedShowtimeId(null);
  }, [selectedCinemaId]);

  useEffect(() => {
    setSelectedShowtimeId(null);
  }, [selectedDate]);


  const cinemas = useMemo(() => {
    return apiData.map((c: any) => ({
      id: c.cinemaId,
      name: c.cinemaName,
    }));
  }, [apiData]);

  const dates = useMemo(() => {
    const currentCinema = apiData.find((c: any) => c.cinemaId === selectedCinemaId);
    if (!currentCinema) return [];

    const rawDates = currentCinema.showtimes.map((s: any) => s.startTime.split(' ')[0]);
    return [...new Set(rawDates)] as string[];
  }, [apiData, selectedCinemaId]);

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