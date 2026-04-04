// src/App.tsx
import Header from './components/Header/Header';
import HeroSection from './components/Home/HeroSection';
import MovieList from './components/Movie/MovieList';

function App() {
  return (
    // Dùng min-h-screen để web luôn cao tối thiểu bằng màn hình
    // bg-gray-50 tạo màu nền hơi xám nhẹ để làm nổi bật cái Header màu trắng lên
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Đặt Header lên trên cùng */}
      <Header />

      {/* 2. Phần nội dung chính của trang web (Banner, Danh sách phim...) sẽ nằm ở dưới này */}
      <main className="w-full mx-auto px-4 py-8">
        <HeroSection />
        <MovieList />
      </main>

    </div>
  );
}

export default App;