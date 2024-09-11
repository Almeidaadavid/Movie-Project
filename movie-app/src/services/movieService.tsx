import api from "./api";
import {  MovieDetailDTO } from "../types/movieTypes";

export const getPopularMovies = async(page: number): Promise<MovieDetailDTO[]> => {
  if (!page) {
    throw new Error("Page parameter is required");
  }
  try {
    const response = await api.get(`/movies/get-all-movies`, {
      params: {
        page: page
      }
    });
    return response.data;
  } catch(error) {
    console.error('Error searching movies:', error);
        throw error;
  }
}
  export const searchMovies = async (page: number, query: string): Promise<MovieDetailDTO[]> => {
    debugger
    if (!query) {
        throw new Error("Query parameter is required");
    }
    try {
        const response = await api.get(`/movies/search-movies`, {
            params: {
                page: page,
                query: query
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error searching movies:', error);
        throw error;
    }
  };


  export const getMovieDetails = async (movieId: number): Promise<MovieDetailDTO> => {
    const response = await api.get(`/movies/get-movie-details/${movieId}`);
    return response.data;
  };

  export const addFavoriteMovie = async (movieId: number) => {
    const response = await api.post(`/favoritemovie/add-favorite-movie/${movieId}`);
    return response.data;
  };

  export const removeFavoriteMovie = async (movieId: number) => {
    const response = await api.delete(`/favoritemovie/delete-favorite-movie/${movieId}`);
    return response.data;
  };

  export const getFavoriteMovies = async(): Promise<MovieDetailDTO[]> => {
    const response = await api.get('/favoritemovie/get-favorite-movies');
    return response.data;
  }