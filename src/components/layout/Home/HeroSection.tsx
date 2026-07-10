import BannerSlider from './BannerSlider';
import BookingBar from './QuickBooking/BookingBar';

export default function HeroSection() {
  return (
    <section className="relative w-full mb-0 md:mb-10">
      <BannerSlider />

      <div className="hidden md:block relative z-10 mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingBar />
      </div>


    </section>
  );
}