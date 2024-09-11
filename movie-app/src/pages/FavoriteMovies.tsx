import React, { useEffect, useState } from 'react';
import { getFavoriteMovies } from '../services/movieService';
import { MovieDetailDTO } from '../types/movieTypes';
import MovieList from '../components/MovieList';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useFavorites } from '../context/FavoriteContext';
import { useNavigate } from 'react-router-dom';

const FavoriteMovies : React.FC = () => {
    const [movies, setMovies] = useState<MovieDetailDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { favorites, handleAddToFavorites } = useFavorites();
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/');
            return;
        }
        
        const getMovies = async () => {
        setLoading(true);
        try {
            const data = await getFavoriteMovies();
            setMovies(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
        };

        getMovies();

    }, [favorites]);

    return (
        <div>
        <div className="movie-list-container">
            {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress color="secondary" size={60} />
            </Box>
            ) : movies.length > 0 ? (
            <>
                <h1 className='title'>Filmes favoritos</h1>
                <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} />
            </>
            ) : (
            <p className='title'>Sem filmes encontrados.</p>
            )}
        </div>
    </div>
    )
}

export default FavoriteMovies;