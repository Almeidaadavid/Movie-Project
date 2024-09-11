import React, { useEffect, useState, useRef } from 'react';
import { getPopularMovies } from '../services/movieService';
import { MovieDetailDTO } from '../types/movieTypes';
import MovieList from '../components/MovieList';
import { useFavorites } from '../context/FavoriteContext';
import '../styles/Home.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<MovieDetailDTO[]>([]);
  const { handleAddToFavorites } = useFavorites();
  const [loading, setLoading] = useState<boolean>(false);
  const lastMovieRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
  
    observer.current = new IntersectionObserver((entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.isIntersecting && hasMore && !loading) {
        fetchMovies();
      }
    });

    if (lastMovieRef.current) {
      observer.current.observe(lastMovieRef.current);
    }

    return () => {
      if (lastMovieRef.current && observer.current) {
        observer.current.unobserve(lastMovieRef.current);
      }
    };
  }, [movies, hasMore, loading]);

  const fetchMovies = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const data = await getPopularMovies(page);
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
      <main className="home-container">
        {movies.length === 0 && loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : (
          <>
            <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} />
            {hasMore && (
              <div className='page-load-progress' ref={lastMovieRef}>
                {loading && <CircularProgress  color="warning" size={30} />}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
