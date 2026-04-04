// src/components/HeroBanner/BannerSlider.tsx (Hoặc đường dẫn bạn đã chốt)

// 1. Import các component của Swiper dành riêng cho React
import { Swiper, SwiperSlide } from 'swiper/react';
// Import các module chức năng (Tự động chạy, Dấu chấm chuyển slide, Nút điều hướng)
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// 2. Import CSS mặc định của Swiper (BẮT BUỘC PHẢI CÓ)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '../../assets/hero/image.png';
import img2 from '../../assets/hero/image1.png';
import img3 from '../../assets/hero/image2.png';
import img4 from '../../assets/hero/image3.png';

export default function BannerSlider() {
  // Dữ liệu giả lập (Sau này bạn sẽ lấy từ API Backend Laravel của bạn)
  const banners = [
    { id: 1, imgUrl: img1 }, // Đang dùng ảnh giả để test
    { id: 2, imgUrl: img2 },
    { id: 3, imgUrl: img3 },
    { id: 4, imgUrl: img4 },
  ];

  return (
    // Đặt chiều cao cho Banner, bg-black để nếu ảnh chưa load kịp thì nền có màu đen
    <div className="w-full h-[500px] bg-white">
      <Swiper
        // Cấu hình các tính năng của Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={60} // Khoảng cách giữa các slide (30px)
        slidesPerView={1.2} // HIỆU ỨNG QUAN TRỌNG: Hiện 1 slide rưỡi (để lòi 2 mép ra)
        centeredSlides={true} // Đẩy slide đang active vào chính giữa màn hình
        loop={true} // Cuộn tròn vô tận (hết slide cuối tự vòng lại slide đầu)
        autoplay={{
          delay: 4000, // Cứ 4 giây tự động chuyển slide
          disableOnInteraction: false, // Người dùng vuốt xong vẫn tiếp tục tự động chạy
        }}
        pagination={{ clickable: true }} // Hiện mấy cái dấu chấm ở dưới
        navigation={true} // Hiện nút mũi tên Trái/Phải
        className="w-full h-full"
      >
        {/* Render danh sách ảnh */}
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="w-full h-full">
            <img
              src={banner.imgUrl}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover" 
              // object-cover giúp ảnh tự cắt cúp cho vừa vặn khung hình mà không bị méo
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}