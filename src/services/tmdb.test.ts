import { getMovies, searchMovies } from './tmdb';

describe('TMDB Service Layer', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    global.fetch = jest.fn();
    console.error = jest.fn(); // Suppress expected error logs
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses empty API key and logs warning when NEXT_PUBLIC_TMDB_API_KEY is not defined', async () => {
    delete process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await getMovies('/movie/popular');

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_TMDB_API_KEY não configurada')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api_key=&language=pt-BR'),
      expect.any(Object)
    );
  });

  it('correctly appends the API key from environment to fetch URL', async () => {
    process.env.NEXT_PUBLIC_TMDB_API_KEY = 'mocked_key_123';
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await getMovies('/movie/popular');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api_key=mocked_key_123'),
      expect.any(Object)
    );
  });

  it('throws an error when the fetch request is not ok', async () => {
    process.env.NEXT_PUBLIC_TMDB_API_KEY = 'mocked_key_123';
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(getMovies('/movie/popular')).rejects.toThrow(
      'Falha ao carregar filmes (HTTP 401)'
    );
  });

  it('returns empty array when search query is empty', async () => {
    const results = await searchMovies('');
    expect(results).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
