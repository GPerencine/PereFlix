import { renderHook, waitFor } from '@testing-library/react';
import { useMovies } from '@/hooks/useMovies';
import { getMovies } from '@/services/tmdb';

jest.mock('@/services/tmdb', () => ({
  getMovies: jest.fn(),
}));

describe('useMovies', () => {
  const mockMovies = [{ id: 1, title: 'Test Movie', overview: 'Test Overview', backdrop_path: '/test.jpg' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Estado inicial (loading: true, movies: [], error: null)', async () => {
    let resolvePromise: (value: any) => void;
    (getMovies as jest.Mock).mockReturnValue(new Promise(resolve => {
      resolvePromise = resolve;
    }));

    const { result } = renderHook(() => useMovies('test-endpoint'));

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBeNull();

    // Resolve to allow test to finish gracefully
    resolvePromise!([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('2. Sucesso: movies populados após fetch resolvido', async () => {
    (getMovies as jest.Mock).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies('test-endpoint'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBeNull();
  });

  it('3. Erro: error populado após fetch rejeitado', async () => {
    const error = new Error('Erro na API');
    (getMovies as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useMovies('test-endpoint'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.movies).toEqual([]);
  });

  it('4. refetch: nova chamada ao mudar o endpoint', async () => {
    (getMovies as jest.Mock).mockResolvedValue(mockMovies);

    const { result, rerender } = renderHook(
      ({ endpoint }) => useMovies(endpoint),
      { initialProps: { endpoint: 'endpoint-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(getMovies).toHaveBeenCalledWith('endpoint-1');
    expect(getMovies).toHaveBeenCalledTimes(1);

    rerender({ endpoint: 'endpoint-2' });

    await waitFor(() => {
      // after rerender, it should fetch again
      expect(getMovies).toHaveBeenCalledTimes(2);
    });
    expect(getMovies).toHaveBeenCalledWith('endpoint-2');
  });
});
