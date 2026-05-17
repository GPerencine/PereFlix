import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieModal from './MovieModal';
import { Movie } from '@/services/tmdb';

// Mock next/image to avoid environment issues in Jest
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt || 'mocked image'} />;
  }
}));

const mockMovie: Movie = {
  id: 101,
  title: 'Interestelar',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: 'Uma jornada espacial de tirar o fôlego.',
  vote_average: 8.6,
  release_date: '2014-11-07',
};

const mockMovieWithoutOverview: Movie = {
  id: 102,
  title: 'Sem Sinopse',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: '',
  vote_average: 7.0,
};

describe('MovieModal Component', () => {
  it('returns null if movie is null', () => {
    const { container } = render(<MovieModal movie={null} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders movie title, relevance percentage, and overview correctly', () => {
    render(<MovieModal movie={mockMovie} onClose={jest.fn()} />);

    expect(screen.getByText('Interestelar')).toBeInTheDocument();
    expect(screen.getByText('86% relevante')).toBeInTheDocument();
    expect(screen.getByText('Uma jornada espacial de tirar o fôlego.')).toBeInTheDocument();
    expect(screen.getByText('2014')).toBeInTheDocument();
  });

  it('renders custom fallback when overview is empty', () => {
    render(<MovieModal movie={mockMovieWithoutOverview} onClose={jest.fn()} />);

    expect(screen.getByText('Sinopse não disponível para este título no momento.')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<MovieModal movie={mockMovie} onClose={onCloseMock} />);

    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking on the backdrop overlay', () => {
    const onCloseMock = jest.fn();
    render(<MovieModal movie={mockMovie} onClose={onCloseMock} />);

    // Click on the overlay (backdrop)
    const overlay = screen.getByRole('button', { name: 'Fechar modal' });
    fireEvent.click(overlay);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onCloseMock = jest.fn();
    render(<MovieModal movie={mockMovie} onClose={onCloseMock} />);

    const overlay = screen.getByRole('button', { name: 'Fechar modal' });
    fireEvent.keyDown(overlay, { key: 'Escape', code: 'Escape' });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
