import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useMovies } from '../../Hooks/useMovies';

export default function BannerSlider() {
  const { moviesList, isLoading } = useMovies('outstanding');

  const banners = useMemo(() => {
    if (!moviesList || moviesList.length === 0) return [];
    return moviesList.filter((m: any) => m.bannerUrl);
  }, [moviesList]);

  if (isLoading) {
    return (
      <div className="w-full mt-10 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="w-full mt-10 bg-white overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 1, spaceBetween: 0 },
          1024: { slidesPerView: 1.2, spaceBetween: 40 }
        }}
        centeredSlides={true}
        loop={banners.length > 1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={false}
        autoHeight={true}

        className="w-full pb-10"
      >
        {banners.map((movie: any) => (
          <SwiperSlide key={movie.movieId} className="w-full">
            <Link to={`/phim/${movie.movieId}`} className="block w-full">

              {/* BỎ aspect-[2/1] ở mobile đi, chỉ giữ lại sm:aspect-[3/1] cho Desktop */}
              <div className="w-full sm:aspect-[3/1] rounded-lg overflow-hidden">
                <img
                  src={movie.bannerUrl}
                  alt={movie.title}
                  className="w-full h-auto sm:h-full sm:object-cover object-center block"
                />
              </div>

            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}