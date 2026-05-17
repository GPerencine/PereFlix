import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div 
      style={{ flex: '0 0 auto', width: 'clamp(140px, 15vw, 200px)' }}
      className="animate-pulse"
      data-testid="movie-card-skeleton"
    >
      <div 
        style={{ 
          position: 'relative', 
          aspectRatio: '2/3', 
          borderRadius: '6px', 
          backgroundColor: '#262626',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}

export function MovieRowSkeleton() {
  return (
    <section style={{ marginBottom: '40px' }} data-testid="movie-row-skeleton">
      {/* Title skeleton */}
      <div 
        style={{ 
          height: '24px', 
          width: '150px', 
          backgroundColor: '#262626', 
          borderRadius: '4px',
          marginBottom: '15px', 
          marginLeft: '4%' 
        }} 
        className="animate-pulse"
      />
      
      {/* Horizontal card list skeleton */}
      <div 
        style={{ 
          display: 'flex', 
          overflowX: 'hidden', 
          gap: '15px', 
          padding: '0 4% 20px 4%'
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={`row-skeleton-card-${i}`} />
        ))}
      </div>
    </section>
  );
}
