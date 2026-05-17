import { useState, useEffect } from 'react';
import { searchMovies, Movie } from '@/services/tmdb';
import { useDebounce } from './useDebounce';

export function useSearch() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(debouncedQuery);
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar filmes'));
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return { query, setQuery, results, loading, error };
}
