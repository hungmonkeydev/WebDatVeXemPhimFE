import BannerSlider from './BannerSlider';
import BookingBar from './QuickBooking/BookingBar';

export default function HeroSection() {
  return (
    <section className="relative w-full mb-0 md:mb-10">
      <BannerSlider />
      <div className="hidden md:block absolute left-0 right-0 md:-bottom-4 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <BookingBar />
        </div>
      </div>

    </section>
  );
}