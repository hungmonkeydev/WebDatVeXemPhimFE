import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img2 from '../../../public/hero/image1.png';
import img3 from '../../../public/hero/image2.png';
import img4 from '../../../public/hero/image3.png';
import img5 from '../../../public/hero/image4.png';

import imgCoCo from '../../../public/hero/bannerCoCo.png';

export default function BannerSlider() {
  const banners = [
    { id: 1, imgUrl: img2 },
    { id: 2, imgUrl: img3 },
    { id: 3, imgUrl: img4 },
    { id: 4, imgUrl: imgCoCo },
    { id: 5, imgUrl: img5 },

  ];

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
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={false}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="w-full">
            <img
              src={banner.imgUrl}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-contain object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}