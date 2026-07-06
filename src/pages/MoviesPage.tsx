import MovieList from '../components/Movie/MovieList';

export default function MoviesPage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            <MovieList isFullPage={true} />
        </div>
    );
}