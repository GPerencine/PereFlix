"use client";

import React from 'react';
import { Movie } from '@/services/tmdb';
import { MovieRowSkeleton } from './MovieCardSkeleton';
import { ApiErrorFallback } from './ApiErrorFallback';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  readonly title: string;
  readonly movies: Movie[];
  readonly loading: boolean;
  readonly error: Error | null;
  readonly onRetry: () => void;
  readonly onMovieClick: (movie: Movie) => void;
}

export function MovieRow({ 
  title, 
  movies, 
  loading, 
  error, 
  onRetry, 
  onMovieClick 
}: MovieRowProps) {
  if (error) {
    return <ApiErrorFallback message={error.message} onRetry={onRetry} />;
  }
  
  if (loading) {
    return <MovieRowSkeleton />;
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section style={{ marginBottom: '40px' }} data-testid="movie-row-section">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e5e5e5', marginBottom: '15px', marginLeft: '4%' }}>{title}</h2>
      
      <div 
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '15px', 
          padding: '0 4% 20px 4%',
          scrollBehavior: 'smooth'
        }}
      >
        {movies.map((movie: Movie) => (
          <div 
            key={movie.id} 
            style={{ flex: '0 0 auto', width: 'clamp(140px, 15vw, 200px)' }}
          >
            <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRow;
