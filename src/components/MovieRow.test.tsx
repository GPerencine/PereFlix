import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieRow } from './MovieRow';
import { Movie } from '@/services/tmdb';

// Mock next/image to prevent environment issues in Jest
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt || 'mocked image'} style={props.style} />;
  }
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Filme de Teste 1',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    overview: 'Uma descrição legal do filme 1',
    vote_average: 8.5,
    release_date: '2026-05-17'
  },
  {
    id: 2,
    title: 'Filme de Teste 2',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    overview: 'Uma descrição legal do filme 2',
    vote_average: 7.2,
    release_date: '2026-04-10'
  }
];

describe('MovieRow Component', () => {
  it('renders loading skeletons when loading is true', () => {
    render(
      <MovieRow 
        title="Tendências" 
        movies={[]} 
        loading={true} 
        error={null} 
        onRetry={jest.fn()} 
        onMovieClick={jest.fn()} 
      />
    );
    
    expect(screen.getByTestId('movie-row-skeleton')).toBeInTheDocument();
  });

  it('renders api error fallback when error is provided', () => {
    const onRetryMock = jest.fn();
    render(
      <MovieRow 
        title="Tendências" 
        movies={[]} 
        loading={false} 
        error={new Error('Erro de Conexão')} 
        onRetry={onRetryMock} 
        onMovieClick={jest.fn()} 
      />
    );
    
    expect(screen.getByTestId('api-error-fallback')).toBeInTheDocument();
    expect(screen.getByText(/Ops! Não foi possível carregar esta seção/i)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /Tentar Novamente/i });
    fireEvent.click(retryButton);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('renders movie title and card elements when loaded successfully', () => {
    const onMovieClickMock = jest.fn();
    render(
      <MovieRow 
        title="Tendências" 
        movies={mockMovies} 
        loading={false} 
        error={null} 
        onRetry={jest.fn()} 
        onMovieClick={onMovieClickMock} 
      />
    );
    
    expect(screen.getByText('Tendências')).toBeInTheDocument();
    
    // Check that we render cards
    const card1 = screen.getByTestId('movie-card-1');
    const card2 = screen.getByTestId('movie-card-2');
    
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();
    
    // Test interactive clicking
    fireEvent.click(card1);
    expect(onMovieClickMock).toHaveBeenCalledWith(mockMovies[0]);
  });
});
