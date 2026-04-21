// src/components/Home/Promotion.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import img1 from '../../../public/promotion/u22.png';
import img2 from '../../../public/promotion/ngaytrian.png';
import img3 from '../../../public/promotion/t3vuive.png';
import img4 from '../../../public/promotion/combogift.png';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Promotion() {
  const promotions = [
    {
      id: 1,
      title: 'Galaxy Nguyễn Du Nâng Cấp Mới - Trải Nghiệm Đã Hơn, Ưu Đãi Phơi Phới',
      image: img1,
    },
    {
      id: 2,
      title: 'VieCinema - Hanoi Centre: Mãn Nhãn Với Không Gian, "Mãn Vị" Với Menu Tiệc Khai Trương Đẳng Cấp!',
      image: img2,
    },
    {
      id: 3,
      title: 'Happy Day - Vé Chỉ Từ 45K',
      image: img3,
    },
    {
      id: 4,
      title: 'Ưu Đãi Thành Viên VieCinema 2026',
      image: img4,
    },
    {
      id: 5,
      title: 'Thứ 3 Vui Vẻ - X2 Điểm Tích Lũy Thành Viên',
      image: img3,
    },
    {
      id: 6,
      title: 'Combo Bắp Nước Ưu Đãi Giảm Giá 20% Qua App',
      image: img4,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      
      {/* ====== PHẦN HEADER ====== */}
      <div className="flex items-center gap-8 mb-8 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-700"></div>
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Tin Khuyến Mãi</h2>
        </div>
      </div>

      {/* ====== PHẦN SLIDER TỰ ĐỘNG CHẠY ====== */}
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24} 
        loop={true} 
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false,
        }}
        navigation={false} 
        breakpoints={{
          0: {
            slidesPerView: 1.2, 
          },
          640: {
            slidesPerView: 2, 
          },
          768: {
            slidesPerView: 3, 
          },
          1024: {
            slidesPerView: 4, 
          },
        }}
        className="w-full pb-4" 
      >
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className="flex flex-col cursor-pointer group h-full">
              <div className="overflow-hidden rounded-md mb-3">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="text-[15px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {promo.title}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}