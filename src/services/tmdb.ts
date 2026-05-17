const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const getApiKey = (): string => {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    if (typeof window !== 'undefined') {
      console.error('[PereFlix] Erro: NEXT_PUBLIC_TMDB_API_KEY não configurada no ambiente.');
    }
    return '';
  }
  return key;
};

export const getMovies = async (endpoint: string): Promise<Movie[]> => {
  const apiKey = getApiKey();
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${apiKey}&language=pt-BR`, {
    next: { revalidate: 3600 } // Cache results for 1 hour using Next.js caching
  });
  
  if (!res.ok) {
    throw new Error(`Falha ao carregar filmes (HTTP ${res.status})`);
  }
  
  const data = await res.json();
  return data.results || [];
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];
  const apiKey = getApiKey();
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar filmes (HTTP ${res.status})`);
  }
  const data = await res.json();
  return data.results || [];
};

export const endpoints = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
};