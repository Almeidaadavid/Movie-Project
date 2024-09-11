import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import { MovieDetailDTO } from '../types/movieTypes';
import MovieList from '../components/MovieList';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useFavorites } from '../context/FavoriteContext';
import { toast } from 'react-toastify';

const SearchResults: React.FC = () => {
  const [movies, setMovies] = useState<MovieDetailDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { handleAddToFavorites } = useFavorites();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastMovieRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.isIntersecting && hasMore && !loading) {
        fetchMovies();
      }
    }, { threshold: 1.0 });

    if (lastMovieRef.current) {
      observer.current.observe(lastMovieRef.current);
    }

    return () => {
      if (lastMovieRef.current && observer.current) {
        observer.current.unobserve(lastMovieRef.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (query.trim() !== '') {
      setMovies([]); 
      setPage(1);    
      setHasMore(true);
      setLoading(false);

    
      if (!isInitialMount.current) {
        fetchMovies();
      } else {
        isInitialMount.current = false;
      }
    }
  }, [query]);

  const fetchMovies = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await searchMovies(page, query);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      toast.error('Erro ao buscar os filmes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="movie-list-container">
        {movies.length === 0 && loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : (
          <>
            {movies.length > 0 && (
              <>
                <h1 className='title'>Resultado de pesquisa para: {query}</h1>
                <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} />
              </>
            )}
            {hasMore && (
              <div className='page-load-progress' ref={lastMovieRef}>
                {loading && <CircularProgress color="warning" size={30} />}
              </div>
            )}
            {!hasMore && movies.length === 0 && <p className='title'>Sem filmes encontrados</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
