import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import { MovieDetailDTO } from '../types/movieTypes';
import MovieList from '../components/MovieList';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useFavorites } from '../context/FavoriteContext';

const SearchResults: React.FC = () => {
  const [movies, setMovies] = useState<MovieDetailDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { handleAddToFavorites } = useFavorites();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    if (query.trim() !== '') {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const data = await searchMovies(query);
          setMovies(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }
  }, [location.search]);

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      <div className="movie-list-container">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : movies.length > 0 ? (
          <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} />
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
