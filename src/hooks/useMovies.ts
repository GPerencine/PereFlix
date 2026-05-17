import { useState, useEffect, useCallback } from 'react';
import { getMovies, Movie } from '@/services/tmdb';

export function useMovies(endpoint: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovies(endpoint);
      setMovies(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar filmes'));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}
