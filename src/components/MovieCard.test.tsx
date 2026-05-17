import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/services/tmdb';

// Mock next/image to prevent environment issues in Jest
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt || 'mocked image'} />;
  }
}));

const mockMovie: Movie = {
  id: 42,
  title: 'Interestelar',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: 'Um astronauta viaja pelo universo.',
  vote_average: 8.7,
  release_date: '2014-11-07',
};

const mockMovieNoPoster: Movie = {
  id: 99,
  title: 'Filme Sem Poster',
  poster_path: '',
  backdrop_path: '',
  overview: '',
  vote_average: 5.0,
};

describe('MovieCard Component', () => {
  it('renders the poster image when poster_path is available', () => {
    render(<MovieCard movie={mockMovie} onClick={jest.fn()} />);

    const img = screen.getByAltText('Interestelar');
    expect(img).toBeInTheDocument();
  });

  it('renders the movie title as fallback when poster_path is empty', () => {
    render(<MovieCard movie={mockMovieNoPoster} onClick={jest.fn()} />);

    expect(screen.getByText('Filme Sem Poster')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const onClickMock = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={onClickMock} />);

    const card = screen.getByTestId('movie-card-42');
    fireEvent.click(card);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const onClickMock = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={onClickMock} />);

    const card = screen.getByTestId('movie-card-42');
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const onClickMock = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={onClickMock} />);

    const card = screen.getByTestId('movie-card-42');
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for irrelevant keys', () => {
    const onClickMock = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={onClickMock} />);

    const card = screen.getByTestId('movie-card-42');
    fireEvent.keyDown(card, { key: 'Tab', code: 'Tab' });

    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<MovieCard movie={mockMovie} onClick={jest.fn()} />);

    const card = screen.getByRole('button', { name: /Ver detalhes de Interestelar/i });
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
