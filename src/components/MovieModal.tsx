"use client";

import React from 'react';
import Image from 'next/image';
import { Movie } from '@/services/tmdb';

interface MovieModalProps {
  readonly movie: Movie | null;
  readonly onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      aria-label="Fechar modal"
    >
      <div 
        style={{
          backgroundColor: '#181818', width: '100%', maxWidth: '700px',
          maxHeight: '90vh', borderRadius: '12px', overflowY: 'auto',
          position: 'relative', border: '1px solid #333'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>✕</button>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <Image src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} alt="banner" fill style={{ objectFit: 'cover' }} unoptimized />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', background: 'linear-gradient(to top, #181818, transparent)' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{movie.title || movie.name}</h2>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Informações Técnicas */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '1.1rem', alignItems: 'center' }}>
            <span style={{ color: '#46d369', fontWeight: 'bold' }}>{Math.round(movie.vote_average * 10)}% relevante</span>
            <span style={{ color: '#a3a3a3' }}>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
          </div>

          <p style={{ lineHeight: '1.7', color: '#efefef', fontSize: '1.1rem', marginBottom: '20px' }}>
            {movie.overview && movie.overview.trim() !== "" 
            ? movie.overview 
            : "Sinopse não disponível para este título no momento."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;