import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../Movie/MovieCard';
import { useMovies } from '../../Hooks/useMovies';

interface MovieListProps {
    isFullPage?: boolean;
}

export default function MovieList({ isFullPage = false }: MovieListProps) {
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search') || '';

    const [activeTab, setActiveTab] = useState('dang_chieu');
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTrailer, setActiveTrailer] = useState<string | null>(null);
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

    const tabs = [
        { id: 'dang_chieu', label: 'Đang chiếu' },
        { id: 'sap_chieu', label: 'Sắp chiếu' },
        { id: 'imax', label: 'Phim IMAX' },
        { id: 'top_rated', label: 'Đánh giá cao' }
    ];

    const { moviesList, nowShowingResults, comingSoonResults, hasSearch, isLoading } = useMovies(activeTab, {
        keyword: searchKeyword,
        genreIds: selectedGenreIds,
    });

    const displayedMovies = (isExpanded || isFullPage) ? moviesList : moviesList.slice(0, 8);

    // Component con để tránh lặp code khi render lưới phim
    const renderMovieGrid = (movies: any[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-4 md:gap-y-6 md:gap-x-10 lg:gap-y-10 lg:gap-x-16">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    imageUrl={movie.posterUrl}
                    rating={movie.averageRating}
                    ageTag={movie.ageRating}
                    trailerUrl={movie.trailerUrl}
                    onOpenTrailer={(url) => setActiveTrailer(url)}
                />
            ))}
        </div>
    );

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">

            {hasSearch && (
                <div className="mb-6">
                    <p className="text-gray-600 text-[15px]">
                        Kết quả tìm kiếm cho: <span className="font-bold text-gray-800">"{searchKeyword}"</span>
                    </p>
                </div>
            )}

            {/* ====== HEADER ====== */}
            <div className="flex items-center gap-3 md:gap-8 mb-8 border-b border-gray-200 pb-2 w-full">
                
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-1 h-5 md:h-6 bg-blue-700"></div>
                    <h2 className="hidden md:block text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide">Phim</h2>
                </div>

                {!hasSearch && (
                    <div className="flex-1 md:flex-none flex items-center justify-around md:justify-start md:gap-6 font-medium text-[12px] sm:text-[14px] md:text-[15px]">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative cursor-pointer transition-colors text-center whitespace-nowrap ${
                                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute -bottom-[11px] left-0 w-full h-[2px] bg-blue-600"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ====== HIỂN THỊ KẾT QUẢ ====== */}
            {isLoading ? (
                <p className="text-center text-gray-500 py-10">Đang tải...</p>
            ) : hasSearch ? (
                <>
                    {nowShowingResults.length === 0 && comingSoonResults.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            Không tìm thấy phim nào khớp với "{searchKeyword}"
                        </p>
                    ) : (
                        <>
                            {nowShowingResults.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-base font-bold text-gray-800 mb-4 uppercase">
                                        Phim đang chiếu ({nowShowingResults.length})
                                    </h3>
                                    {renderMovieGrid(nowShowingResults)}
                                </div>
                            )}

                            {comingSoonResults.length > 0 && (
                                <div>
                                    <h3 className="text-base font-bold text-gray-800 mb-4 uppercase">
                                        Phim sắp chiếu ({comingSoonResults.length})
                                    </h3>
                                    {renderMovieGrid(comingSoonResults)}
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                displayedMovies.length > 0 ? (
                    renderMovieGrid(displayedMovies)
                ) : (
                    <p className="text-center text-gray-500 py-10">Chưa có phim nào trong mục này.</p>
                )
            )}

            {/* ====== NÚT XEM THÊM (ẩn khi search) ====== */}
            {!isFullPage && !isLoading && !hasSearch && moviesList.length > 8 && (
                <div className="mt-8 md:mt-10 flex justify-center">
                    {!isExpanded ? (
                        <button onClick={() => setIsExpanded(true)} className="border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white transition-colors duration-300 w-full md:w-auto px-8 py-2.5 rounded text-[14px] md:text-[15px] flex items-center justify-center gap-2">
                            Xem thêm
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    ) : (
                        <button onClick={() => setIsExpanded(false)} className="border border-gray-400 text-gray-500 hover:bg-gray-100 transition-colors duration-300 w-full md:w-auto px-8 py-2.5 rounded text-[14px] md:text-[15px] flex items-center justify-center gap-2">
                            Thu gọn
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                    )}
                </div>
            )}

            {activeTrailer && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-[15vh] bg-black/90 p-4 lg:p-10 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl mx-auto animate-fade-in">
                        <button onClick={() => setActiveTrailer(null)} className="absolute -top-10 right-0 lg:top-4 lg:right-4 z-10 w-10 h-10 bg-black/60 hover:bg-[#f26b38] text-white rounded-full flex items-center justify-center transition-colors text-xl font-bold">✕</button>
                        <iframe
                            src={activeTrailer.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title="Trailer phim"
                            className="w-full aspect-video rounded-xl shadow-2xl border border-gray-800"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
}