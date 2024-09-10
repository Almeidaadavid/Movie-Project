export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterPath: string;
    release_date: string;
    vote_average: number;
  }

  export interface MovieDetails extends Movie {
    genres: { id: number; name: string }[];
    runtime: number;
    revenue: number;
    tagline: string;
  }

  export interface MovieSearchResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }
  
  export interface MovieDetailDTO {
    id: number;
    title: string;
    description: string;
    date: string;
    posterPath: string;
    rating: number;
    budget: number;
    backdropPath: string | null;
  }