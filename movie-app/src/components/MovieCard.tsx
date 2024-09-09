import React, { useState } from 'react';
import { Movie, MovieDetailDTO } from '../types/movieTypes';
import { Card, CardContent, CardMedia, IconButton, Box, Tooltip, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import '../styles/MovieCard.css';
import { useFavorites } from '../context/FavoriteContext';
import { getMovieDetails } from '../services/movieService';
import MovieDetailModal from './ModalMovieDetail';

interface MovieCardProps {
  movie: MovieDetailDTO;
  onToggleFavorite: (movieId: number) => void;
  isUserLoggedIn: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleFavorite, isUserLoggedIn }) => {
  const { favorites } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetailDTO | null>(null);

  const isFavorite = isUserLoggedIn && favorites.includes(movie.id);

  const handleOpenModal = async () => {
    try {
      const details = await getMovieDetails(movie.id);
      setMovieDetails({
        id: details.id,
        title: details.title,
        description: details.description,
        date: details.date,
        posterPath: details.posterPath,
        rating: details.rating,
        budget: details.budget,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="movie-card">
        <CardMedia
          component="img"
          image={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
          alt={movie.title}
        />
        <CardContent className="movie-card-content">
          <Tooltip title={movie.title} arrow>
            <Typography className="movie-title" variant="h6">
              {movie.title}
            </Typography>
          </Tooltip>
          <Tooltip title={movie.description} arrow>
            <Typography className="movie-description" variant="body2">
              {movie.description ? movie.description : 'Sem descrição disponível para o idioma.'}
            </Typography>
          </Tooltip>
        </CardContent>
        <Box className="action-buttons">
          <IconButton onClick={handleOpenModal}>
            <InfoIcon />
          </IconButton>
          <IconButton onClick={() => onToggleFavorite(movie.id)}>
            <FavoriteIcon className={isFavorite ? 'favorite-icon favorite' : 'favorite-icon not-favorite'} />
          </IconButton>
        </Box>
      </Card>

      {isModalOpen && (
        <MovieDetailModal
          movie={movieDetails}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default MovieCard;