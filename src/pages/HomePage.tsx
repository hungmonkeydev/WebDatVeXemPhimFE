import HeroSection from '../components/Home/HeroSection';
import MovieList from '../components/Movie/MovieList';
import CinemaCorner from '../components/News/CinemaCorner';
import Promotion from '../components/News/Promotion';
export default function HomePage() {
  return (
    <main className="w-full mx-auto">
      <HeroSection />
      <MovieList />
      <CinemaCorner />
      <Promotion />
    </main>
  );
}