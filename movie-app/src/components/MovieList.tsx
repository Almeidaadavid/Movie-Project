import React from "react";
import { MovieDetailDTO } from "../types/movieTypes";
import MovieCard from "./MovieCard";
import '../styles/MovieList.css';

interface MovieListProps {
  movies: MovieDetailDTO[];
  onAddToFavorites: (movieId: number) => void;
}

const isUserLoggdIn = () => {
  let token = localStorage.getItem('authToken');

  if (!token) {
    return false;
  }
  return true;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onAddToFavorites }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleFavorite={onAddToFavorites}
          isUserLoggedIn={isUserLoggdIn()}
        />
      ))}
    </div>
  );
};

export default MovieList;