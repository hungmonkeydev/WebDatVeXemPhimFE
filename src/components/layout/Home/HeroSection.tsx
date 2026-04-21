// src/components/Home/HeroSection.tsx
import BannerSlider from './BannerSlider';
import BookingBar from './QuickBooking/BookingBar';

export default function HeroSection() {
  return (
    <section className="relative w-full mb-16">
      
      {/* 1. Phần Banner Trượt (Nằm chìm ở dưới) */}
      <BannerSlider />

      {/* 2. Thanh Đặt Vé Nhanh (Nổi lên trên và đè xuống mép dưới của Banner) */}
      <div className="absolute left-0 right-0 -bottom-8 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <BookingBar />
        </div>  
      </div>

    </section>
  );
}