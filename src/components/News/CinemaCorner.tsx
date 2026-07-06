// src/components/News/CinemaCorner.tsx
import { useState } from 'react';
const FacebookLikeBtn = ({ count }: { count: number }) => (
  <div className="flex items-center mt-2">
    <button className="bg-[#1877f2] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 hover:bg-[#166fe5]">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2 10h3v10H2zM21.1 11.2c.4-.4.5-1 .3-1.5-.2-.5-.7-.8-1.3-.8h-4.8l.7-3.4c.1-.4 0-.8-.2-1.2-.3-.5-.8-.7-1.4-.7-.4 0-.7.1-1 .3l-5.4 5.4v10.6l8.8-1.5c.6-.1 1.1-.6 1.3-1.1l1.8-5.3c.1-.3.1-.6-.2-.8z" /></svg>
      Thích
    </button>
    <span className="bg-gray-100 text-gray-600 text-[11px] border border-gray-200 px-2 py-0.5 rounded-sm ml-1">
      {count}
    </span>
  </div>
);
export default function CinemaCorner() {
  const [activeTab, setActiveTab] = useState('binh_luan');

  const tabs = [
    { id: 'binh_luan', label: 'Bình luận phim' },
    { id: 'blog', label: 'Blog điện ảnh' },
  ];

  // Dữ liệu giả lập giống hệt hình bạn gửi
  const articles = [
    {
      id: 1,
      title: '[Review] Avengers: Endgame - Cú Chốt Hạ Hoành Tráng Thập Kỷ Của Vũ Trụ Marvel',
      image: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
      likes: 3450,
      isFeatured: true,
      category: 'binh_luan'
    },
    {
      id: 2,
      title: '[Phân Tích] Kỵ Sĩ Bóng Đêm: Tại Sao Joker Của Heath Ledger Vẫn Là Tượng Đài Bất Tử?',
      image: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
      likes: 1903,
      isFeatured: false,
      category: 'binh_luan'
    },
    {
      id: 3,
      title: '[Preview] Vua Sư Tử: Kiệt Tác Hoạt Hình Tuổi Thơ Chuẩn Bị Trở Lại Rạp Chiếu',
      image: 'https://image.tmdb.org/t/p/w1280/w2uGvCpMtvRqZg6waC1hvLyZoJa.jpg',
      likes: 1086,
      isFeatured: false,
      category: 'binh_luan'
    },
    {
      id: 4,
      title: '[Review] Coco - Hội Ngộ Diệu Kỳ: Khúc Ca Cảm Động Về Tình Cảm Gia Đình Dành Cho Mọi Lứa Tuổi',
      image: 'https://image.tmdb.org/t/p/w1280/askg3SMvhqEl4OL52YuvdtY40Yb.jpg', likes: 891,
      isFeatured: false,
      category: 'binh_luan'
    }
  ];
  // Lọc bài viết theo Tab đang chọn
  const currentArticles = articles.filter(article => article.category === activeTab);

  // Tìm bài nổi bật (bài bên trái). Nếu không thấy bài nào set isFeatured = true thì lấy đại bài đầu tiên.
  const featuredArticle = currentArticles.find(article => article.isFeatured) || currentArticles[0];

  // Lấy các bài còn lại (trừ bài nổi bật ra) để nhét vào danh sách bên phải
  const subArticles = currentArticles.filter(article => article.id !== featuredArticle?.id);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">

      {/* ====== PHẦN HEADER ====== (Copy y chang style của MovieList) */}
      <div className="flex items-center gap-5 md:gap-8 mb-6 md:mb-8 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-hide whitespace-nowrap w-full">

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Góc Điện Ảnh</h2>
        </div>

        <div className="flex items-center gap-5 md:gap-6 font-medium text-[14px] md:text-[15px] shrink-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
            >
              {tab.label}

              {activeTab === tab.id && (
                <div className="absolute -bottom-[11px] left-0 w-full h-[2px] bg-blue-600"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ====== PHẦN NỘI DUNG CHÍNH ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {featuredArticle && (
          <div className="flex flex-col cursor-pointer group">
            <div className="overflow-hidden rounded-md mb-4">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {featuredArticle.title}
            </h3>
            <FacebookLikeBtn count={featuredArticle.likes} />
          </div>
        )}

        {/* CỘT PHẢI: DANH SÁCH BÀI PHỤ */}
        <div className="flex flex-col gap-6">
          {subArticles.map((article) => (
            <div key={article.id} className="flex gap-4 cursor-pointer group">
              {/* Hình nhỏ bên trái */}
              <div className="w-40 shrink-0 overflow-hidden rounded-md">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <FacebookLikeBtn count={article.likes} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ====== NÚT XEM THÊM ====== */}
      <div className="mt-8 flex justify-center">
        <button className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 px-8 py-2 rounded text-[14px] flex items-center gap-2">
          Xem thêm
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </section>
  );
}