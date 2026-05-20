"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { endpoints, Movie } from "@/services/tmdb";
import { useMovies } from '@/hooks/useMovies';
import { useSearch } from '@/hooks/useSearch';
import { MovieRow } from '@/components/MovieRow';
import { MovieCard } from '@/components/MovieCard';

const MovieModal = dynamic(() => import("@/components/MovieModal"), { ssr: false });

export default function Home() {
  const { movies: trending, loading: trendingLoading, error: trendingError, refetch: refetchTrending } = useMovies(endpoints.trending);
  const { movies: popular, loading: popularLoading, error: popularError, refetch: refetchPopular } = useMovies(endpoints.popular);
  const { movies: topRated, loading: topRatedLoading, error: topRatedError, refetch: refetchTopRated } = useMovies(endpoints.topRated);
  const { movies: upcoming, loading: upcomingLoading, error: upcomingError, refetch: refetchUpcoming } = useMovies(endpoints.upcoming);

  const { query, setQuery, results: searchResults, loading: searchLoading, error: searchError } = useSearch();

  const featuredMovie = trending.length > 0 ? trending[0] : null;
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasSearchQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden">
      
      {/* Header Fixo */}
      <header className={`px-[4%] py-[15px] fixed top-0 w-full z-[1000] transition-all duration-400 flex items-center justify-between ${
        isScrolled || hasSearchQuery 
          ? 'bg-black bg-none' 
          : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <h1 
          className="text-[#E50914] text-[2rem] font-black italic m-0 cursor-pointer"
          onClick={() => { setQuery(''); setIsSearchExpanded(false); }}
        >
          PEREFLIX
        </h1>

        {/* Sleek Search Bar */}
        <div className="flex items-center gap-2.5">
          <div 
            className={`flex items-center px-2.5 py-1.5 rounded transition-all duration-300 ${
              isSearchExpanded ? 'border-[#ccc] border bg-black/70' : 'border-transparent border bg-transparent'
            }`}
          >
            <span 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
              className="cursor-pointer text-[1.2rem] mr-[5px] select-none"
              aria-label="Search"
            >
              🔍
            </span>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Títulos, pessoas, gêneros..."
              className={`border-none bg-transparent text-white outline-none transition-all duration-300 text-[0.9rem] ${
                isSearchExpanded ? 'w-[200px] opacity-100' : 'w-0 opacity-0'
              }`}
              disabled={!isSearchExpanded}
            />
            {isSearchExpanded && query && (
              <span 
                onClick={() => setQuery('')}
                className="cursor-pointer text-[#aaa] text-[0.8rem] ml-[5px]"
              >
                ✕
              </span>
            )}
          </div>
        </div>
      </header>

      {hasSearchQuery ? (
        /* Search Results Content */
        <main className="pt-[100px] px-[4%] min-h-[80vh]">
          <h2 className="text-[1.8rem] font-bold mb-[25px]">
            Resultados para &quot;{query}&quot;
          </h2>

          {searchError && (
            <div className="text-center py-[50px]">
              <p className="text-[#E50914]">Ocorreu um erro ao buscar filmes.</p>
              <p className="text-[#aaa]">{searchError.message}</p>
            </div>
          )}

          {searchLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 pb-[50px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`search-skeleton-${i}`} className="flex-none w-full animate-pulse">
                  <div className="relative aspect-[2/3] rounded-md bg-[#262626]" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 pb-[50px]">
              {searchResults.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => setSelectedMovie(movie)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-[100px] px-5 text-[#808080]">
              <p className="text-[1.2rem] mb-2.5">Nenhum filme encontrado para &quot;{query}&quot;.</p>
              <p className="text-[0.9rem]">Tente pesquisar por outros termos ou verifique a grafia.</p>
            </div>
          )}
        </main>
      ) : (
        /* Standard Home Page Content */
        <>
          {/* Hero Banner Adaptável */}
          {trendingLoading && !featuredMovie ? (
            <section className="h-[80vh] w-full bg-[#1c1c1c] flex items-center px-[4%] animate-pulse">
              <div className="w-full max-w-[700px]">
                <div className="h-[50px] w-[60%] bg-[#262626] rounded-lg mb-5" />
                <div className="h-[20px] w-full bg-[#262626] rounded mb-2.5" />
                <div className="h-[20px] w-[80%] bg-[#262626] rounded mb-[25px]" />
                <div className="h-[40px] w-[150px] bg-[#262626] rounded" />
              </div>
            </section>
          ) : (
            featuredMovie && (
              <section 
                className="h-[80vh] w-full bg-cover bg-center flex items-center px-[4%]"
                style={{ 
                  backgroundImage: `linear-gradient(to top, #141414 10%, transparent 90%), linear-gradient(to right, rgba(0,0,0,0.7), transparent), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
                }}
              >
                <div className="max-w-[700px] mt-[50px]">
                  <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.1] mb-5">
                    {featuredMovie.title || featuredMovie.name}
                  </h1>
                  <p 
                    className="text-[1.1rem] mb-[25px] line-clamp-3"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {featuredMovie.overview}
                  </p>
                  <button 
                    onClick={() => setSelectedMovie(featuredMovie)}
                    className="px-[35px] py-3 bg-white text-black border-none rounded font-bold cursor-pointer text-[1.1rem]"
                  >
                    ⓘ Mais Informações
                  </button>
                </div>
              </section>
            )
          )}

          {/* Listas de Filmes */}
          <main className="relative z-10 pb-[50px]" style={{ marginTop: featuredMovie ? '-100px' : '20px' }}>
            <MovieRow 
              title="Tendências" 
              movies={trending} 
              loading={trendingLoading} 
              error={trendingError} 
              onRetry={refetchTrending} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Populares na PereFlix" 
              movies={popular} 
              loading={popularLoading} 
              error={popularError} 
              onRetry={refetchPopular} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Melhores Avaliados" 
              movies={topRated} 
              loading={topRatedLoading} 
              error={topRatedError} 
              onRetry={refetchTopRated} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Em Breve" 
              movies={upcoming} 
              loading={upcomingLoading} 
              error={upcomingError} 
              onRetry={refetchUpcoming} 
              onMovieClick={setSelectedMovie} 
            />
          </main>
        </>
      )}

      <footer className="py-[50px] text-center text-[#808080] text-sm">
        © 2026 PereFlix - Criado por Gabriel Perencine
      </footer>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}