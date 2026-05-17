"use client";

import React from 'react';
import Image from 'next/image';
import { Movie } from '@/services/tmdb';

interface MovieCardProps {
  readonly movie: Movie;
  readonly onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div 
      onClick={onClick} 
      style={{ cursor: 'pointer', width: '100%' }}
      className="hover:scale-110 transition-transform duration-300"
      data-testid={`movie-card-${movie.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ver detalhes de ${movie.title || movie.name}`}
    >
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '6px', overflow: 'hidden' }}>
        {movie.poster_path ? (
          <Image 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title || movie.name || "poster"} 
            fill 
            style={{ objectFit: 'cover' }} 
            unoptimized 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
            {movie.title || movie.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
