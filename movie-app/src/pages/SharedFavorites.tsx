import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MovieDetailDTO } from '../types/movieTypes';
import MovieList from '../components/MovieList';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useFavorites } from '../context/FavoriteContext';
import {GetFavoritesWithToken} from '../services/shareFavorite'

const SharedFavorites: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [movies, setMovies] = useState<MovieDetailDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { handleAddToFavorites } = useFavorites();

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const data = await GetFavoritesWithToken(token);
                setMovies(data);
            } catch (error) {
                console.error('Erro ao buscar favoritos compartilhados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token]);

    return (
        <div>
            <div className="movie-list-container">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress color="secondary" size={60} />
                    </Box>
                ) : movies.length > 0 ? (
                    <>
                        <h1 className='title'>Filmes Favoritos Compartilhados</h1>
                        <MovieList movies={movies} onAddToFavorites={handleAddToFavorites} />
                    </>
                ) : (
                    <p className='title'>Nenhum filme encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default SharedFavorites;
