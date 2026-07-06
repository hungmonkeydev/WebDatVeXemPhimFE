// src/pages/HomePage.tsx
import HeroSection from '../components/layout/Home/HeroSection';
import MovieList from '../components/Movie/MovieList';
import CinemaCorner from '../components/News/CinemaCorner';
import Promotion from '../components/News/Promotion';
export default function HomePage() {
  return (
    // Phần thẻ <main> được bê nguyên từ App.tsx sang đây
    <main className="w-full mx-auto">
      <HeroSection />
      <MovieList />
      <CinemaCorner />
      <Promotion />
    </main>
  );
}