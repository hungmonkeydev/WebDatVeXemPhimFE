
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '../../../../public/hero/image.png'; 
import img2 from '../../../../public/hero/image1.png';
import img3 from '../../../../public/hero/image2.png'; 
import img4 from '../../../../public/hero/image3.png';

export default function BannerSlider() {
  const banners = [
    { id: 1, imgUrl: img1 }, 
    { id: 2, imgUrl: img2 },
    { id: 3, imgUrl: img3 },
    { id: 4, imgUrl: img4 },
  ];

  return (
    <div className="w-full h-[500px] bg-white">
      <Swiper
        // Cấu hình các tính năng của Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={60} 
        slidesPerView={1.2} 
        centeredSlides={true} 
        loop={true} 
        autoplay={{
          delay: 4000, 
          disableOnInteraction: false, 
        }}
        pagination={{ clickable: true }} 
        navigation={false} 
        className="w-full h-full"
      >
        {/* Render danh sách ảnh */}
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="w-full h-full">
            <img
              src={banner.imgUrl}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-contain" 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}