import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export const useMovies = (activeTab: string, searchParams?: { keyword?: string; genreIds?: number[] }) => {
    const [moviesList, setMoviesList] = useState<any[]>([]);
    const [nowShowingResults, setNowShowingResults] = useState<any[]>([]);
    const [comingSoonResults, setComingSoonResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const hasSearch = !!(searchParams?.keyword || (searchParams?.genreIds && searchParams.genreIds.length > 0));

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            let response;

            if (hasSearch) {
                const [nowShowingRes, comingSoonRes] = await Promise.all([
                    movieService.getNowShowing(0, 20),
                    movieService.getComingSoon(0, 20),
                ]);

                const nowShowingArr = nowShowingRes.data?.data?.content || nowShowingRes.data?.data || [];
                const comingSoonArr = comingSoonRes.data?.data?.content || comingSoonRes.data?.data || [];

                const kw = (searchParams?.keyword || '').toLowerCase();
                const matchFn = (m: any) => {
                    const matchTitle = m.title?.toLowerCase().includes(kw);
                    const matchGenre = m.genres?.some((g: any) =>
                        g.name?.toLowerCase().includes(kw)
                    );
                    return matchTitle || matchGenre;
                };

                setNowShowingResults(nowShowingArr.filter(matchFn));
                setComingSoonResults(comingSoonArr.filter(matchFn));
                setIsLoading(false);
                return;
            } else if (activeTab === 'dang_chieu') {
                response = await movieService.getNowShowing();
            } else if (activeTab === 'sap_chieu') {
                response = await movieService.getComingSoon();
            } else if (activeTab === 'imax') {
                response = await movieService.getImax();
            } else {
                response = await movieService.getMovies();
            }

            if (response.status === 200) {
                const moviesArray = response.data?.data?.content || response.data?.data || response.data || [];
                setMoviesList(moviesArray);
            }

        } catch (error) {
            console.error("❌ LỖI API:", error);
            setMoviesList([]);
            setNowShowingResults([]);
            setComingSoonResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [activeTab, searchParams?.keyword, JSON.stringify(searchParams?.genreIds)]);

    return { moviesList, nowShowingResults, comingSoonResults, hasSearch, isLoading };
};