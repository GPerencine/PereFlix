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
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' }}>
      
      {/* Header Fixo */}
      <header style={{ 
        padding: '15px 4%', 
        backgroundColor: isScrolled || hasSearchQuery ? 'black' : 'transparent',
        backgroundImage: isScrolled || hasSearchQuery ? 'none' : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        position: 'fixed', top: 0, width: '100%', zIndex: 1000, transition: '0.4s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 
          style={{ color: '#E50914', fontSize: '2rem', fontWeight: '900', fontStyle: 'italic', margin: 0, cursor: 'pointer' }}
          onClick={() => { setQuery(''); setIsSearchExpanded(false); }}
        >
          PEREFLIX
        </h1>

        {/* Sleek Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: isSearchExpanded ? '1px solid #ccc' : '1px solid transparent', 
              padding: '5px 10px', 
              borderRadius: '4px',
              backgroundColor: isSearchExpanded ? 'rgba(0,0,0,0.7)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <span 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
              style={{ cursor: 'pointer', fontSize: '1.2rem', marginRight: '5px', userSelect: 'none' }}
              aria-label="Search"
            >
              🔍
            </span>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Títulos, pessoas, gêneros..."
              style={{
                width: isSearchExpanded ? '200px' : '0px',
                opacity: isSearchExpanded ? 1 : 0,
                border: 'none',
                backgroundColor: 'transparent',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              disabled={!isSearchExpanded}
            />
            {isSearchExpanded && query && (
              <span 
                onClick={() => setQuery('')}
                style={{ cursor: 'pointer', color: '#aaa', fontSize: '0.8rem', marginLeft: '5px' }}
              >
                ✕
              </span>
            )}
          </div>
        </div>
      </header>

      {hasSearchQuery ? (
        /* Search Results Content */
        <main style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', minHeight: '80vh' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '25px' }}>
            Resultados para &quot;{query}&quot;
          </h2>

          {searchError && (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p style={{ color: '#E50914' }}>Ocorreu um erro ao buscar filmes.</p>
              <p style={{ color: '#aaa' }}>{searchError.message}</p>
            </div>
          )}

          {searchLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', paddingBottom: '50px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`search-skeleton-${i}`} style={{ flex: '0 0 auto', width: '100%' }} className="animate-pulse">
                  <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '6px', backgroundColor: '#262626' }} />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', paddingBottom: '50px' }}>
              {searchResults.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => setSelectedMovie(movie)} 
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#808080' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Nenhum filme encontrado para &quot;{query}&quot;.</p>
              <p style={{ fontSize: '0.9rem' }}>Tente pesquisar por outros termos ou verifique a grafia.</p>
            </div>
          )}
        </main>
      ) : (
        /* Standard Home Page Content */
        <>
          {/* Hero Banner Adaptável */}
          {trendingLoading && !featuredMovie ? (
            <section style={{ 
              height: '80vh', width: '100%', 
              backgroundColor: '#1c1c1c',
              display: 'flex', alignItems: 'center', padding: '0 4%'
            }} className="animate-pulse">
              <div style={{ width: '100%', maxWidth: '700px' }}>
                <div style={{ height: '50px', width: '60%', backgroundColor: '#262626', borderRadius: '8px', marginBottom: '20px' }} />
                <div style={{ height: '20px', width: '100%', backgroundColor: '#262626', borderRadius: '4px', marginBottom: '10px' }} />
                <div style={{ height: '20px', width: '80%', backgroundColor: '#262626', borderRadius: '4px', marginBottom: '25px' }} />
                <div style={{ height: '40px', width: '150px', backgroundColor: '#262626', borderRadius: '4px' }} />
              </div>
            </section>
          ) : (
            featuredMovie && (
              <section style={{ 
                height: '80vh', width: '100%', 
                backgroundImage: `linear-gradient(to top, #141414 10%, transparent 90%), linear-gradient(to right, rgba(0,0,0,0.7), transparent), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', padding: '0 4%'
              }}>
                <div style={{ maxWidth: '700px', marginTop: '50px' }}>
                  <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '20px' }}>
                    {featuredMovie.title || featuredMovie.name}
                  </h1>
                  <p style={{ fontSize: '1.1rem', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    {featuredMovie.overview}
                  </p>
                  <button 
                    onClick={() => setSelectedMovie(featuredMovie)}
                    style={{ padding: '12px 35px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
                    ⓘ Mais Informações
                  </button>
                </div>
              </section>
            )
          )}

          {/* Listas de Filmes */}
          <main style={{ marginTop: featuredMovie ? '-100px' : '20px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
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

      <footer style={{ padding: '50px 0', textAlign: 'center', color: '#808080', fontSize: '14px' }}>
        © 2026 PereFlix - Criado por Gabriel Perencine
      </footer>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}