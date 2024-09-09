import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getPopularMovies();
        setMovies(data);
      } catch (error) {
        toast.error('Erro ao buscar os filmes');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <main className="home-container">
        <h1 className="home-title">Popular Movies</h1>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} /> }
      </main>
    </div>
  );
};

export default Home;
