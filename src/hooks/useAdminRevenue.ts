import { useState, useEffect, useCallback } from 'react';
import { RevenueService } from '../services/adminRevenueService';
import { message } from 'antd';
import dayjs from 'dayjs';

export const useAdminRevenue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [periodData, setPeriodData] = useState<any[]>([]);
  const [movieData, setMovieData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);

  const fetchRevenueData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Lùi 30 ngày để lấy data 30 ngày qua
      const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
      const endDate = dayjs().format('YYYY-MM-DD');

      const filterParams = {
        from: startDate,
        to: endDate,
        effectiveFrom: startDate,
        effectiveTo: endDate,
        groupBy: "DAY", 
        topN: 10 
      };

      // 2. Gọi API
      const [overview, period, movie, payment] = await Promise.all([
        RevenueService.getOverview(filterParams),
        RevenueService.getByPeriod(filterParams),
        RevenueService.getByMovie(filterParams),
        RevenueService.getByPaymentMethod(filterParams)
      ]);
      console.log(overview.data);
      console.log(period.data);
      console.log(movie.data);
      console.log(payment.data);

      // 3. CHỖ QUAN TRỌNG NHẤT: Bóc đúng cái mảng bên trong ra để biểu đồ đếm được length
      setOverviewData(overview.data || overview);
      setPeriodData(period.data?.stats || []);      // Lấy mảng stats
      setMovieData(movie.data?.movies || []);       // Lấy mảng movies
      setPaymentData(payment.data?.methods || payment.data || []); 
      
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu doanh thu:', error);
      message.error('Không thể tải dữ liệu thống kê doanh thu!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  return {
    isLoading, overviewData, periodData, movieData, paymentData, refetch: fetchRevenueData
  };
};