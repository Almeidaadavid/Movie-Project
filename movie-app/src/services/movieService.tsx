import api from "./api";
import {  MovieDetailDTO } from "../types/movieTypes";

export const getPopularMovies = async(): Promise<MovieDetailDTO[]> => {
    const response = await api.get('/movies/getallmovies');
    return response.data;
}

export const searchMovies = async (query: string): Promise<MovieDetailDTO[]> => {
    if (!query) {
        throw new Error("Query parameter is required");
    }
    try {
        const response = await api.get(`/movies`, {
            params: {
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
    const response = await api.get(`/movies/getmoviedetails/${movieId}`);
    return response.data;
  };

  export const addFavoriteMovie = async (movieId: number) => {
    const response = await api.post(`/favoritemovie/addfavoritemovie/${movieId}`);
    return response.data;
  };

  export const removeFavoriteMovie = async (movieId: number) => {
    const response = await api.delete(`/favoritemovie/deletefavoritemovie/${movieId}`);
    return response.data;
  };

  export const getFavoriteMovies = async(): Promise<MovieDetailDTO[]> => {
    const response = await api.get('/favoritemovie/getfavoritemovies');
    return response.data;
  }